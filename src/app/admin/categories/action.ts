"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;

  if (!name) {
    throw new Error("Le nom de la catégorie est requis");
  }

  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/(^-|-$)+/g, "");

  try {
    await prisma.category.create({
      data: {
        name,
        slug,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la création de la catégorie:", error);
    throw new Error("Cette catégorie existe peut-être déjà.");
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products/new");

  redirect("/admin/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  if (!name) throw new Error("Le nom de la catégorie est requis");

  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/(^-|-$)+/g, "");

  try {
    await prisma.category.update({
      where: { id },
      data: { name, slug },
    });
  } catch (error) {
    console.error("Erreur Prisma lors de la création :", error);

    throw new Error("Cette catégorie existe peut-être déjà.");
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  // 1. Sécurité : Vérifier si des produits utilisent cette catégorie
  const productsCount = await prisma.product.count({
    where: { categoryId: id },
  });

  if (productsCount > 0) {
    throw new Error(
      "Impossible de supprimer cette catégorie car elle contient des produits.",
    );
  }

  // 2. Si elle est vide, on supprime
  await prisma.category.delete({
    where: { id },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products/new");
}
