"use server"; // Dit à NextJS que ce code est exécuté côté serveur
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// fonction appelée quand le formulaire sera rempli
export async function createProduct(formData: FormData) {
  // 1. Récupérer les données du formulaire
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = Number.parseFloat(formData.get("price") as string);
  const categoryId = formData.get("categoryId") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const weight = formData.get("weight") as string;
  const allergens = formData.get("allergens") as string;
  const storage = formData.get("storage") as string;

  const isAvailable = formData.get("isAvailable") === "true";

  // 2. Crée le produit en base
  await prisma.product.create({
    data: {
      name,
      description,
      price,
      categoryId,
      imageUrl,
      isAvailable: isAvailable, // Par défaut
      weight,
      allergens,
      storage,
    },
  });

  // 3. Rafraîchir la liste des produits
  revalidatePath("/admin/products");

  // 4. Rediriger vers les produits
  redirect("/admin/products");
}

// Action de Mise à jour
export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = Number.parseFloat(formData.get("price") as string);
  const categoryId = formData.get("categoryId") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const weight = formData.get("weight") as string;
  const allergens = formData.get("allergens") as string;
  const storage = formData.get("storage") as string;

  const isAvailable = formData.get("isAvailable") === "true";

  await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      price,
      imageUrl,
      categoryId,
      isAvailable: isAvailable,
      weight,
      allergens,
      storage,
    },
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

// Action de Suppression
export async function deleteProduct(id: string) {
  try {
    // AU LIEU DE DELETE, ON FAIT UN UPDATE
    await prisma.product.update({
      where: { id },
      data: {
        isArchived: true, // On l'archive
        isAvailable: false, // On s'assure qu'il n'est plus achetable
      },
    });

    revalidatePath("/admin/products");
  } catch (error) {
    console.error("Erreur archivage:", error);
  }
}

export async function toggleAvailability(id: string, isAvailable: boolean) {
  try {
    await prisma.product.update({
      where: { id },
      data: { isAvailable },
    });
    revalidatePath("/admin/products"); // Rafraîchit le tableau immédiatement
    revalidatePath("/"); // Rafraîchit aussi la page d'accueil client !
  } catch (error) {
    console.error("Erreur toggle:", error);
  }
}
