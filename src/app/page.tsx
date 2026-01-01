import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AddToCartButton from "@/components/add-to-cart-button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // On récupère SEULEMENT les 3 derniers produits "Featured"
  const latestProducts = await prisma.product.findMany({
    where: { isAvailable: true, isArchived: false },
    take: 3, // Limite à 3
    orderBy: { createdAt: "desc" }, // Les plus récents
    include: { category: true },
  });

  return (
    <main className="min-h-screen bg-slate-50">
      {/* --- HERO SECTION --- */}
      <section className="relative bg-slate-900 text-white py-32 text-center overflow-hidden">
        {/* Tu pourras ajouter une image de fond ici plus tard */}
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <Badge className="mb-4 bg-amber-500 hover:bg-amber-600">
            Artisan Pâtissier à Marseille
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-serif">
            Le goût de l&apos;authentique
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Découvrez nos créations faites maison. Commandez en ligne et
            faites-vous livrer la douceur directement chez vous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog">
              <Button
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg"
              >
                Commander maintenant
              </Button>
            </Link>
            <Link href="/catalog?category=chocolats">
              <Button
                size="lg"
                variant="outline"
                className="text-amber-500 border-amber-500 hover:bg-amber-950 px-8 py-6 text-lg"
              >
                Nos Chocolats
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- SECTION "LES NOUVEAUTÉS" --- */}
      <section className="max-w-7xl mx-auto py-20 px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Les Nouveautés
            </h2>
            <p className="text-slate-500 mt-2">
              Nos dernières créations sorties du four.
            </p>
          </div>
          <Link
            href="/catalog"
            className="hidden md:flex items-center text-amber-700 font-semibold hover:underline"
          >
            Voir toute la carte <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestProducts.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all"
            >
              <div className="relative h-64 w-full bg-slate-200 overflow-hidden">
                {product.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute top-3 left-3">
                  <Badge className="bg-white/90 text-black hover:bg-white">
                    {product.category.name}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl group-hover:text-amber-700 transition-colors">
                    {product.name}
                  </CardTitle>
                  <span className="font-bold text-lg">
                    {product.price.toFixed(2)} €
                  </span>
                </div>
                <CardDescription className="line-clamp-2">
                  {product.description}
                </CardDescription>
              </CardHeader>

              <CardFooter>
                <AddToCartButton product={product} />
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link href="/catalog">
            <Button variant="outline" className="w-full">
              Voir toute la carte
            </Button>
          </Link>
        </div>
      </section>

      {/* --- SECTION CONCEPT / ABOUT (Optionnel) --- */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Un savoir-faire artisanal</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            Chez GD Pâtisserie, nous ne travaillons qu&apos;avec des produits
            frais et de saison. Pas de stocks industriels, tout est préparé à la
            commande pour garantir une qualité exceptionnelle.
            <br />
            Basé à Marseille, nous avons à cœur de vous régaler.
          </p>
          {/* Tu pourras mettre une photo du pâtissier ici plus tard */}
        </div>
      </section>
    </main>
  );
}
