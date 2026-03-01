import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "us-east-1",
  endpoint: `http://${process.env.MINIO_ENDPOINT || "localhost"}:${process.env.MINIO_PORT || 9000}`,
  forcePathStyle: true,
  credentials: {
    accessKeyId:
      process.env.MINIO_ACCESS_KEY || process.env.MINIO_ROOT_USER || "admin",
    secretAccessKey:
      process.env.MINIO_SECRET_KEY ||
      process.env.MINIO_ROOT_PASSWORD ||
      "SuperSecretPassword123!",
  },
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uniqueFilename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const bucketName = process.env.MINIO_BUCKET_NAME || "gdpatisserie";

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueFilename,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    // Attention : en production, il faudra utiliser votre vrai nom de domaine
    const publicUrl = `http://localhost:9000/${bucketName}/${uniqueFilename}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Erreur d'upload :", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload" },
      { status: 500 },
    );
  }
}
