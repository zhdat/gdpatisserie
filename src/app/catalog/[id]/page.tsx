import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import AddToCartButton from "@/components/add-to-cart-button";
import { formatPrice } from "@/lib/format-price";
import { Badge } from "@/components/ui/badge";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product || product.isArchived) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Pas d&#39;image disponible
            </div>
          )}
        </div>

        {/* Détails du produit */}
        <div className="flex flex-col gap-6">
          <div>
            <Badge variant="outline" className="mb-2">
              {product.category.name}
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-2xl font-semibold text-primary mt-2">
              {formatPrice(product.price)}
            </p>
          </div>

          <div className="prose prose-sm text-gray-600">
            <h3 className="text-lg font-medium text-gray-900">Description</h3>
            <p>
              {product.description ||
                "Aucune description fournie pour ce délice."}
            </p>
          </div>

          <div className="space-y-4 border-t pt-4 mt-4">
            {product.weight && (
              <p className="text-sm text-gray-500">
                <span className="font-bold">Format :</span> {product.weight}
              </p>
            )}
            {product.allergens && (
              <div className="bg-orange-50 p-3 rounded-md">
                <p className="text-sm text-orange-800">
                  <span className="font-bold">Allergènes :</span>{" "}
                  {product.allergens}
                </p>
              </div>
            )}
            {product.storage && (
              <p className="text-sm text-blue-600 italic">
                ℹ️ {product.storage}
              </p>
            )}
          </div>

          <div className="mt-4 pt-6 border-t">
            {product.isAvailable ? (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-green-600 font-medium italic">
                  ✓ Disponible pour commande
                </p>
                {/* Réutilisation de votre composant panier */}
                <AddToCartButton product={product} />
              </div>
            ) : (
              <p className="text-sm text-red-500 font-medium">
                Indisponible temporairement
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
