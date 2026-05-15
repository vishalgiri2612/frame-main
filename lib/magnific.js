/**
 * lib/magnific.js
 * Magnific Flux Pro 1.1 — AI Image Generation
 *
 * ⚠️ IMPORTANT: Magnific returns EPHEMERAL signed URLs that expire in ~15 minutes.
 *    URL path contains "/ephemeral/" which confirms this.
 *    We MUST upload the image to Cloudinary immediately after generation
 *    to get a permanent URL before saving to MongoDB.
 *
 * Full flow:
 *   1. POST to Magnific → get task_id
 *   2. Poll until COMPLETED → get ephemeral image URL
 *   3. Upload ephemeral URL to Cloudinary → get permanent URL ✅
 *   4. Return permanent Cloudinary URL (never expires)
 */

import { v2 as cloudinary } from 'cloudinary';

const MAGNIFIC_BASE = 'https://api.magnific.com/v1/ai/text-to-image/flux-pro-v1-1';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Configure Cloudinary once
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Unsplash fallbacks per slot — permanent URLs, model wearing sunglasses (verified)
 */
export const SLOT_FALLBACKS = {
  celebrity:  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1080&auto=format&fit=crop',
  bestseller: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1080&auto=format&fit=crop',
  model:      'https://images.unsplash.com/photo-1536766768598-e09213fdcf22?q=80&w=1080&auto=format&fit=crop',
  detail:     'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?q=80&w=1080&auto=format&fit=crop',
  street:     'https://images.unsplash.com/photo-1519419166318-4f5978601b64?q=80&w=1080&auto=format&fit=crop',
};

/**
 * Upload any image URL to Cloudinary and return a permanent URL.
 * Cloudinary fetches the image server-side, so ephemeral URLs work fine.
 */
async function uploadToCloudinary(ephemeralUrl) {
  console.log('[Cloudinary] Uploading ephemeral image to get permanent URL...');
  try {
    const result = await cloudinary.uploader.upload(ephemeralUrl, {
      folder:        'frame-magazine',
      resource_type: 'image',
      // Optimize for web delivery
      transformation: [
        { quality: 'auto:good', fetch_format: 'auto' }
      ],
    });
    console.log('[Cloudinary] ✅ Permanent URL:', result.secure_url);
    return result.secure_url;
  } catch (err) {
    console.error('[Cloudinary] Upload failed:', err.message);
    throw err; // Let caller handle fallback
  }
}

/**
 * Generate an image via Magnific Flux Pro 1.1, then persist it to Cloudinary.
 *
 * @param {string} prompt        - Descriptive image prompt
 * @param {string} aspectRatio   - Magnific aspect ratio enum (default: 'portrait_2_3')
 * @param {string} fallbackUrl   - URL to return if everything fails
 * @returns {Promise<string>}    - Permanent Cloudinary URL (or fallback)
 */
export async function generateMagnificImage(
  prompt,
  aspectRatio = 'portrait_2_3',
  fallbackUrl = null
) {
  const apiKey = process.env.MAGNIFIC_API_KEY;

  if (!apiKey || apiKey === 'your_magnific_api_key_here') {
    console.warn('[Magnific] No API key — using Unsplash fallback.');
    return fallbackUrl || SLOT_FALLBACKS.model;
  }

  try {
    // ── 1. Create the generation task ───────────────────────────────────
    const createRes = await fetch(MAGNIFIC_BASE, {
      method: 'POST',
      headers: {
        'Content-Type':       'application/json',
        'x-magnific-api-key': apiKey,
      },
      body: JSON.stringify({
        prompt,
        aspect_ratio:       aspectRatio,
        output_format:      'jpeg',
        safety_tolerance:   2,
        prompt_upsampling:  true,
      }),
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      throw new Error(`Magnific create failed ${createRes.status}: ${errText}`);
    }

    const { data: task } = await createRes.json();
    const taskId = task.task_id;
    console.log(`[Magnific] Task created: ${taskId}`);

    // ── 2. Poll until COMPLETED (max 90s = 18 × 5s) ─────────────────────
    let ephemeralUrl = null;

    for (let attempt = 1; attempt <= 18; attempt++) {
      await sleep(5000);

      const pollRes = await fetch(`${MAGNIFIC_BASE}/${taskId}`, {
        headers: { 'x-magnific-api-key': apiKey },
      });

      if (!pollRes.ok) continue;

      const { data } = await pollRes.json();
      console.log(`[Magnific] Poll ${attempt}: ${data.status}`);

      if (data.status === 'COMPLETED' && data.generated?.length > 0) {
        ephemeralUrl = data.generated[0];
        console.log(`[Magnific] ✅ Ephemeral URL: ${ephemeralUrl}`);
        break;
      }

      if (data.status === 'FAILED') {
        throw new Error('Magnific task FAILED');
      }
    }

    if (!ephemeralUrl) throw new Error('Magnific timed out — no image returned');

    // ── 3. Upload to Cloudinary IMMEDIATELY before URL expires ──────────
    //    Cloudinary fetches it server-side within seconds, well before expiry
    const permanentUrl = await uploadToCloudinary(ephemeralUrl);
    return permanentUrl;

  } catch (err) {
    console.error('[Magnific→Cloudinary] Error:', err.message, '— using fallback.');
    return fallbackUrl || SLOT_FALLBACKS.model;
  }
}
