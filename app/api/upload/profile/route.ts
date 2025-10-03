import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "bsu-marketplace/profiles",
          resource_type: "image",
          transformation: [
            { width: 200, height: 200, crop: "fill", gravity: "face" },
          ],
        },
        (err, result) => {
          if (err || !result) return reject(err);
          resolve(result.secure_url);
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json({ url: result });
  } catch (error) {
    console.error("Profile image upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
