"use client";

import { Order, OrderItem, Product } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

// On définit un type étendu car Prisma renvoie des objets imbriqués
type OrderWithItems = Order & {
  items: (OrderItem & {
    product: Product;
  })[];
};

export default function OrderDetails({
  order,
}: Readonly<{ order: OrderWithItems }>) {
  return (
    <Dialog>
      {/* Le bouton déclencheur */}
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className={"cursor-pointer"}>
          <Eye className="h-4 w-4 text-slate-500" />
        </Button>
      </DialogTrigger>

      {/* Le contenu de la fenêtre */}
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>
            Commande #{order.idString.slice(-4).toUpperCase()}
          </DialogTitle>
          <DialogDescription>Détails complets à préparer</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Infos Livraison */}
          <div className="bg-slate-50 p-3 rounded-md text-sm border">
            <p className="font-bold text-amber-700">
              📅 Pour le{" "}
              {new Date(order.deliveryDate).toLocaleDateString("fr-FR")}
            </p>
            <p>⏰ Créneau : {order.deliveryTime}</p>
            <p>
              📍 {order.customerName} - {order.city}
            </p>
          </div>

          {/* Liste des gâteaux (Le plus important pour le chef) */}
          <div>
            <h3 className="font-bold mb-2 border-b pb-1">À préparer :</h3>
            <ul className="space-y-3">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-slate-900 text-white font-bold px-2 py-1 rounded text-xs">
                      x{item.quantity}
                    </span>
                    <span>{item.product.name}</span>
                  </div>
                  <span className="text-slate-500">
                    {(item.price * item.quantity).toFixed(2)} €
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center border-t pt-4 font-bold text-lg">
            <span>Total Commande</span>
            <span>{order.totalAmount.toFixed(2)} €</span>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => globalThis.print()}>Imprimer le bon</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
