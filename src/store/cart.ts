import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@prisma/client'

// 1. Définition du type : Qu'est-ce qu'un "Item" du panier ?
// C'est un Produit + une quantité
export interface CartItem extends Product {
  quantity: number
}

// 2. Définition du Store : Quelles données et quelles actions ?
interface CartStore {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  decrementItemQuantity: (productId: string) => void
  clearCart: () => void
  getTotalPrice: () => number
}

// 3. Création du Store avec persistance (sauvegarde auto dans localStorage)
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const currentItems = get().items
        // Est-ce que le produit est déjà dans le panier ?
        const existingItem = currentItems.find((item) => item.id === product.id)

        if (existingItem) {
          // Si oui, on augmente juste la quantité
          const updatedItems = currentItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
          set({ items: updatedItems })
        } else {
          // Si non, on l'ajoute avec quantité 1
          set({ items: [...currentItems, { ...product, quantity: 1 }] })
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
        })
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      decrementItemQuantity: (productId) => {
        const currentItems = get().items
        const updatedItems = currentItems.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1}
            : item
        )
        set({ items: updatedItems })
      }
    }),
    {
      name: 'gdpatisserie-cart', // Clé unique pour le localStorage
    }
  )
)