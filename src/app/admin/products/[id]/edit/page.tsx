import ProductForm from '../../product-form' // On remonte de 2 dossiers
import {notFound} from 'next/navigation'
import {updateProduct} from "@/app/admin/products/action";
import {prisma} from "@/lib/db";

export const dynamic = 'force-dynamic'

interface EditProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  // 1. On récupère l'ID depuis l'URL (ex: /admin/products/clh123.../edit)
  const { id } = await params

  // 2. On cherche le produit et les catégories
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany()
  ])

  // Si l'ID est bidon, on renvoie une 404
  if (!product) {
    return notFound()
  }

  // 3. L'Astuce "bind" :
  // La fonction updateProduct a besoin de 2 arguments : id et formData.
  // Mais le formulaire n'envoie que formData.
  // On utilise .bind pour "attacher" l'ID à la fonction avant de la donner au formulaire.
  const updateAction = updateProduct.bind(null, product.id)

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Modifier le produit</h1>

      <ProductForm
        categories={categories}
        initialData={product}
        action={updateAction}
      />
    </div>
  )
}