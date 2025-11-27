"use client"

import Link from "next/link"
import {ShoppingBasket} from "lucide-react"
import {useCartStore} from "@/store/cart"
import {useEffect, useState} from "react";

export default function CartIndicator() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, []);
  const items = useCartStore((state) => state.items)

  // Calcul du nombre total d'articles
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)


  // Tant que le composant n'est pas "monté" (Hydratation), on affiche juste l'icône sans nombre
  // pour éviter le décalage visuel bizarre
  if (!mounted) {
    return (
      <Link href="/cart"
            className="flex items-center gap-2 text-slate-700 hover:text-amber-700 transition-colors">
        <div className="relative">
          <ShoppingBasket className="h-6 w-6"/>
        </div>
        <span className="hidden md:inline text-sm font-medium">Mon Panier</span>
      </Link>
    )
  }

  return (
    <Link href="/cart"
          className="flex items-center gap-2 text-slate-700 hover:text-amber-700 transition-colors group">
      <div className="relative h-6 w-6">
        <ShoppingBasket className="h-6 w-6 transition-transform group-hover:scale-105"/>

        {/* La petite bulle rouge (Badge) */}
        {itemCount > 0 && (
          <span
            className="absolute -top-2 -right-2 bg-amber-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
            {itemCount}
          </span>
        )}
      </div>
      <span className="hidden md:inline text-sm font-medium">Mon Panier</span>
    </Link>
  )
}