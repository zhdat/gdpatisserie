import {signOut} from "@/auth" // Assure-toi que le chemin vers ton auth.ts est bon
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {Cake, LayoutDashboard, LogOut, ShoppingBag} from "lucide-react"

export default function AdminLayout({
                                      children,
                                    }: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* --- BANDEAU DE NAVIGATION (Sticky en haut) --- */}
      <nav
        className="bg-white border-b h-16 flex items-center px-8 justify-between sticky top-0 z-50 shadow-sm">

        {/* Partie Gauche : Logo + Liens */}
        <div className="flex items-center gap-8">
          <Link href="/admin" className="font-bold text-xl text-amber-700 flex items-center gap-2">
            👨‍🍳 GD Admin
          </Link>

          <div className="flex items-center gap-1">
            <Link href="/admin">
              <Button variant="ghost" className="text-slate-600 gap-2">
                <LayoutDashboard className="h-4 w-4"/>
                Dashboard
              </Button>
            </Link>

            <Link href="/admin/orders">
              <Button variant="ghost" className="text-slate-600 gap-2">
                <ShoppingBag className="h-4 w-4"/>
                Commandes
              </Button>
            </Link>

            <Link href="/admin/products">
              <Button variant="ghost" className="text-slate-600 gap-2">
                <Cake className="h-4 w-4"/>
                Produits
              </Button>
            </Link>
          </div>
        </div>

        {/* Partie Droite : Déconnexion */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400 hidden md:inline">
            Connecté en tant que Chef
          </span>

          {/* Action Serveur pour se déconnecter */}
          <form
            action={async () => {
              "use server"
              // On déconnecte et on redirige vers la page de login
              await signOut({redirectTo: "/login"})
            }}
          >
            <Button variant="destructive" size="sm" className="gap-2">
              <LogOut className="h-4 w-4"/>
              Sortir
            </Button>
          </form>
        </div>

      </nav>

      {/* --- CONTENU DE LA PAGE --- */}
      {/* C'est ici que tes pages (page.tsx) s'afficheront */}
      <main>
        {children}
      </main>
    </div>
  )
}