import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const watermarkText = formData.get("watermarkText") as string;
  const imageFiles = formData.getAll("images") as File[];
  
  const watermarkedImages: string[] = [];

  for (const imageFile of imageFiles) {
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const metadata = await sharp(imageBuffer).metadata();
    const { width, height } = metadata;
    const minDimension = Math.min(width!, height!);
    const fontSize = Math.floor(minDimension * 0.1);
    
    const watermarkedBuffer = await sharp(imageBuffer)
      .composite([
        {
          input: Buffer.from(`
            <svg width="${width}" height="${height}">
              <style>
                text {
                  font-family: 'Roboto', sans-serif;
                }
              </style>
              <text  x="${width! / 2}" y="${height! / 2}" font-size="${fontSize}" 
              dominant-baseline="middle" fill-opacity="0.7" text-anchor="middle" fill="#fff">${watermarkText}</text>
            </svg>
          `),
          gravity: "center",
        },
      ])
      .png()
      .toBuffer();
    const watermarkedImageBase64 = `data:image/png;base64,${watermarkedBuffer.toString("base64")}`;
    watermarkedImages.push(watermarkedImageBase64);
  }

  return NextResponse.json({ watermarkedImages });
}
