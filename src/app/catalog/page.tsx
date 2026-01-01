import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import AddToCartButton from "@/components/add-to-cart-button"
import Link from "next/link"
import {cn} from "@/lib/utils"
import {Metadata} from "next";
import {prisma} from "@/lib/db";
import {SearchInput} from "@/components/search-input";

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Notre Carte",
  description: "Parcourez notre sélection de gâteaux, tartes et chocolats faits maison.",
}

// Props spéciales pour récupérer les paramètres d'URL (?category=...)
// Note: Dans Next.js 15, searchParams est une Promise
interface CatalogPageProps {
  searchParams: Promise<{ category?: string; q?: string }>
}

export default async function CatalogPage({searchParams}: Readonly<CatalogPageProps>) {
  // 1. On attend les paramètres
  const { category, q } = await searchParams // On récupère q

  // 2. On récupère les catégories pour le menu filtre
  const categories = await prisma.category.findMany()

  // 3. On construit le filtre Prisma
  const whereCondition: any = {
    isAvailable: true,
    isArchived: false,
  }

  // Si une catégorie est sélectionnée dans l'URL, on filtre
  if (category && category !== 'all') {
    whereCondition.category = {
      slug: category
    }
  }

  // AJOUT DU FILTRE DE RECHERCHE
  if (q) {
    whereCondition.name = {
      contains: q,
      mode: 'insensitive' // Pour ignorer majuscules/minuscules (Postgres)
    }
  }

  // 4. On récupère les produits filtrés
  const products = await prisma.product.findMany({
    where: whereCondition,
    include: {category: true},
    orderBy: {name: 'asc'}
  })

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4">

        <h1 className="text-3xl font-bold text-slate-900 mb-8">Notre Carte</h1>

        {/* AJOUT DE LA BARRE ICI */}
        <div className={"my-4"}>
        <SearchInput />
        </div>

        {/* --- FILTRES (Menu horizontal) --- */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link href="/catalog">
            <Badge
              variant={category ? "outline" : "default"}
              className={cn("cursor-pointer text-sm py-2 px-4 hover:bg-amber-100", !category && "bg-amber-600 hover:bg-amber-700")}
            >
              Tout voir
            </Badge>
          </Link>
          {categories.map((cat) => (
            <Link key={cat.id} href={`/catalog?category=${cat.slug}`}>
              <Badge
                variant={category === cat.slug ? "default" : "outline"}
                className={cn("cursor-pointer text-sm py-2 px-4 hover:bg-amber-100", category === cat.slug && "bg-amber-600 hover:bg-amber-700")}
              >
                {cat.name}
              </Badge>
            </Link>
          ))}
        </div>

        {/* --- GRILLE PRODUITS --- */}
        {products.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            Aucun produit ne correspond à cette catégorie pour le moment. 🍪
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                <div className="relative h-56 w-full bg-slate-200">
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.imageUrl} alt={product.name}
                         className="object-cover w-full h-full"/>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">Image
                      indisponible</div>
                  )}
                </div>

                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="text-xs">{product.category.name}</Badge>
                    <span
                      className="text-lg font-bold text-amber-700">{product.price.toFixed(2)} €</span>
                  </div>
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                  <CardDescription
                    className="line-clamp-2 mt-2">{product.description}</CardDescription>
                </CardHeader>

                <CardFooter className="mt-auto">
                  <AddToCartButton product={product}/>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}