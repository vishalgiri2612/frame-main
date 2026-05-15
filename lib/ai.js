/**
 * lib/ai.js
 * OpenRouter — openai/gpt-oss-120b:free
 * Generates magazine article content for a specific sunglasses editorial slot.
 */

const OPENROUTER_BASE = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Generate magazine content via OpenRouter.
 * Falls back to Gemini if OpenRouter key is missing.
 *
 * @param {Object} slot - The editorial slot definition
 * @param {string[]} existingTitles - Already-used titles to avoid repeating
 */
export async function generateMagazineContent(slot, existingTitles = []) {
  const avoidLine = existingTitles.length
    ? `\nDO NOT repeat or paraphrase these already-published headlines:\n${existingTitles.map(t => `- "${t}"`).join('\n')}`
    : '';

  const systemPrompt = `You are the lead editor of "FRAME Magazine" — a world-class luxury publication exclusively dedicated to sunglasses culture, trends, and celebrity eyewear. Your writing style is sharp, authoritative, and aspirational — like Vogue meets GQ.`;

  const userPrompt = `Write a premium editorial piece for the section: "${slot.label}"
Content category: ${slot.contentType}
Tone: ${slot.tone}
${avoidLine}

STRICT RULES:
1. Topic MUST be about sunglasses ONLY — no other fashion items.
2. Be specific — name the sunglasses style (${slot.style}).
3. For Celebrity sightings, reference specific A-list Hollywood and Bollywood actors/models. Describe their iconic look, facial features, and style in detail.
4. The person in the story and image MUST be wearing the sunglasses — this is non-negotiable.
5. Title must be punchy, specific, and mention the sunglasses style clearly.
6. Excerpt must be between 60-80 words, written as a deep-dive editorial teaser that explains the cultural significance and fashion impact of the sunglasses.
7. The imagePrompt MUST begin with "A famous A-list Hollywood or Bollywood actor/model wearing luxury ${slot.style} sunglasses". Describe their specific facial features, hair, and high-fashion ensemble. Focus on a paparazzi or red carpet setting with realistic lighting.
8. The image must look like a real photograph from a celebrity event.

Return ONLY a valid JSON object, no markdown, no code blocks:
{
  "title": "Compelling magazine headline mentioning the specific sunglasses style",
  "tag": "${slot.tag}",
  "excerpt": "60-80 word in-depth editorial excerpt that provides rich context and style insights",
  "readTime": "4 min",
  "imagePrompt": "A famous A-list Hollywood or Bollywood actor/model wearing luxury sunglasses, [rest of the detailed photorealistic image prompt]"
}`;

  // ── Try OpenRouter first ─────────────────────────────────────────────
  const orKey = process.env.OPENROUTER_API_KEY;
  if (orKey && orKey !== 'your_openrouter_api_key_here') {
    try {
      const res = await fetch(OPENROUTER_BASE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${orKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://frame-magazine.com',
          'X-Title': 'FRAME Magazine',
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b:free',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user',   content: userPrompt },
          ],
          temperature: 0.85,
          max_tokens: 400,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const text = json.choices?.[0]?.message?.content || '';
        console.log(`[OpenRouter] Raw response [${slot.id}]:`, text);
        return parseJson(text);
      } else {
        console.warn('[OpenRouter] Non-OK response:', res.status, await res.text());
      }
    } catch (e) {
      console.warn('[OpenRouter] Error:', e.message, '— falling back to Gemini.');
    }
  }

  // ── Fallback: Gemini ─────────────────────────────────────────────────
  console.log(`[Gemini] Generating content for slot: ${slot.id}`);
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

  const geminiPrompt = `${systemPrompt}\n\n${userPrompt}`;
  const result = await model.generateContent(geminiPrompt);
  const text = result.response.text();
  console.log(`[Gemini] Raw response [${slot.id}]:`, text);
  return parseJson(text);
}

function parseJson(text) {
  const clean = text.replace(/```json|```/gi, '').trim();
  try {
    return JSON.parse(clean);
  } catch {
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Failed to parse AI JSON response');
  }
}
