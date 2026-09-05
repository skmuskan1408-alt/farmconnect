import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting FARMCONNECT database seeding...');

  // Clean existing tables
  await prisma.farmerOffer.deleteMany();
  await prisma.bulkRequest.deleteMany();
  await prisma.demandForecast.deleteMany();
  await prisma.priceHistory.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.review.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.farmerProfile.deleteMany();
  await prisma.consumerProfile.deleteMany();
  await prisma.bulkBuyerProfile.deleteMany();
  await prisma.user.deleteMany();

  const defaultPassword = await bcrypt.hash('password123', 10);

  // 1. Create Admin
  await prisma.user.create({
    data: {
      email: 'admin@farmconnect.in',
      password: defaultPassword,
      name: 'System Admin',
      phone: '+91 9876543210',
      role: 'ADMIN',
      location: 'New Delhi, Delhi'
    }
  });

  // 2. Create Categories
  const categoriesData = [
    { name: 'Fresh Vegetables', icon: '🥕', slug: 'vegetables' },
    { name: 'Organic Fruits', icon: '🍎', slug: 'fruits' },
    { name: 'Grains & Cereals', icon: '🌾', slug: 'grains' },
    { name: 'Spices & Herbs', icon: '🌶️', slug: 'spices' },
    { name: 'Dairy & Farm Fresh', icon: '🥛', slug: 'dairy' }
  ];

  const categoriesMap: { [key: string]: string } = {};
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.create({ data: cat });
    categoriesMap[cat.slug] = createdCat.id;
  }

  // 3. Create 10 Farmers
  const farmersList = [
    { name: 'Ramesh Kumar', email: 'ramesh.farmer@farmconnect.in', phone: '+91 9812345671', location: 'Madanapalle, Andhra Pradesh', farmName: 'Green Valley Agro Farm', organic: true, type: 'Natural & Hydroponic', bio: 'Pioneer in organic tomato and vegetable cultivation with 15+ years of experience.' },
    { name: 'Suresh Patel', email: 'suresh.farmer@farmconnect.in', phone: '+91 9812345672', location: 'Nashik, Maharashtra', farmName: 'Sahyadri Agri Farms', organic: true, type: 'Organic Certified', bio: 'Specialized in premium Nashik onions and exporter-grade grapes.' },
    { name: 'Anita Devi', email: 'anita.farmer@farmconnect.in', phone: '+91 9812345673', location: 'Kolar, Karnataka', farmName: 'Surya Organic Produce', organic: true, type: 'Permaculture', bio: 'Empowering women in agriculture; focused on zero-pesticide root crops.' },
    { name: 'Baldev Singh', email: 'baldev.farmer@farmconnect.in', phone: '+91 9812345674', location: 'Ludhiana, Punjab', farmName: 'Golden Fields Wheat & Paddy', organic: false, type: 'Traditional Mechanized', bio: 'Direct grain producer supplying top quality Sharbati wheat and basmati rice.' },
    { name: 'Rajesh Gowda', email: 'rajesh.farmer@farmconnect.in', phone: '+91 9812345675', location: 'Mandya, Karnataka', farmName: 'Kaveri Basin Organic Farm', organic: true, type: 'Vedic Farming', bio: 'Focuses on ancient grain varieties, jaggery, and chemical-free fruits.' },
    { name: 'Vikram Reddy', email: 'vikram.farmer@farmconnect.in', phone: '+91 9812345676', location: 'Guntur, Andhra Pradesh', farmName: 'Mirchi King Spices Farm', organic: false, type: 'Precision Agriculture', bio: 'Renowned for world-famous Guntur Sanam and Teja red chillies.' },
    { name: 'Gurpreet Kaur', email: 'gurpreet.farmer@farmconnect.in', phone: '+91 9812345677', location: 'Amritsar, Punjab', farmName: 'Amrit Organic Dairy & Produce', organic: true, type: 'Biodynamic', bio: 'Combining A2 dairy farming with seasonal organic green vegetables.' },
    { name: 'Devendra Kulkarni', email: 'devendra.farmer@farmconnect.in', phone: '+91 9812345678', location: 'Ratnagiri, Maharashtra', farmName: 'Konkan Orchards', organic: true, type: 'GI Tagged Mango Agro', bio: 'Authentic Ratnagiri Alphonso mango grower with GI tagging.' },
    { name: 'Kavitha Nair', email: 'kavitha.farmer@farmconnect.in', phone: '+91 9812345679', location: 'Wayanad, Kerala', farmName: 'Highland Spice Plantation', organic: true, type: 'Shade Grown Organic', bio: 'Harvesting premium turmeric, black pepper, and cardamom straight from Wayanad hills.' },
    { name: 'Mahesh Sharma', email: 'mahesh.farmer@farmconnect.in', phone: '+91 9812345680', location: 'Shimla, Himachal Pradesh', farmName: 'Apple Valley Orchards', organic: false, type: 'Himalayan Horticulture', bio: 'Fresh crisp Shimla apples and cherries grown in clean mountain air.' }
  ];

  const farmerUserIds: string[] = [];
  for (const f of farmersList) {
    const u = await prisma.user.create({
      data: {
        name: f.name,
        email: f.email,
        phone: f.phone,
        password: defaultPassword,
        role: 'FARMER',
        location: f.location,
        farmerProfile: {
          create: {
            farmName: f.farmName,
            farmLocation: f.location,
            organicCertified: f.organic,
            farmingType: f.type,
            bio: f.bio,
            rating: 4.7 + Math.random() * 0.3,
            totalSales: Math.floor(150 + Math.random() * 500)
          }
        }
      }
    });
    farmerUserIds.push(u.id);
  }

  // 4. Create 10 Consumers
  const consumersList = [
    { name: 'Priya Sharma', email: 'priya.consumer@gmail.com', location: 'Bengaluru, Karnataka' },
    { name: 'Amit Verma', email: 'amit.verma@yahoo.com', location: 'Mumbai, Maharashtra' },
    { name: 'Sunita Reddy', email: 'sunita.reddy@outlook.com', location: 'Hyderabad, Telangana' },
    { name: 'Rahul Gupta', email: 'rahul.gupta@gmail.com', location: 'New Delhi, Delhi' },
    { name: 'Meera Iyer', email: 'meera.iyer@gmail.com', location: 'Chennai, Tamil Nadu' },
    { name: 'Arjun Das', email: 'arjun.das@hotmail.com', location: 'Kolkata, West Bengal' },
    { name: 'Neha Joshi', email: 'neha.joshi@gmail.com', location: 'Pune, Maharashtra' },
    { name: 'Siddharth Mehta', email: 'siddharth.m@gmail.com', location: 'Ahmedabad, Gujarat' },
    { name: 'Pooja Agarwal', email: 'pooja.a@gmail.com', location: 'Jaipur, Rajasthan' },
    { name: 'Vikas Malhotra', email: 'vikas.m@gmail.com', location: 'Chandigarh, Punjab' }
  ];

  const consumerUserIds: string[] = [];
  for (const c of consumersList) {
    const u = await prisma.user.create({
      data: {
        name: c.name,
        email: c.email,
        phone: '+91 97' + Math.floor(10000000 + Math.random() * 90000000),
        password: defaultPassword,
        role: 'CONSUMER',
        location: c.location,
        consumerProfile: {
          create: {
            preferredCategory: 'Fresh Vegetables',
            addressLine: `Flat 402, Sunshine Heights, ${c.location}`
          }
        },
        cart: {
          create: {}
        }
      }
    });
    consumerUserIds.push(u.id);
  }

  // 5. Create 5 Bulk Buyers
  const buyersList = [
    { name: 'Anand Mahindra (Procurement Head)', email: 'procure@bigbasketco.com', org: 'BigBasket Fresh Logistics', biz: 'Supermarket Chain', location: 'Bengaluru, Karnataka' },
    { name: 'Deepak Chawla', email: 'buyers@freshtohomeagri.in', org: 'FreshToHome Organics', biz: 'E-Grocery Platform', location: 'Mumbai, Maharashtra' },
    { name: 'Ritu Agarwal', email: 'agri@relianceretail.com', org: 'Reliance Smart Superstore', biz: 'Retail Chain', location: 'Hyderabad, Telangana' },
    { name: 'Sunil Shekhawat', email: 'b2b@metro-cash-carry.in', org: 'Metro Wholesale India', biz: 'Bulk Cash & Carry', location: 'Delhi NCR' },
    { name: 'Kiran Mazumdar', email: 'info@localcoopmarket.org', org: 'Karnataka Farmers Co-op Federation', biz: 'Cooperative Union', location: 'Mysuru, Karnataka' }
  ];

  const buyerUserIds: string[] = [];
  for (const b of buyersList) {
    const u = await prisma.user.create({
      data: {
        name: b.name,
        email: b.email,
        phone: '+91 96' + Math.floor(10000000 + Math.random() * 90000000),
        password: defaultPassword,
        role: 'BULK_BUYER',
        location: b.location,
        buyerProfile: {
          create: {
            organizationName: b.org,
            businessType: b.biz,
            requiredProducts: 'Tomatoes, Onions, Potatoes, Rice',
            expectedQuantity: '500kg - 5000kg monthly'
          }
        }
      }
    });
    buyerUserIds.push(u.id);
  }

  // 6. Create 20+ Products
  const productsData = [
    {
      farmerIndex: 0,
      categorySlug: 'vegetables',
      name: 'Madanapalle Red Tomatoes',
      description: 'Vine-ripened, firm, farm-fresh tomatoes directly from Madanapalle fields. Zero synthetic preservatives.',
      price: 32,
      localPrice: 40,
      retailPrice: 48,
      quantity: 1200,
      unit: 'kg',
      location: 'Madanapalle, AP',
      harvestDate: '2026-09-02',
      organic: true,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'
    },
    {
      farmerIndex: 1,
      categorySlug: 'vegetables',
      name: 'Nashik Red Onions',
      description: 'High shelf life, top export quality Nashik pinkish-red onions. Crisp texture and rich flavor.',
      price: 24,
      localPrice: 32,
      retailPrice: 38,
      quantity: 2500,
      unit: 'kg',
      location: 'Nashik, MH',
      harvestDate: '2026-08-28',
      organic: true,
      image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80'
    },
    {
      farmerIndex: 2,
      categorySlug: 'vegetables',
      name: 'Kolar Gold Potatoes',
      description: 'Nutrient-dense, low-moisture potatoes suitable for everyday cooking and frying.',
      price: 22,
      localPrice: 28,
      retailPrice: 35,
      quantity: 1800,
      unit: 'kg',
      location: 'Kolar, KA',
      harvestDate: '2026-09-01',
      organic: true,
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80'
    },
    {
      farmerIndex: 2,
      categorySlug: 'vegetables',
      name: 'Organic Crunchy Carrots',
      description: 'Sweet, juicy, vibrant orange carrots harvested without chemicals.',
      price: 38,
      localPrice: 48,
      retailPrice: 58,
      quantity: 600,
      unit: 'kg',
      location: 'Kolar, KA',
      harvestDate: '2026-09-03',
      organic: true,
      image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=80'
    },
    {
      farmerIndex: 7,
      categorySlug: 'fruits',
      name: 'Ratnagiri GI Alphonso Mangoes',
      description: 'The king of mangoes! Naturally ripened in rice hay, intensely sweet aroma.',
      price: 450,
      localPrice: 600,
      retailPrice: 750,
      quantity: 350,
      unit: 'dozen',
      location: 'Ratnagiri, MH',
      harvestDate: '2026-08-30',
      organic: true,
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80'
    },
    {
      farmerIndex: 4,
      categorySlug: 'fruits',
      name: 'Mandya Robusta Bananas',
      description: 'Fresh green-yellow robusta banana bunches, naturally grown along Kaveri banks.',
      price: 35,
      localPrice: 45,
      retailPrice: 55,
      quantity: 800,
      unit: 'dozen',
      location: 'Mandya, KA',
      harvestDate: '2026-09-04',
      organic: true,
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=80'
    },
    {
      farmerIndex: 3,
      categorySlug: 'grains',
      name: 'Premium Sona Masoori Rice (Old Harvest)',
      description: 'Aromatic, lightweight, 12-month aged Sona Masoori unpolished white rice.',
      price: 58,
      localPrice: 70,
      retailPrice: 82,
      quantity: 5000,
      unit: 'kg',
      location: 'Ludhiana, PB',
      harvestDate: '2026-05-15',
      organic: false,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80'
    },
    {
      farmerIndex: 3,
      categorySlug: 'grains',
      name: 'Sharbati MP Golden Wheat',
      description: 'Whole grain Sharbati wheat berries yielding soft, fluffy chapattis.',
      price: 42,
      localPrice: 52,
      retailPrice: 62,
      quantity: 4000,
      unit: 'kg',
      location: 'Ludhiana, PB',
      harvestDate: '2026-04-20',
      organic: false,
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80'
    },
    {
      farmerIndex: 5,
      categorySlug: 'spices',
      name: 'Guntur Sun-Dried Red Chillies',
      description: 'Pungent, vibrant red Guntur chilli pods for traditional curry masalas.',
      price: 180,
      localPrice: 220,
      retailPrice: 260,
      quantity: 450,
      unit: 'kg',
      location: 'Guntur, AP',
      harvestDate: '2026-08-25',
      organic: false,
      image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop&q=80'
    },
    {
      farmerIndex: 8,
      categorySlug: 'spices',
      name: 'Wayanad High-Curcumin Turmeric',
      description: 'Pure organic lakadong turmeric powder with 6.5%+ curcumin content.',
      price: 210,
      localPrice: 270,
      retailPrice: 320,
      quantity: 300,
      unit: 'kg',
      location: 'Wayanad, KL',
      harvestDate: '2026-08-10',
      organic: true,
      image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80'
    },
    {
      farmerIndex: 6,
      categorySlug: 'dairy',
      name: 'Pure Desi Cow Milk (A2)',
      description: 'Raw unpasteurized A2 milk from Gir cows fed on natural green pasture.',
      price: 70,
      localPrice: 85,
      retailPrice: 95,
      quantity: 200,
      unit: 'liter',
      location: 'Amritsar, PB',
      harvestDate: '2026-09-05',
      organic: true,
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&auto=format&fit=crop&q=80'
    },
    {
      farmerIndex: 9,
      categorySlug: 'fruits',
      name: 'Crisp Shimla Red Royal Apples',
      description: 'Handpicked juicy red apples directly from mountain orchards.',
      price: 120,
      localPrice: 160,
      retailPrice: 190,
      quantity: 1500,
      unit: 'kg',
      location: 'Shimla, HP',
      harvestDate: '2026-09-01',
      organic: false,
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80'
    },
    {
      farmerIndex: 0,
      categorySlug: 'vegetables',
      name: 'Fresh Farm Green Capsicum',
      description: 'Glossy, thick-walled bell peppers ideal for salads and stir frying.',
      price: 45,
      localPrice: 60,
      retailPrice: 75,
      quantity: 400,
      unit: 'kg',
      location: 'Madanapalle, AP',
      harvestDate: '2026-09-04',
      organic: true,
      image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&auto=format&fit=crop&q=80'
    },
    {
      farmerIndex: 1,
      categorySlug: 'vegetables',
      name: 'Organic Farm Garlic Pods',
      description: 'Pungent whole garlic bulbs with skin intact, high medicinal value.',
      price: 140,
      localPrice: 180,
      retailPrice: 220,
      quantity: 350,
      unit: 'kg',
      location: 'Nashik, MH',
      harvestDate: '2026-08-20',
      organic: true,
      image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=800&auto=format&fit=crop&q=80'
    },
    {
      farmerIndex: 6,
      categorySlug: 'vegetables',
      name: 'Fresh Farm Spinach (Palak)',
      description: 'Tender green leaves packed with iron and minerals, washed and bunched.',
      price: 20,
      localPrice: 30,
      retailPrice: 40,
      quantity: 250,
      unit: 'bunch',
      location: 'Amritsar, PB',
      harvestDate: '2026-09-05',
      organic: true,
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop&q=80'
    }
  ];

  const productCreatedIds: string[] = [];
  for (const p of productsData) {
    const prod = await prisma.product.create({
      data: {
        farmerId: farmerUserIds[p.farmerIndex],
        categoryId: categoriesMap[p.categorySlug],
        name: p.name,
        description: p.description,
        price: p.price,
        quantity: p.quantity,
        unit: p.unit,
        location: p.location,
        harvestDate: p.harvestDate,
        organic: p.organic,
        deliveryAvailable: true,
        pickupAvailable: true,
        image: p.image,
        rating: 4.5 + Math.random() * 0.4,
        salesCount: Math.floor(20 + Math.random() * 150)
      }
    });
    productCreatedIds.push(prod.id);

    // Create price history for price comparison
    await prisma.priceHistory.create({
      data: {
        productId: prod.id,
        farmConnectPrice: p.price,
        localMarketPrice: p.localPrice,
        retailPrice: p.retailPrice
      }
    });

    // Create 7-day demand forecasts for AI module
    const dates = ['2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04', '2026-09-05', '2026-09-06', '2026-09-07'];
    for (const d of dates) {
      const baseSold = 40 + Math.floor(Math.random() * 60);
      await prisma.demandForecast.create({
        data: {
          productId: prod.id,
          historicalDate: d,
          quantitySold: baseSold,
          predictedDemand: baseSold * (1 + (Math.random() * 0.3 - 0.1)),
          confidenceScore: 0.91 + Math.random() * 0.07
        }
      });
    }
  }

  // 7. Create 15 Orders & Deliveries
  const orderStatuses = ['DELIVERED', 'OUT_FOR_DELIVERY', 'PREPARING', 'CONFIRMED', 'DELIVERED'];
  for (let i = 0; i < 15; i++) {
    const buyerId = consumerUserIds[i % consumerUserIds.length];
    const productId = productCreatedIds[i % productCreatedIds.length];
    const farmerId = farmerUserIds[i % farmerUserIds.length];
    const status = orderStatuses[i % orderStatuses.length];

    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-2026-${1000 + i}`,
        buyerId: buyerId,
        farmerId: farmerId,
        totalAmount: (i + 1) * 160 + 50,
        status: status,
        paymentMethod: i % 2 === 0 ? 'UPI' : 'CARD',
        shippingAddress: `Sector ${i + 1}, Garden City, India`,
        deliveryType: 'DELIVERY',
        items: {
          create: [
            {
              productId: productId,
              quantity: (i % 5) + 2,
              price: 32 + i * 5,
              unit: 'kg'
            }
          ]
        },
        payment: {
          create: {
            transactionId: `TXN-DEMO-${888000 + i}`,
            status: 'COMPLETED',
            amount: (i + 1) * 160 + 50,
            method: i % 2 === 0 ? 'UPI' : 'CARD'
          }
        },
        delivery: {
          create: {
            farmerId: farmerId,
            consumerId: buyerId,
            pickupLocation: 'Farmer Gate / Mandi Hub',
            deliveryLocation: `Consumer Residence Sector ${i + 1}`,
            status: status === 'DELIVERED' ? 'DELIVERED' : 'IN_TRANSIT',
            distanceKm: 8.5 + (i * 1.2),
            estimatedMins: 25 + (i * 3),
            routeDetails: JSON.stringify({
              stops: ['Farm Gate', 'Hub 1 (Chittoor)', 'Hub 2 (City Central)', 'Consumer Address'],
              optimized: true
            })
          }
        }
      }
    });

    // Add review for delivered orders
    if (status === 'DELIVERED') {
      await prisma.review.create({
        data: {
          productId: productId,
          orderId: order.id,
          userId: buyerId,
          rating: 5,
          comment: 'Outstanding quality produce directly from farm! Fresh, crisp and delivered right on time.'
        }
      });
    }
  }

  // 8. Create Bulk Requests and Farmer Offers
  const bulkReq1 = await prisma.bulkRequest.create({
    data: {
      buyerId: buyerUserIds[0],
      productName: 'Madanapalle Red Tomatoes',
      quantity: 1000,
      unit: 'kg',
      requiredDate: '2026-09-12',
      targetPrice: 28,
      location: 'Bengaluru Distribution Center',
      status: 'OPEN'
    }
  });

  await prisma.farmerOffer.create({
    data: {
      bulkRequestId: bulkReq1.id,
      farmerId: farmerUserIds[0],
      offeredQuantity: 1000,
      pricePerUnit: 29.5,
      deliveryDate: '2026-09-11',
      note: 'We can deliver premium Grade A tomatoes directly in crates.',
      status: 'PENDING'
    }
  });

  const bulkReq2 = await prisma.bulkRequest.create({
    data: {
      buyerId: buyerUserIds[1],
      productName: 'Nashik Red Onions',
      quantity: 3000,
      unit: 'kg',
      requiredDate: '2026-09-15',
      targetPrice: 22,
      location: 'Bhiwandi Warehouse, Mumbai',
      status: 'OPEN'
    }
  });

  await prisma.farmerOffer.create({
    data: {
      bulkRequestId: bulkReq2.id,
      farmerId: farmerUserIds[1],
      offeredQuantity: 3000,
      pricePerUnit: 23,
      deliveryDate: '2026-09-14',
      note: 'Export quality dry onions with high shelf life.',
      status: 'PENDING'
    }
  });

  // 9. Create Notifications
  await prisma.notification.createMany({
    data: [
      { userId: farmerUserIds[0], title: 'New Order Received! 🛒', message: 'Consumer Priya Sharma ordered 10kg Madanapalle Red Tomatoes.', type: 'ORDER' },
      { userId: farmerUserIds[0], title: 'Demand Alert 📈', message: 'Tomato demand is projected to rise by 24% next week.', type: 'DEMAND' },
      { userId: consumerUserIds[0], title: 'Order Dispatched 🚚', message: 'Your order ORD-2026-1000 is out for delivery with route optimization.', type: 'DISPATCH' }
    ]
  });

  console.log('✅ FARMCONNECT database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
