import ProductForm from "../product-form";
import { createProduct } from "@/app/admin/products/action";
import { prisma } from "@/lib/db"; // Import du formulaire

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany();

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Ajouter un produit</h1>
      <ProductForm categories={categories} action={createProduct} />
    </div>
  );
}
