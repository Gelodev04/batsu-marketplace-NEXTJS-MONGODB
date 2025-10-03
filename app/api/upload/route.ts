import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  const form = await req.formData();
  const files = form.getAll("files") as File[];
  if (!files || files.length === 0) {
    return NextResponse.json({ error: "No files" }, { status: 400 });
  }

  try {
    const uploads = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return new Promise<string>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "bsu-marketplace", resource_type: "image" },
            (err, result) => {
              if (err || !result) return reject(err);
              resolve(result.secure_url);
            }
          );
          stream.end(buffer);
        });
      })
    );

    return NextResponse.json({ urls: uploads });
  } catch (e) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
