"use client"; // 👈 OBLIGATOIRE : Transforme ce bout de code en code Client (Navigateur)

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { Product } from "@prisma/client";
import { useState } from "react";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({
  product,
}: Readonly<AddToCartButtonProps>) {
  // On récupère la fonction addItem depuis notre store
  const addItem = useCartStore((state) => state.addItem);

  // Un petit état local pour faire un effet visuel "Ajouté !"
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = () => {
    addItem(product);

    // Petit feedback visuel
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000); // Remet le bouton normal après 2 secondes
  };

  return (
    <Button
      onClick={handleClick}
      className={`w-full transition-all ${isAdded ? "bg-green-600 hover:bg-green-700" : ""}`}
    >
      {isAdded ? "Ajouté au panier ! 🍰" : "Ajouter au panier"}
    </Button>
  );
}
