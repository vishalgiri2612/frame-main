import { getDb } from "@/lib/mongodb";
import { generateMagazineContent } from "@/lib/ai";
import { generateMagnificImage, SLOT_FALLBACKS } from "@/lib/magnific";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const CELEBRITY_SLOT = {
  id: "celebrity",
  label: "Celebrity Sunglasses — Stars and Their Iconic Eyewear",
  style: "Oversized bold celebrity sunglasses",
  tag: "Celebrity Sightings",
  contentType: "Celebrity eyewear feature",
  tone: "Exciting, name-dropping, aspirational. Reference real A-list celebrities and their signature sunglass styles.",
  setting: "glamorous paparazzi moment or red carpet event",
  slotOrder: 0,
  fallbackImage: SLOT_FALLBACKS.celebrity,
};

/**
 * FORCED UPDATE: Celebrity Watch
 * 
 * This API deletes the existing celebrity article and generates a brand new one.
 * Supports both POST and GET (for browser-based triggering).
 */
export async function GET(req) {
  return handleUpdate(req);
}

export async function POST(req) {
  return handleUpdate(req);
}

async function handleUpdate(req) {
  try {
    const db = await getDb();
    const col = db.collection("magazine_articles");

    console.log("🚀 Starting Forced Refresh for [Celebrity Watch]...");

    // 1. Delete existing celebrity entry to make room
    const deleteResult = await col.deleteMany({ slotId: "celebrity" });
    console.log(`🗑️ Removed ${deleteResult.deletedCount} old celebrity articles.`);

    // 2. Generate AI content
    const content = await generateMagazineContent(CELEBRITY_SLOT, []);

    // 3. Generate image via Magnific
    const imagePrompt = content.imagePrompt || `${CELEBRITY_SLOT.style}, high fashion editorial photography, model wearing sunglasses, ${CELEBRITY_SLOT.setting}, professional lighting, ultra-realistic`;
    console.log(`🎨 Generating Celebrity Image: ${imagePrompt}`);

    const imageUrl = await generateMagnificImage(
      imagePrompt,
      'portrait_2_3',
      CELEBRITY_SLOT.fallbackImage
    );

    // 4. Save to DB
    const newArticle = {
      title:       content.title,
      tag:         CELEBRITY_SLOT.tag,
      excerpt:     content.excerpt,
      readTime:    content.readTime || '3 min',
      imagePrompt: imagePrompt,
      image:       imageUrl,
      slotId:      CELEBRITY_SLOT.id,
      slotOrder:   CELEBRITY_SLOT.slotOrder,
      createdAt:   new Date(),
      status:      "ACTIVE",
    };

    const result = await col.insertOne(newArticle);
    console.log(`✅ SUCCESS: Celebrity Watch updated with title: "${newArticle.title}"`);

    return NextResponse.json({
      success: true,
      message: "Celebrity Watch updated successfully",
      article: { ...newArticle, _id: result.insertedId }
    });

  } catch (error) {
    console.error("CELEBRITY_UPDATE_ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update celebrity watch" },
      { status: 500 }
    );
  }
}
