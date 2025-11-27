"use client"

import Link from "next/link"
import {usePathname} from "next/navigation"
import {cn} from "@/lib/utils"
import CartIndicator from "@/components/cart-indicator";

export function Navbar() {
  const pathname = usePathname()

  // On cache la navbar sur les pages admin et login pour éviter les doublons
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return null

  const links = [
    {href: "/", label: "Accueil"},
    {href: "/catalog", label: "Nos Pâtisseries"},
    // Tu pourras ajouter une page "A propos" ou "Contact" plus tard
  ]

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="font-bold text-xl text-amber-700 font-serif">
          GD Pâtisserie 🧁
        </Link>

        {/* LIENS CENTRAUX */}
        <div className="hidden md:flex gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-amber-600",
                pathname === link.href ? "text-amber-600 font-bold" : "text-slate-600"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* LIEN PANIER (Rappel discret) */}
        <CartIndicator/>
      </div>
    </nav>
  )
}