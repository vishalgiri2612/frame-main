import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { email, code, password } = await req.json();

    if (!email || !code || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const db = await getDb();
    const user = await db.collection("users").findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });

    if (!user || !user.resetCodeHash || !user.resetCodeExpires) {
      return NextResponse.json({ error: "Invalid reset code" }, { status: 400 });
    }

    if (new Date(user.resetCodeExpires).getTime() < Date.now()) {
      return NextResponse.json({ error: "Reset code expired" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(code, user.resetCodeHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid reset code" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
        $unset: {
          resetCodeHash: "",
          resetCodeExpires: "",
        },
      }
    );

    return NextResponse.json({ message: "Password updated" });
  } catch (error) {
    console.error("RESET_PASSWORD_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
