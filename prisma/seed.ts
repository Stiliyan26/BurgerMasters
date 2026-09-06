import { PrismaClient, Category, OrderStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const burgers = [
  {
    name: "THE JUICY LUCY",
    slug: "the-juicy-lucy",
    imagePath: "/images/BurgerMenu/JuicyLucy.webp",
    portionGrams: 350,
    description:
      "Homemade Brioche Bread, Burger sauce, Black Angus ground beef mixed with cheddar, Melted Irish red cheddar, Crispy bacon, Caramelized onions",
    priceBgn: 17.4,
  },
  {
    name: "Pineapple Bacon Run",
    slug: "pineapple-bacon-run",
    imagePath: "/images/BurgerMenu/PineappleBaconRun.webp",
    portionGrams: 380,
    description:
      "Homemade Brioche Bread, Pineapple butter with rum, 200g Black Angus ground beef, Grilled pineapple, Crispy bacon with brown sugar",
    priceBgn: 19.4,
  },
  {
    name: "RUSTY SAVAGE",
    slug: "rusty-savage",
    imagePath: "/images/BurgerMenu/RustySavage.webp",
    portionGrams: 630,
    description:
      "Homemade Brioche Bread, Burger sauce, Colsloe, Ground beef Black Angus x2, Melted Irish red cheddar x2, Crispy bacon, Homemade pickle, Caramelized onions",
    priceBgn: 27.49,
  },
  {
    name: "THUNDER",
    slug: "thunder",
    imagePath: "/images/BurgerMenu/Tunder.webp",
    portionGrams: 380,
    description:
      "Homemade Brioche Bread, Grilled onions, Thunder spicy sauce (tomato sauce, jalapeño, pickle, sweet apricot), Black Angus ground beef, Homemade cheddar sauce, Homemade pickle",
    priceBgn: 17.49,
  },
  {
    name: "American Cheese Burger",
    slug: "american-cheese-burger",
    imagePath: "/images/BurgerMenu/American.webp",
    portionGrams: 320,
    description:
      "Homemade Brioche Bread, Burger sauce, Iceberg, Black Angus ground beef, Crispy bacon, American cheese, Tomato, Pickled red onion",
    priceBgn: 14.99,
  },
  {
    name: "Surf'n'Turf",
    slug: "surf-n-turf",
    imagePath: "/images/BurgerMenu/SurfNTurff.webp",
    portionGrams: 370,
    description:
      "Homemade Brioche Bread, Black Angus ground beef, Aioli sauce, Shrimp, Iceberg",
    priceBgn: 19.49,
  },
  {
    name: "Burger Pie",
    slug: "burger-pie",
    imagePath: "/images/BurgerMenu/BurgerPie.webp",
    portionGrams: 380,
    description: "Black Angus ground beef, American cheese, Cheddar, Jalapeno",
    priceBgn: 19.49,
  },
  {
    name: "Smokey Whiskey Cheeseburger",
    slug: "smokey-whiskey-cheeseburger",
    imagePath: "/images/BurgerMenu/SmokeyWhiskeyCheeseburger.webp",
    portionGrams: 480,
    description:
      "Homemade Brioche Bread, Burger sauce, 200g Black Angus ground beef patties with brown sugar and whiskey, Smokey BBQ, Mushrooms with olive oil, onion and garlic, Crispy bacon, Very cheddar, Fresh tomato",
    priceBgn: 23.49,
  },
  {
    name: "Triple Cheeseburger",
    slug: "triple-cheeseburger",
    imagePath: "/images/BurgerMenu/TrippleCheese.webp",
    portionGrams: 550,
    description:
      "Homemade Brioche Bread, BBQ sauce with bourbon, Our pickle, Black Angus ground beef with blue cheese, mozzarella and lots of cheddar, wrapped in bacon, Grilled onions",
    priceBgn: 23.49,
  },
  {
    name: "Bacon Jam Burger",
    slug: "bacon-jam-burger",
    imagePath: "/images/BurgerMenu/BaconJam.webp",
    portionGrams: 450,
    description:
      "Homemade Brioche Bread, Homemade bourbon BBQ sauce, Crispy iceberg, Black Angus ground beef patties, Very cheddar, Bacon Apricot Marmalade",
    priceBgn: 19.49,
  },
  {
    name: "BBQ Pulled Pork",
    slug: "bbq-pulled-pork",
    imagePath: "/images/BurgerMenu/BBQPulledPork.webp",
    portionGrams: 350,
    description:
      "Homemade Brioche Bread, Colsloe, Slow Roasted Pork Shoulder, Caramelized onions, Melted cheddar, Homemade bourbon BBQ sauce",
    priceBgn: 14.4,
  },
];

const fries = [
  {
    name: "Regular Fries",
    slug: "regular-fries",
    imagePath: "/images/FriesMenu/RegularFries.webp",
    portionGrams: 170,
    description: "Homemade potatoes, Vegetable Oil, Salt",
    priceBgn: 4.99,
  },
  {
    name: "Spicy Fries",
    slug: "spicy-fries",
    imagePath: "/images/FriesMenu/SpicyFries.webp",
    portionGrams: 240,
    description: "Homemade potatoes, Vegetable Oil, Salt, Homemade hot sauce",
    priceBgn: 6.99,
  },
  {
    name: "Cheddar Fries",
    slug: "cheddar-fries",
    imagePath: "/images/FriesMenu/CheddarFries.webp",
    portionGrams: 300,
    description:
      "Homemade potatoes, Vegetable Oil, Salt, Pepper, House fried sauce and jalapenos",
    priceBgn: 7.99,
  },
  {
    name: "Breaded onion rings",
    slug: "breaded-onion-rings",
    imagePath: "/images/FriesMenu/OnionRings.webp",
    portionGrams: 250,
    description: "Onions, Flour, Bread crumbs, Salt and pepper",
    priceBgn: 6.99,
  },
  {
    name: "Mozzarella sticks",
    slug: "mozzarella-sticks",
    imagePath: "/images/FriesMenu/MozzarellaSticks.webp",
    portionGrams: 170,
    description: "Mozzarella cheese, Blueberry jam, All purpose flour",
    priceBgn: 9.99,
  },
];

const drinks = [
  {
    name: "Coca-Cola no sugar",
    slug: "coca-cola-no-sugar",
    imagePath: "/images/DrinkMenu/CocaColaNoSugar.webp",
    portionGrams: 330,
    description:
      "Carbonated Water, Phosphoric Acid, Sweeteners (Aspartame, Acesulfame Potassium), Natural Flavors (including Caffeine)",
    priceBgn: 2.5,
  },
  {
    name: "Coca-Cola Original",
    slug: "coca-cola-original",
    imagePath: "/images/DrinkMenu/Classic.webp",
    portionGrams: 330,
    description:
      "Carbonated Water, High Fructose Corn Syrup, Caramel Color, Phosphoric Acid, Natural Flavors",
    priceBgn: 2.5,
  },
  {
    name: "Coca-cola cherry",
    slug: "coca-cola-cherry",
    imagePath: "/images/DrinkMenu/CherryVanilla.webp",
    portionGrams: 355,
    description:
      "Carbonated Water, High Fructose Corn Syrup, Caramel Color, Phosphoric Acid, Potassium Benzoate",
    priceBgn: 4.9,
  },
  {
    name: "Coca-cola orange vanilla",
    slug: "coca-cola-orange-vanilla",
    imagePath: "/images/DrinkMenu/OrangeVanilla.webp",
    portionGrams: 355,
    description:
      "Carbonated Water, High Fructose Corn Syrup, Caramel Color, Phosphoric Acid, Caffeine, Sodium Benzoat",
    priceBgn: 4.9,
  },
  {
    name: "Coca-cola vanila",
    slug: "coca-cola-vanila",
    imagePath: "/images/DrinkMenu/Vanilla.webp",
    portionGrams: 355,
    description:
      "Carbonated Water, High Fructose Corn Syrup, Caramel Color, Phosphoric Acid, Natural Flavors (including Vanilla), Caffeine",
    priceBgn: 4.9,
  },
  {
    name: "Fanta strawberry",
    slug: "fanta-strawberry",
    imagePath: "/images/DrinkMenu/FantaStrawberry.webp",
    portionGrams: 355,
    description:
      "Carbonated Water, High Fructose Corn Syrup, Natural and Artificial Flavors, Citric Acid, Sodium Citrate, Red 40 (Color)",
    priceBgn: 4.9,
  },
  {
    name: "Fanta berry",
    slug: "fanta-berry",
    imagePath: "/images/DrinkMenu/FantaBerry.webp",
    portionGrams: 355,
    description:
      "Carbonated Water, High Fructose Corn Syrup, Citric Acid, Natural and Artificial Flavors, Red 40 (Color), Blue 1 (Color)",
    priceBgn: 4.9,
  },
  {
    name: "Fanta Grape",
    slug: "fanta-grape",
    imagePath: "/images/DrinkMenu/FantaGrape.webp",
    portionGrams: 355,
    description:
      "Carbonated Water, High Fructose Corn Syrup, Natural and Artificial Flavors, Citric Acid, Sodium Benzoate, Red 40 (Color), Blue 1 (Color)",
    priceBgn: 4.9,
  },
  {
    name: "Fanta Peach",
    slug: "fanta-peach",
    imagePath: "/images/DrinkMenu/FantaPeach.webp",
    portionGrams: 355,
    description:
      "Carbonated Water, High Fructose Corn Syrup, Natural Flavors, Sodium Benzoate, Yellow 6 (Color), Red 40 (Color)",
    priceBgn: 4.9,
  },
  {
    name: "Fanta Pineapple",
    slug: "fanta-pineapple",
    imagePath: "/images/DrinkMenu/FantaPineapple.webp",
    portionGrams: 355,
    description:
      "Carbonated Water, High Fructose Corn Syrup, Natural Flavors, Sodium Benzoat, Potassium Sorbate, Yellow 5 (Color)",
    priceBgn: 4.9,
  },
];

async function main() {
  const username = process.env.ADMIN_USERNAME ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "Grill#Lucy26";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash },
  });

  const catalog = [
    ...burgers.map((item) => ({ ...item, category: Category.BURGER })),
    ...fries.map((item) => ({ ...item, category: Category.FRIES })),
    ...drinks.map((item) => ({ ...item, category: Category.DRINK })),
  ];

  for (const item of catalog) {
    await prisma.menuItem.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        priceBgn: item.priceBgn,
        portionGrams: item.portionGrams,
        category: item.category,
        imagePath: item.imagePath,
        isActive: true,
      },
      create: item,
    });
  }

  const existingOrders = await prisma.order.count();
  if (existingOrders === 0) {
    const lucy = await prisma.menuItem.findUniqueOrThrow({
      where: { slug: "the-juicy-lucy" },
    });
    const friesItem = await prisma.menuItem.findUniqueOrThrow({
      where: { slug: "regular-fries" },
    });
    const cola = await prisma.menuItem.findUniqueOrThrow({
      where: { slug: "coca-cola-original" },
    });
    const total =
      Number(lucy.priceBgn) + Number(friesItem.priceBgn) + Number(cola.priceBgn);

    await prisma.order.create({
      data: {
        customer: "Walk-in sample",
        status: OrderStatus.PENDING,
        totalBgn: total,
        items: {
          create: [
            { menuItemId: lucy.id, quantity: 1, unitPrice: lucy.priceBgn },
            {
              menuItemId: friesItem.id,
              quantity: 1,
              unitPrice: friesItem.priceBgn,
            },
            { menuItemId: cola.id, quantity: 1, unitPrice: cola.priceBgn },
          ],
        },
      },
    });
  }

  console.log(`Seeded ${catalog.length} menu items and admin "${username}".`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
