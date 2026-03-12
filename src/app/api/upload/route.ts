import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uniqueFilename = `${Date.now()}-${file.name.replaceAll(/\s+/g, "-")}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");

    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Le dossier existe déjà, on ignore l'erreur
    }

    const filePath = path.join(uploadDir, uniqueFilename);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFilename}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Erreur d'upload :", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload" },
      { status: 500 },
    );
  }
}
