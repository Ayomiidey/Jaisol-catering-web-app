import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cateringBooking.deleteMany()
  await prisma.menuItem.deleteMany()
  await prisma.cateringPackage.deleteMany()

  // Create menu items
  const menuItems = await Promise.all([
    prisma.menuItem.create({
      data: {
        name: 'Jollof Rice',
        description: 'Party-style smoky jollof rice',
        price: 12.99,
        category: 'Mains',
        imageUrl: '/images/jollof-rice.png',
        isAvailable: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Puff Puff',
        description: '12 pcs glazed & dusted',
        price: 9.99,
        category: 'Pastries',
        imageUrl: '/images/puff-puff.png',
        isAvailable: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Fullhouse Box',
        description: 'Rice + protein + side',
        price: 18.00,
        category: 'Mains',
        imageUrl: '/images/fullhouse-box.png',
        isAvailable: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Grilled Lamb',
        description: 'Marinated West African style',
        price: 15.99,
        category: 'Starters',
        imageUrl: '/images/grilled-lamb.png',
        isAvailable: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Egusi Soup',
        description: 'With fufu, rich melon seed broth',
        price: 11.99,
        category: 'Mains',
        imageUrl: '/images/egusi-soup.png',
        isAvailable: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Mini Cakes',
        description: 'Assorted decorated mini cakes',
        price: 14.99,
        category: 'Cakes',
        imageUrl: '/images/mini-cakes.png',
        isAvailable: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Wedding Cake',
        description: 'Multi-tiered elegant cake',
        price: 89.99,
        category: 'Cakes',
        imageUrl: '/images/wedding-cake.png',
        isAvailable: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Soya Skewers',
        description: 'Grilled vegetarian starter',
        price: 13.99,
        category: 'Starters',
        imageUrl: '/images/soya-skewers.png',
        isAvailable: true,
      },
    }),
  ])

  // Create catering packages
  await Promise.all([
    prisma.cateringPackage.create({
      data: {
        name: 'Basic Package',
        description: 'Perfect for small gatherings',
        pricePerPerson: 15,
        minGuests: 20,
        includes: JSON.stringify(['Jollof Rice', 'Grilled Meat', 'Salad', 'Drinks']),
      },
    }),
    prisma.cateringPackage.create({
      data: {
        name: 'Premium Package',
        description: 'Complete catering experience',
        pricePerPerson: 25,
        minGuests: 30,
        includes: JSON.stringify(['Multiple Mains', 'Starters', 'Desserts', 'Beverages', 'Service']),
      },
    }),
    prisma.cateringPackage.create({
      data: {
        name: 'Deluxe Package',
        description: 'All-inclusive celebration',
        pricePerPerson: 35,
        minGuests: 50,
        includes: JSON.stringify(['Premium Mains', 'Multiple Starters', 'Cake', 'Full Beverages', 'Server Staff', 'Setup & Cleanup']),
      },
    }),
  ])

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
