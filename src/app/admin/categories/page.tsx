import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCategory, deleteCategory } from "./action";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Pencil, Trash } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestion des Catégories</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Formulaire d'ajout */}
        <div className="col-span-1 bg-white p-6 rounded-lg border shadow-sm h-fit">
          <h2 className="text-xl font-semibold mb-4">Nouvelle Catégorie</h2>
          <form action={createCategory} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la catégorie</Label>
              <Input
                id="name"
                name="name"
                placeholder="Ex: Pâtisseries, Chocolats..."
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Ajouter
            </Button>
          </form>
        </div>

        {/* Liste des catégories */}
        <div className="col-span-1 md:col-span-2 bg-white rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Slug (URL)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground py-8"
                  >
                    Aucune catégorie pour le moment.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {category.slug}
                    </TableCell>

                    <TableCell className="text-right space-x-2">
                      <Link href={`/admin/categories/${category.id}/edit`}>
                        <Button variant="outline" size="icon" title="Modifier">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <form
                        action={deleteCategory.bind(null, category.id)}
                        className="inline-block"
                      >
                        <Button
                          variant="destructive"
                          size="icon"
                          type="submit"
                          title="Supprimer"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
