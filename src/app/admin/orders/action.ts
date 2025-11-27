'use server'

import {revalidatePath} from 'next/cache'
import {prisma} from "@/lib/db";

export async function updateOrderStatus(orderId: string, newStatus: string) {
  // TypeScript hack : on cast le string en Enum
  // Dans un vrai projet, on validerait avec Zod
  await prisma.order.update({
    where: {idString: orderId},
    data: {status: newStatus as any}
  })

  // On rafraîchit la page pour voir le changement de couleur immédiat
  revalidatePath('/admin/orders')
}