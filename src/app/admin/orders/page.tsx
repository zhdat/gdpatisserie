import { DataTable } from "./data-table";
import { columns } from "@/app/admin/orders/column";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  // On récupère les commandes
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
