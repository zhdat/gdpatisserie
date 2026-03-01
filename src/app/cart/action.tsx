"use server";

import { Resend } from "resend";
import OrderEmail from "@/components/email/order-template";
import { prisma } from "@/lib/db";

const resend = new Resend(process.env.RESEND_API_KEY);

type CartItemInput = {
  id: string;
  quantity: number;
};

export async function submitOrder(
  formData: FormData,
  cartItems: CartItemInput[],
) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const zip = formData.get("zip") as string;

  const dateRaw = formData.get("date") as string;
  const time = formData.get("time") as string;
  const deliveryDate = dateRaw ? new Date(dateRaw) : new Date();

  if (!zip.startsWith("13")) {
    throw new Error(
      "Désolé, nous livrons uniquement sur Marseille et alentours (13).",
    );
  }

  if (cartItems.length === 0) {
    throw new Error("Votre panier est vide.");
  }

  let totalAmount = 0;
  const productsInDb = await prisma.product.findMany({
    where: { id: { in: cartItems.map((item) => item.id) } },
  });

  const orderItemsData = cartItems.map((cartItem) => {
    const product = productsInDb.find((p) => p.id === cartItem.id);
    if (!product) throw new Error(`Produit introuvable: ${cartItem.id}`);

    totalAmount += product.price * cartItem.quantity;

    return {
      productId: product.id,
      quantity: cartItem.quantity,
      price: product.price,
    };
  });

  // 1. Création de la commande
  const createdOrder = await prisma.order.create({
    data: {
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      address: address,
      city: city,
      zipCode: zip,
      deliveryDate: deliveryDate,
      deliveryTime: time,
      totalAmount: totalAmount,
      status: "PENDING",
      items: {
        create: orderItemsData,
      },
    },
  });

  const fullOrder = await prisma.order.findUnique({
    where: { idString: createdOrder.idString },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!fullOrder)
    throw new Error("Erreur lors de la récupération de la commande");

  // 3. Préparation des données Email
  const emailData = {
    orderId: fullOrder.idString,
    customerName: name,
    items: fullOrder.items.map((i) => ({
      id: i.product.id,
      name: i.product.name,
      quantity: i.quantity,
      price: i.price,
    })),
    totalAmount: totalAmount,
    deliveryDate: deliveryDate,
    deliveryTime: time,
  };

  try {
    // A. Email CLIENT
    await resend.emails.send({
      from: "GD Pâtisserie <onboarding@resend.dev>",
      to: email,
      subject: "Confirmation de votre commande 🍰",
      react: <OrderEmail {...emailData} />,
    });

    // B. Email ADMIN
    await resend.emails.send({
      from: "GD Pâtisserie <onboarding@resend.dev>",
      to: "admin@gdpatisserie.com",
      subject: "👨‍🍳 Nouvelle commande reçue !",
      react: <OrderEmail {...emailData} isForAdmin={true} />,
    });
  } catch (error) {
    console.error("Erreur email:", error);
  }

  return { success: true };
}
