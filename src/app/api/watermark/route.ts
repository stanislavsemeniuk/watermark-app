import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const watermarkText = formData.get("watermarkText") as string;
  const color = formData.get("color") as string;
  const imageFiles = formData.getAll("images") as File[];
  
  const watermarkedImages: string[] = [];

  for (const imageFile of imageFiles) {
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const metadata = await sharp(imageBuffer).metadata();
    const { width, height } = metadata;
    const minDimension = Math.min(width!, height!);
    const fontSize = Math.floor(minDimension * 0.12);
    const escapedWatermarkText = watermarkText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const watermarkedBuffer = await sharp(imageBuffer)
      .composite([
        {
          input: Buffer.from(`
            <svg width="${width}" height="${height}">
              <text  x="${width! / 2}" y="${height! / 2}" font-size="${fontSize}" 
              transform="rotate(45 ${(width || 0) / 2} ${(height || 0) / 2})"
              dominant-baseline="middle" text-anchor="middle" fill="${color || '#fff'}">${escapedWatermarkText}</text>
            </svg>
          `),
          gravity: "center",
        },
      ])
      .jpeg()
      .toBuffer();
    const watermarkedImageBase64 = `data:image/png;base64,${watermarkedBuffer.toString("base64")}`;
    watermarkedImages.push(watermarkedImageBase64);
  }

  return NextResponse.json({ watermarkedImages });
}
