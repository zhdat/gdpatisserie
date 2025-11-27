'use client'

import {useCartStore} from "@/store/cart"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Card, CardContent} from "@/components/ui/card"
import {Minus, Plus, Trash2} from "lucide-react" // Icônes (installées par défaut avec shadcn/lucide)
import Link from "next/link"
import {useEffect, useState} from "react"
import {useRouter} from "next/navigation";
import {submitOrder} from "@/app/cart/action";

export default function CartPage() {
  const {items, removeItem, addItem, clearCart, decrementItemQuantity} = useCartStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])

  // Calcul du total côté client (juste pour l'affichage)
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  // Gestionnaire de soumission du formulaire
  async function onSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)

    try {
      // On prépare les données du panier pour le serveur (ID + Quantité uniquement)
      const cartData = items.map(i => ({id: i.id, quantity: i.quantity}))

      // Appel de la Server Action
      await submitOrder(formData, cartData)

      // Si succès (pas d'erreur levée) :
      clearCart() // On vide le panier local

      // ET on redirige côté client
      router.push('/success')

    } catch (e) {
      // Affichage de l'erreur (ex: code postal invalide)
      setError(e instanceof Error ? e.message : "Une erreur est survenue")
      setIsSubmitting(false)
    }
  }

  // Attendre l'hydratation (évite le flash bizarre)
  if (!mounted) return null

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Votre panier est vide 😢</h1>
        <Link href="/">
          <Button>Retourner aux gourmandises</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* --- COLONNE GAUCHE : LISTE DES ARTICLES --- */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Votre Panier</h2>

          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-sm text-slate-500">{item.price.toFixed(2)} € / unité</p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Bouton Moins (si qté = 1, ça supprime ?) - Ici on garde simple */}
                  <Button
                    variant="outline" size="icon" className="h-8 w-8"
                    onClick={() => item.quantity > 1 ? decrementItemQuantity(item.id) : removeItem(item.id)}>
                    <Minus className="h-4 w-4"/>
                  </Button>

                  <span className="font-bold w-4 text-center">{item.quantity}</span>

                  <Button variant="outline" size="icon" className="h-8 w-8"
                          onClick={() => addItem(item)}>
                    <Plus className="h-4 w-4"/>
                  </Button>

                  <Button variant="destructive" size="icon" className="h-8 w-8 ml-2"
                          onClick={() => removeItem(item.id)}>
                    <Trash2 className="h-4 w-4"/>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="text-right text-xl font-bold mt-4">
            Total estimé : {total.toFixed(2)} €
          </div>
        </div>

        {/* --- COLONNE DROITE : FORMULAIRE --- */}
        <div>
          <Card className="p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-4">Finaliser la commande</h2>
            <p className="text-sm text-slate-500 mb-6">
              Paiement à la livraison. Nous vous rappellerons pour confirmer le créneau.
            </p>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}

            <form action={onSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Prénom Nom</Label>
                <Input id="name" name="name" required placeholder="Jean Dupont"/>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="jean@mail.com"/>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Téléphone (Important)</Label>
                <Input id="phone" name="phone" type="tel" required placeholder="06 12 34 56 78"/>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Adresse de livraison</Label>
                <Input id="address" name="address" required placeholder="12 rue de la République"/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="zip">Code Postal</Label>
                  <Input id="zip" name="zip" required placeholder="13001" maxLength={5}/>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input id="city" name="city" defaultValue="Marseille"/>
                </div>
              </div>

              {/* NOUVEAU BLOC DATE */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date de livraison souhaitée</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]} // Empêche de choisir une date passée
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Heure / Créneau</Label>
                  <select
                    name="time"
                    id="time"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Choisir...</option>
                    <option value="Matin (9h - 12h)">Matin (9h - 12h)</option>
                    <option value="Après-midi (14h - 18h)">Après-midi (14h - 18h)</option>
                    <option value="Soirée (18h - 20h)">Soirée (18h - 20h)</option>
                  </select>
                </div>
              </div>

              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 mt-4"
                      disabled={isSubmitting}>
                {isSubmitting ? "Envoi en cours..." : "Valider la commande"}
              </Button>
            </form>
          </Card>
        </div>

      </div>
    </div>
  )
}