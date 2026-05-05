import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/server";
import { writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import fs from "fs";

export async function POST(request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Generate unique filename
    const uniqueSuffix = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.name) || '.png';
    const filename = `upload-${uniqueSuffix}${ext}`;
    
    // Save to public/uploads directory
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filepath = path.join(uploadDir, filename);

    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    await writeFile(filepath, buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error("UPLOAD_ERROR:", error);
    return NextResponse.json({ error: "File upload failed." }, { status: 500 });
  }
}
