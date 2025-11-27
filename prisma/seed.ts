import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


async function main() {
    console.log('🌱 Début du seeding...')

    // 1. Nettoyage
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()

    console.log('🧹 Base de données nettoyée')

    // 2. Création des Catégories
    const catGateaux = await prisma.category.create({
        data: { name: 'Gâteaux', slug: 'gateaux' }
    })

    const catChocolats = await prisma.category.create({
        data: { name: 'Chocolats', slug: 'chocolats' }
    })

    const catEvenements = await prisma.category.create({
        data: { name: 'Événements', slug: 'evenements' }
    })

    // 3. Création des Produits
    await prisma.product.createMany({
        data: [
            {
                name: 'Tarte au Citron Meringuée',
                description: 'Une pâte sablée croustillante, un crémeux citron acidulé et une meringue italienne légère.',
                price: 24.00,
                imageUrl: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80',
                categoryId: catGateaux.id,
                isAvailable: true
            },
            {
                name: 'Royal Chocolat',
                description: 'Mousse chocolat noir 70%, biscuit dacquoise noisette et croustillant praliné.',
                price: 28.50,
                imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
                categoryId: catGateaux.id,
                isAvailable: true
            },
            {
                name: 'Boîte Découverte (12 pièces)',
                description: 'Assortiment de nos meilleurs bonbons au chocolat (Ganaches, Pralinés).',
                price: 18.00,
                imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80',
                categoryId: catChocolats.id,
                isAvailable: true
            },
            {
                name: 'Bûche Glacée Vanille-Fraise',
                description: 'Disponible uniquement pour les fêtes de fin d\'année.',
                price: 35.00,
                imageUrl: 'https://images.unsplash.com/photo-1481391319762-47d9366f53db?auto=format&fit=crop&w=800&q=80',
                categoryId: catEvenements.id,
                isAvailable: false
            }
        ]
    })

    console.log('✅ Seeding terminé avec succès !')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })