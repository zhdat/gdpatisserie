import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Cake, Euro, ExternalLink, ShoppingBag} from "lucide-react"
import Link from "next/link"
import {OverviewChart} from "@/app/admin/overview-chart";
import {prisma} from "@/lib/db";

export const dynamic = 'force-dynamic'

// Fonction pour récupérer le CA des 7 derniers jours (inchangée)
async function getRevenueData() {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const orders = await prisma.order.findMany({
    where: {
      createdAt: {gte: sevenDaysAgo},
      status: {not: 'CANCELLED'}
    }
  })

  const groupedRevenue: Record<string, number> = {}

  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dayName = d.toLocaleDateString('fr-FR', {weekday: 'short'})
    groupedRevenue[dayName] = 0
  }

  orders.forEach((order) => {
    const dayName = order.createdAt.toLocaleDateString('fr-FR', {weekday: 'short'})
    if (groupedRevenue[dayName] !== undefined) {
      groupedRevenue[dayName] += order.totalAmount
    }
  })

  return Object.entries(groupedRevenue).map(([name, total]) => ({name, total}))
}

export default async function AdminDashboardPage() {
  const [pendingOrdersCount, productsCount, revenueData, totalRevenue] = await Promise.all([
    prisma.order.count({where: {status: 'PENDING'}}),
    prisma.product.count({where: {isArchived: false}}),
    getRevenueData(),
    prisma.order.aggregate({
      _sum: {totalAmount: true},
      where: {status: {not: 'CANCELLED'}}
    })
  ])

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tableau de Bord</h1>
          <p className="text-slate-500">Bienvenue dans votre espace de gestion.</p>
        </div>
      </div>

      {/* --- GRILLE DES 4 CARTES --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* KPI 1 : Commandes (Avec logique dynamique) */}
        <Link href="/admin/orders">
          <Card
            className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-amber-200 bg-amber-50/50 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-900">Commandes</CardTitle>
              <ShoppingBag className="h-4 w-4 text-amber-700"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-900">{pendingOrdersCount}</div>
              <p className="text-xs text-amber-700 font-medium mt-1">
                {pendingOrdersCount > 0
                  ? "🔥 En attente de traitement"
                  : "✅ Tout est à jour"}
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* KPI 2 : Produits */}
        <Link href="/admin/products">
          <Card
            className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Catalogue</CardTitle>
              <Cake className="h-4 w-4 text-slate-500"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{productsCount}</div>
              <p className="text-xs text-slate-500 mt-1">
                Produits actifs en ligne
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* KPI 3 : Chiffre d'affaire Total */}
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CA Total</CardTitle>
            <Euro className="h-4 w-4 text-slate-500"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(totalRevenue._sum.totalAmount || 0).toFixed(2)} €
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Cumulé depuis le début
            </p>
          </CardContent>
        </Card>

        {/* KPI 4 : Lien Site Client (La carte sombre) */}
        <a href="/" target="_blank" rel="noopener noreferrer">
          <Card
            className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer bg-slate-900 text-white border-slate-800 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-100">
                Boutique
              </CardTitle>
              <ExternalLink className="h-4 w-4 text-slate-300"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                Voir le site
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Accéder à la vue client
              </p>
            </CardContent>
          </Card>
        </a>

      </div>

      {/* --- GRAPHIQUE --- */}
      <div className="grid grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Évolution du Chiffre d&apos;affaires (7 jours)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart data={revenueData}/>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}