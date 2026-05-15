import { getDb } from "@/lib/mongodb";
import { generateMagazineContent } from "@/lib/ai";
import { generateMagnificImage, SLOT_FALLBACKS } from "@/lib/magnific";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

/**
 * FIVE EDITORIAL SLOTS — Sunglasses Magazine
 *
 * Each slot maps to ONE magazine page (left=image, right=content).
 * Content types match the user's requirements:
 *   1. celebrity  — Celebrity spotted wearing sunglasses
 *   2. bestseller — Best-selling sunglasses styles
 *   3. model      — Fashion model editorial shoot
 *   4. detail     — Sunglasses design/craft detail feature
 *   5. street     — Street style / trend piece
 */
export const EDITORIAL_SLOTS = [
  {
    id: "celebrity",
    label: "Celebrity Sunglasses — Stars and Their Iconic Eyewear",
    style: "Oversized bold celebrity sunglasses",
    tag: "Celebrity Sightings",
    contentType: "Celebrity eyewear feature",
    tone: "Exciting, name-dropping, aspirational. Reference real A-list celebrities and their signature sunglass styles.",
    setting: "glamorous paparazzi moment or red carpet event",
    slotOrder: 0,
    fallbackImage: SLOT_FALLBACKS.celebrity,
  },
  {
    id: "bestseller",
    label: "Best-Selling Sunglasses — The Frames Everyone Is Buying Right Now",
    style: "Aviator / classic bestselling frames",
    tag: "Trend Alert",
    contentType: "Best-seller product editorial",
    tone: "Informative yet aspirational. Explain why these specific sunglasses sell out repeatedly and what makes them a must-own.",
    setting: "sleek fashion studio with product highlight lighting",
    slotOrder: 1,
    fallbackImage: SLOT_FALLBACKS.bestseller,
  },
  {
    id: "model",
    label: "Model Off-Duty Sunglasses — High Fashion Eyewear on the World's Top Models",
    style: "Cat-eye or statement editorial frames",
    tag: "Red Carpet",
    contentType: "Fashion model editorial",
    tone: "High-fashion, dramatic, Vogue-editorial. Focus on the model's look and how the sunglasses complete the ensemble.",
    setting: "luxury fashion studio with dramatic studio lighting",
    slotOrder: 2,
    fallbackImage: SLOT_FALLBACKS.model,
  },
  {
    id: "detail",
    label: "The Craft — Inside the Making of Luxury Sunglasses",
    style: "Artisan luxury frames with visible craftsmanship details",
    tag: "Style Guide",
    contentType: "Sunglasses design and craftsmanship feature",
    tone: "Intellectual, connoisseur-level. Explain materials (acetate, titanium), hinge design, lens technology, and why details matter.",
    setting: "close-up detail shot on a luxury background",
    slotOrder: 3,
    fallbackImage: SLOT_FALLBACKS.detail,
  },
  {
    id: "street",
    label: "Street Style Sunglasses — The Looks Taking Over City Streets",
    style: "Trendy round or shield street-style frames",
    tag: "Style Guide",
    contentType: "Street style sunglasses trend piece",
    tone: "Cool, urban, trend-aware. Reference street style weeks in major cities (Milan, Tokyo, NYC) and how real people style sunglasses.",
    setting: "vibrant city street during golden hour",
    slotOrder: 4,
    fallbackImage: SLOT_FALLBACKS.street,
  },
];

export async function POST(req) {
  try {
    const db = await getDb();
    const col = db.collection("magazine_articles");

    // 1. Find which slots are currently filled
    const existing = await col
      .find({ status: "ACTIVE", slotId: { $exists: true } })
      .project({ slotId: 1, title: 1 })
      .toArray();

    const usedSlotIds = new Set(existing.map((a) => a.slotId));
    const existingTitles = existing.map((a) => a.title).filter(Boolean);

    // 2. Pick next unfilled slot (in order); if all filled, replace the oldest
    let targetSlot = EDITORIAL_SLOTS.find((s) => !usedSlotIds.has(s.id));

    if (!targetSlot) {
      const oldest = await col
        .find({ status: "ACTIVE", slotId: { $exists: true } })
        .sort({ createdAt: 1 })
        .limit(1)
        .toArray();

      if (oldest.length > 0) {
        await col.deleteOne({ _id: oldest[0]._id });
        targetSlot = EDITORIAL_SLOTS.find((s) => s.id === oldest[0].slotId) || EDITORIAL_SLOTS[0];
      } else {
        targetSlot = EDITORIAL_SLOTS[0];
      }
    }

    console.log(`\n📰 Slot: "${targetSlot.id}" — ${targetSlot.label}`);

    // 3. Generate AI article content (OpenRouter → Gemini fallback)
    const content = await generateMagazineContent(targetSlot, existingTitles);

    // 4. Generate the image via Magnific using the AI's imagePrompt
    const imagePrompt = content.imagePrompt || `${targetSlot.style}, high fashion editorial photography, model wearing sunglasses, ${targetSlot.setting}, professional lighting, ultra-realistic`;
    console.log(`🎨 Image prompt: ${imagePrompt}`);

    const imageUrl = await generateMagnificImage(
      imagePrompt,
      'portrait_2_3',
      targetSlot.fallbackImage
    );

    // 5. Save to MongoDB
    const newArticle = {
      title:       content.title,
      tag:         targetSlot.tag,  // enforce slot tag
      excerpt:     content.excerpt,
      readTime:    content.readTime || '3 min',
      imagePrompt: imagePrompt,
      image:       imageUrl,
      slotId:      targetSlot.id,
      slotOrder:   targetSlot.slotOrder,
      createdAt:   new Date(),
      status:      "ACTIVE",
    };

    const result = await col.insertOne(newArticle);
    console.log(`✅ Saved article: "${newArticle.title}"`);

    return NextResponse.json({
      success: true,
      data: { ...newArticle, _id: result.insertedId },
    });
  } catch (error) {
    console.error("MAGAZINE_GENERATE_ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Generation failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "POST to this endpoint to generate one magazine article." });
}
