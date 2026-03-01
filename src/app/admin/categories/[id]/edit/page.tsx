import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateCategory } from "../../action";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id: id },
  });

  if (!category) {
    return notFound();
  }

  const updateCategoryWithId = updateCategory.bind(null, category.id);

  return (
    <div className="p-6 max-w-md mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Modifier la catégorie</h1>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <form action={updateCategoryWithId} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de la catégorie</Label>
            <Input
              id="name"
              name="name"
              defaultValue={category.name}
              required
            />
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="w-50">
              Sauvegarder
            </Button>
            <Link href="/admin/categories" className="w-50">
              <Button type="button" variant="outline" className="w-full">
                Annuler
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
