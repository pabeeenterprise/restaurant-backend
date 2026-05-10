import { PrismaClient, StationType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const restaurant = await prisma.restaurant.create({
    data: {
      name: "Pabee",
      slug: "pabee",
      tables: {
        create: [
          { tableCode: "T01", qrToken: "qr_t01" },
          { tableCode: "T02", qrToken: "qr_t02" },
          { tableCode: "T04", qrToken: "qr_t04" },
          { tableCode: "VIP 3", qrToken: "qr_vip3" },
        ],
      },
    },
  });

  const starters = await prisma.menuCategory.create({
    data: {
      restaurantId: restaurant.id,
      name: "Starters",
      description: "Appetisers & small plates",
      sortOrder: 1,
    },
  });

  const mains = await prisma.menuCategory.create({
    data: {
      restaurantId: restaurant.id,
      name: "Mains",
      description: "Curries, rice & the works",
      sortOrder: 2,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        restaurantId: restaurant.id,
        categoryId: starters.id,
        name: "Paneer Tikka",
        description: "Char-grilled cottage cheese",
        price: 280,
        isVeg: true,
        isPopular: true,
        isAvailable: true,
        station: StationType.KITCHEN,
        sortOrder: 1,
      },
      {
        restaurantId: restaurant.id,
        categoryId: starters.id,
        name: "Chicken Wings",
        description: "Spicy glazed wings",
        price: 320,
        isVeg: false,
        isNew: true,
        isAvailable: true,
        station: StationType.KITCHEN,
        sortOrder: 2,
      },
      {
        restaurantId: restaurant.id,
        categoryId: mains.id,
        name: "Butter Chicken",
        description: "Creamy tomato gravy",
        price: 380,
        isVeg: false,
        isPopular: true,
        isAvailable: true,
        station: StationType.KITCHEN,
        sortOrder: 1,
      },
      {
        restaurantId: restaurant.id,
        categoryId: mains.id,
        name: "Butter Naan",
        description: "Soft naan with butter",
        price: 45,
        isVeg: true,
        isAvailable: true,
        station: StationType.KITCHEN,
        sortOrder: 2,
      },
    ],
  });

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
