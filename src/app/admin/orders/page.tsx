import { DataTable } from "./data-table";
import { columns } from "@/app/admin/orders/column";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  // On récupère les commandes
  // Note: On n'a plus besoin de 'include: items' ici car le tableau n'affiche pas le détail des gâteaux par défaut
  // Si tu veux afficher le détail, il faudrait faire un "Row Expansion" (plus complexe) ou un bouton "Voir détail"
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { product: true }, // On veut le nom du gateau
      },
    },
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Suivi des Commandes</h1>
      {/* On appelle le tableau en lui donnant les colonnes et les données */}
      <DataTable columns={columns} data={orders} />
    </div>
  );
}
