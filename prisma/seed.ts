import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Upsert restaurant
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: "pabee" },
    update: { name: "Pabee" },
    create: {
      name: "Pabee",
      slug: "pabee",
    },
  });

  // Create tables if they don't exist
  const tables = [
    { table_number: "T01", qr_token: "qr_t01" },
    { table_number: "T02", qr_token: "qr_t02" },
    { table_number: "T04", qr_token: "qr_t04" },
    { table_number: "VIP 3", qr_token: "qr_vip3" },
  ];

  for (const tableData of tables) {
    const existingTable = await prisma.diningTable.findUnique({
      where: { qr_token: tableData.qr_token }
    });
    
    if (!existingTable) {
      await prisma.diningTable.create({
        data: {
          restaurant_id: restaurant.id,
          ...tableData,
        },
      });
    }
  }

  // Create categories if they don't exist
  let starters = await prisma.menuCategory.findFirst({
    where: { 
      restaurant_id: restaurant.id,
      name: "Starters"
    }
  });

  if (!starters) {
    starters = await prisma.menuCategory.create({
      data: {
        restaurant_id: restaurant.id,
        name: "Starters",
        description: "Appetisers & small plates",
        sort_order: 1,
      },
    });
  }

  let mains = await prisma.menuCategory.findFirst({
    where: {
      restaurant_id: restaurant.id,
      name: "Mains"
    }
  });

  if (!mains) {
    mains = await prisma.menuCategory.create({
      data: {
        restaurant_id: restaurant.id,
        name: "Mains",
        description: "Curries, rice & the works",
        sort_order: 2,
      },
    });
  }

  // Create menu items if they don't exist
  const menuItems = [
    {
      name: "Paneer Tikka",
      description: "Char-grilled cottage cheese",
      price: 280,
      is_veg: true,
      is_popular: true,
      category_id: starters.id,
    },
    {
      name: "Chicken Wings",
      description: "Spicy glazed wings",
      price: 320,
      is_veg: false,
      is_new: true,
      category_id: starters.id,
    },
    {
      name: "Butter Chicken",
      description: "Creamy tomato gravy",
      price: 380,
      is_veg: false,
      is_popular: true,
      category_id: mains.id,
    },
    {
      name: "Butter Naan",
      description: "Soft naan with butter",
      price: 45,
      is_veg: true,
      category_id: mains.id,
    },
  ];

  for (const item of menuItems) {
    const existingItem = await prisma.menuItem.findFirst({
      where: {
        restaurant_id: restaurant.id,
        name: item.name,
      }
    });

    if (!existingItem) {
      await prisma.menuItem.create({
        data: {
          restaurant_id: restaurant.id,
          ...item,
          is_available: true,
          station: "KITCHEN",
        },
      });
    }
  }

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
