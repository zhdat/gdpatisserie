'use client'

import {ColumnDef} from "@tanstack/react-table"
import {Order, OrderItem, Product} from "@prisma/client"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {ArrowUpDown, MoreHorizontal} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {updateOrderStatus} from "@/app/admin/orders/action";
import OrderDetails from "@/app/admin/orders/order-details";

// On définit le type de données qu'on va afficher
export type OrderColumn = Order & { items: (OrderItem & { product: Product })[] }

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "idString",
    header: "ID",
    cell: ({row}) => <span
      className="font-mono text-xs">#{(row.getValue("idString") as string).toString().slice(-4).toUpperCase()}</span>,
  },
  {
    accessorKey: "deliveryDate",
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Livraison
          <ArrowUpDown className="ml-2 h-4 w-4"/>
        </Button>
      )
    },
    cell: ({row}) => {
      const date = new Date(row.getValue("deliveryDate"))
      return <div className="font-medium">{date.toLocaleDateString('fr-FR')}</div>
    },
  },
  {
    accessorKey: "deliveryTime",
    header: "Créneau",
  },
  {
    accessorKey: "customerName",
    header: "Client",
    cell: ({row}) => (
      <div className="flex flex-col">
        <span className="font-bold">{row.getValue("customerName")}</span>
        <span className="text-xs text-muted-foreground">{row.original.city}</span>
      </div>
    )
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({row}) => {
      const amount = parseFloat(row.getValue("totalAmount"))
      return <div className="font-bold">{amount.toFixed(2)} €</div>
    },
  },
  {
    accessorKey: "status",
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4"/>
        </Button>
      )
    },
    cell: ({row}) => {
      let status = row.getValue("status") as string
      // Copie de ton code de badge précédent
      let color = "bg-slate-100 text-slate-800"
      if (status === 'PENDING') {
        status = 'EN ATTENTE'
        color = "bg-yellow-100 text-yellow-800 border-yellow-200"
      }
      if (status === 'CONFIRMED') {
        status = "CONFIRMÉ"
        color = "bg-blue-100 text-blue-800 border-blue-200"
      }
      if (status === 'DELIVERED') {
        status = "LIVRÉ"
        color = "bg-green-100 text-green-800 border-green-200"
      }
      if (status === 'CANCELLED') {
        status = "ANNULÉ"
        color = "bg-red-100 text-red-800 border-red-200"
      }
      if (status === 'PREPARED') {
        status = "PRÊT"
      }

      return <Badge variant="outline" className={color}>{status}</Badge>
    },
  },
  {
    id: "details",
    header: "Détail",
    cell: ({ row }) => {
      // On passe la ligne entière à notre composant
      return <OrderDetails order={row.original} />
    },
  },
  {
    id: "actions",
    cell: ({row}) => {
      const order = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <span className="sr-only">Menu</span>
              <MoreHorizontal className="h-4 w-4"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => updateOrderStatus(order.idString, "CONFIRMED")}>
              Marquer Confirmé (Appelé)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateOrderStatus(order.idString, "PREPARED")}>
              Marquer Prêt
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateOrderStatus(order.idString, "DELIVERED")}>
              Marquer Livré ✅
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600"
                              onClick={() => updateOrderStatus(order.idString, "CANCELLED")}>
              Annuler la commande
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]