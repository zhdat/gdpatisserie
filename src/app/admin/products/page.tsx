import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {prisma} from "@/lib/db";
import Link from "next/link";
import {deleteProduct} from "@/app/admin/products/action";
import AvailabilitySwitch from "@/app/admin/products/availability-switch";

export const dynamic = 'force-dynamic'


// Composant ASYNC => il attend la réponse de la bdd avant d'envoyer le html
export default async function AdminProductsPage() {
  // 1. Récupération des données (Server-Side)
  const products = await prisma.product.findMany({
    orderBy: [
      {createdAt: "desc"}, // Les plus récents en premier
      {id: "asc"}
    ],
    include: {
      category: true // On veut aussi récupérer le nom de la catégorie associée
    },
    where: {
      isArchived: false
    }
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Produits</h1>
        <Button asChild>
          <Link href="/admin/products/new">+ Nouveau Produit</Link>
        </Button>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category.name}</TableCell>
                <TableCell>
                  {/* Formatage du prix en Euros */}
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  }).format(product.price)}
                </TableCell>
                <TableCell>
                  <AvailabilitySwitch
                    productId={product.id}
                    initialValue={product.isAvailable}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {/* Bouton MODIFIER : C'est juste un lien vers la page Edit */}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/products/${product.id}/edit`}>
                        Modifier
                      </Link>
                    </Button>

                    {/* Bouton SUPPRIMER : C'est un formulaire qui appelle l'action Delete */}
                    <form action={deleteProduct.bind(null, product.id)}>
                      <Button
                        variant="destructive"
                        size="sm"
                        className={"cursor-pointer"}
                        // On ajoute un petit confirm JS simple pour éviter les accidents
                        // Note: Pour faire ça proprement en React pur, il faudrait un Client Component,
                        // mais ici on peut ruser avec un onSubmit inline
                      >
                        Suppr.
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}