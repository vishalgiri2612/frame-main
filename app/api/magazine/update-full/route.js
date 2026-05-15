import { getDb } from "@/lib/mongodb";
import { generateMagazineContent } from "@/lib/ai";
import { generateMagnificImage } from "@/lib/magnific";
import { EDITORIAL_SLOTS } from "@/config/magazine";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

/**
 * FULL MAGAZINE REFRESH
 * 
 * This API wipes all current articles and regenerates EVERY slot (5 articles total).
 * Supports both POST and GET.
 */
export async function GET(req) {
  return handleFullUpdate(req);
}

export async function POST(req) {
  return handleFullUpdate(req);
}

async function handleFullUpdate(req) {
  try {
    const { searchParams } = new URL(req.url);
    const targetSlotId = searchParams.get('slotId');

    const db = await getDb();
    const col = db.collection("magazine_articles");

    // If a specific slot is requested, only update that one
    if (targetSlotId) {
      const slot = EDITORIAL_SLOTS.find(s => s.id === targetSlotId);
      if (!slot) throw new Error(`Invalid slotId: ${targetSlotId}`);

      console.log(`\n📰 Granular Refresh: Slot [${slot.id}]...`);
      
      // Delete old version of THIS slot
      await col.deleteMany({ slotId: slot.id });

      // Generate Text
      const content = await generateMagazineContent(slot, []);

      // Generate Image
      const imagePrompt = content.imagePrompt || `${slot.style}, high fashion editorial photography, ${slot.setting}, professional lighting`;
      const imageUrl = await generateMagnificImage(imagePrompt, 'portrait_2_3', slot.fallbackImage);

      const newArticle = {
        title:       content.title,
        tag:         slot.tag,
        excerpt:     content.excerpt,
        readTime:    content.readTime || '4 min',
        imagePrompt: imagePrompt,
        image:       imageUrl,
        slotId:      slot.id,
        slotOrder:   slot.slotOrder,
        createdAt:   new Date(),
        status:      "ACTIVE",
      };

      const result = await col.insertOne(newArticle);

      // Force Next.js to clear cache for the magazine and homepage
      revalidatePath('/');
      revalidatePath('/magazine');

      return NextResponse.json({
        success: true,
        slotId: slot.id,
        title: newArticle.title,
        article: { ...newArticle, _id: result.insertedId }
      });
    }

    // LEGACY: Full loop (if no slotId provided)
    console.log("🔥 STARTING FULL MAGAZINE REFRESH (Sequential)...");
    await col.deleteMany({});
    
    revalidatePath('/');
    revalidatePath('/magazine');

    return NextResponse.json({ success: true, message: "Use slotId param for granular updates." });

  } catch (error) {
    console.error("FULL_UPDATE_ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to refresh magazine" },
      { status: 500 }
    );
  }
}
