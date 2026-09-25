import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AIChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface AIChatRequest {
  message: string;
  language?: string;
  role?: string;
  userId?: string;
  history?: AIChatMessage[];
}

export interface AIChatResponse {
  success: boolean;
  detectedLanguage: string;
  intent: string;
  confidence: number;
  replyText: string;
  cardType: 'ORDER' | 'PRICE' | 'PRODUCT' | 'CART' | 'FARMER' | 'SUPPORT' | null;
  cardData: any;
  quickActions: Array<{ label: string; action: string; path?: string }>;
  timestamp: string;
}

// ============================================================================
// 1. ADVANCED PER-MESSAGE MULTILINGUAL & TRANSLITERATION LANGUAGE DETECTOR
// ============================================================================

export const detectLanguageAndScript = (text: string): { lang: string; isTransliterated: boolean; label: string } => {
  const t = (text || '').trim();
  const lower = t.toLowerCase();

  // 1. Character counting for native Unicode script detection (Telugu vs Devanagari Hindi vs Tamil)
  const teCount = (t.match(/[\u0C00-\u0C7F]/g) || []).length;
  const hiCount = (t.match(/[\u0900-\u097F]/g) || []).length;
  const taCount = (t.match(/[\u0B80-\u0BFF]/g) || []).length;

  if (teCount > 0 && teCount >= hiCount) {
    return { lang: 'te', isTransliterated: false, label: 'తెలుగు (Telugu)' };
  }
  if (hiCount > 0 && hiCount > teCount) {
    return { lang: 'hi', isTransliterated: false, label: 'हिन्दी (Hindi)' };
  }
  if (taCount > 0) {
    return { lang: 'ta', isTransliterated: false, label: 'தமிழ் (Tamil)' };
  }

  // 2. Transliterated / Romanized Regional Input Detection (Teluglish & Hinglish)
  const teluglishKeywords = [
    'naa', 'nenu', 'ekkada', 'entha', 'panta', 'eppudu', 'undhi', 'undi',
    'cheppu', 'ammi', 'konali', 'namaskaram', 'bhaiya', 'kavali', 'vostundi',
    'vostadi', 'vundi', 'kavalenu', 'ela', 'yela', 'vasthundi'
  ];
  if (teluglishKeywords.some(kw => lower.includes(kw))) {
    return { lang: 'te', isTransliterated: true, label: 'Teluglish (Telugu)' };
  }

  const hinglishKeywords = [
    'tamatar', 'aalu', 'pyaaz', 'bhav', 'dam', 'kya', 'kaise', 'kahan', 'kaha',
    'hai', 'mera', 'meri', 'mere', 'karo', 'bechna', 'chahiye', 'khareedna',
    'namaste', 'bhai', 'rate kya hai', 'kab', 'aayega', 'aega', 'milega'
  ];
  if (hinglishKeywords.some(kw => lower.includes(kw))) {
    return { lang: 'hi', isTransliterated: true, label: 'Hinglish (Hindi)' };
  }

  // Default English
  return { lang: 'en', isTransliterated: false, label: 'English' };
};

// ============================================================================
// 2. INTENT CLASSIFICATION ENGINE
// ============================================================================

export const classifyIntent = (text: string): { intent: string; confidence: number } => {
  const lower = (text || '').toLowerCase();

  // Quality Video
  if (lower.includes('video') || lower.includes('quality video') || lower.includes('watch') || lower.includes('prakruthi') || lower.includes('వీడియో') || lower.includes('वीडियो')) {
    return { intent: 'QUALITY_VIDEO', confidence: 0.98 };
  }

  // Driver / Delivery partner
  if (lower.includes('driver') || lower.includes('delivery partner') || lower.includes('who is delivering') || lower.includes('vehicle') || lower.includes('ravi') || lower.includes('డ్రైవర్') || lower.includes('ड्राइवर')) {
    return { intent: 'DRIVER_INFO', confidence: 0.98 };
  }

  // Order status & tracking
  if (lower.includes('order') || lower.includes('track') || lower.includes('status') || lower.includes('where') || lower.includes('ekkada') || lower.includes('kahan') || lower.includes('enge') || lower.includes('ऑर्डर') || lower.includes('ఆర్డర్')) {
    if (lower.includes('cancel') || lower.includes('radd') || lower.includes('రద్దు')) {
      return { intent: 'CANCEL_ORDER', confidence: 0.98 };
    }
    return { intent: 'ORDER_STATUS', confidence: 0.98 };
  }

  // Cancellation explicit
  if (lower.includes('cancel') || lower.includes('cancellation') || lower.includes('radd') || lower.includes('రద్దు')) {
    return { intent: 'CANCEL_ORDER', confidence: 0.98 };
  }

  // Product price & comparison & units
  if (lower.includes('price') || lower.includes('cost') || lower.includes('rate') || lower.includes('dam') || lower.includes('bhav') || lower.includes('entha') || lower.includes('crate') || lower.includes('bag') || lower.includes('can') || lower.includes('ధర') || lower.includes('दाम') || lower.includes('भाव')) {
    return { intent: 'PRODUCT_PRICE', confidence: 0.95 };
  }

  // Product search & availability
  if (lower.includes('tomato') || lower.includes('potato') || lower.includes('onion') || lower.includes('mango') || lower.includes('rice') || lower.includes('wheat') || lower.includes('milk') || lower.includes('produce') || lower.includes('tamatar') || lower.includes('aalu') || lower.includes('pyaaz')) {
    return { intent: 'PRODUCT_SEARCH', confidence: 0.92 };
  }

  // Cart
  if (lower.includes('cart') || lower.includes('basket') || lower.includes('add to cart')) {
    return { intent: 'CART', confidence: 0.96 };
  }

  // Farmer sell & profile
  if (lower.includes('sell') || lower.includes('farmer') || lower.includes('crop') || lower.includes('harvest') || lower.includes('panta') || lower.includes('bechna') || lower.includes('అమ్మాలి')) {
    return { intent: 'FARMER_INFO', confidence: 0.94 };
  }

  // Bulk requests
  if (lower.includes('bulk') || lower.includes('wholesale') || lower.includes('kg') || lower.includes('ton') || lower.includes('quintal')) {
    return { intent: 'BULK_ORDER', confidence: 0.91 };
  }

  // Help & support
  if (lower.includes('help') || lower.includes('support') || lower.includes('issue') || lower.includes('agent') || lower.includes('ticket')) {
    return { intent: 'HELP_DESK', confidence: 0.95 };
  }

  // Greeting
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('namaste') || lower.includes('namaskaram') || lower.includes('hey')) {
    return { intent: 'GREETING', confidence: 0.99 };
  }

  return { intent: 'UNKNOWN', confidence: 0.50 };
};

// ============================================================================
// 3. MULTILINGUAL ORDER STATUS MAPPINGS & TEMPLATES
// ============================================================================

const orderStatusMap: Record<string, Record<string, string>> = {
  hi: {
    PENDING: 'लंबित',
    CONFIRMED: 'पुष्टि की गई',
    PREPARING: 'किसान तैयार कर रहा है',
    PICKED_UP: 'पिकअप हो गया',
    OUT_FOR_DELIVERY: 'डिलीवरी के लिए निकल चुका है',
    NEAR_YOU: 'आपके पास पहुँचने वाला है',
    DELIVERED: 'डिलीवर हो गया',
    CANCELLED: 'रद्द कर दिया गया'
  },
  te: {
    PENDING: 'పెండింగ్‌లో ఉంది',
    CONFIRMED: 'స్థిరీకరించబడింది',
    PREPARING: 'రైతు సిద్ధం చేస్తున్నారు',
    PICKED_UP: 'పికప్ పూర్తియింది',
    OUT_FOR_DELIVERY: 'డెలివరీకి బయలుదేరింది',
    NEAR_YOU: 'మీ ప్రాంతానికి సమీపంలో ఉంది',
    DELIVERED: 'డెలివరీ పూర్తయింది',
    CANCELLED: 'రద్దు చేయబడింది'
  },
  en: {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    PREPARING: 'Preparing',
    PICKED_UP: 'Picked Up',
    OUT_FOR_DELIVERY: 'Out for Delivery',
    NEAR_YOU: 'Near You',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled'
  }
};

const localizedTemplates: Record<string, Record<string, string>> = {
  hi: {
    greeting: 'नमस्ते! मैं किसानकनेक्ट AI हूँ। मैं आपकी क्या मदद कर सकता हूँ?',
    orderStatusFound: 'आपका ऑर्डर #%NUMBER% स्थिति: %STATUS% पर है। किसान: %FARMER%, कुल राशि: ₹%AMOUNT%।',
    orderNotFound: 'मुझे आपके खाते में कोई सक्रिय ऑर्डर नहीं मिला। क्या आप ताज़ी फसल देखना चाहेंगे?',
    cancelInfo: 'आप केवल [ऑर्डर प्लेस, पुष्टि की गई, या तैयारी] स्थिति में ऑर्डर रद्द कर सकते हैं। ऑर्डर ट्रैकिंग पेज पर जाएं और "ऑर्डर रद्द करें" बटन पर क्लिक करें।',
    driverInfo: 'आपके डिलीवरी पार्टनर %NAME% (%VEHICLE% - %NUMBER%) हैं। रेटिंग: %RATING% ★। आप ऑर्डर ट्रैकिंग पेज पर लाइव मैप देख सकते हैं।',
    videoInfo: 'उत्पाद की गुणवत्ता वीडियो देखने के लिए, उत्पाद विवरण पृष्ठ पर जाएं और "किसान द्वारा अपलोड किया गया वीडियो" देखें।',
    productSearchHeader: 'किसानकनेक्ट पर उपलब्ध ताज़ी थोक फसलें (क्रेट/बोरी/केन):',
    productPriceHeader: 'किसानकनेक्ट पर आज के थोक खेत के भाव (बिना बिचौलियों के):',
    cartInfo: 'आपकी कार्ट में %COUNT% आइटम हैं। कुल मूल्य: ₹%TOTAL%।',
    farmerGuide: 'अपनी फसल बेचने के लिए: किसान डैशबोर्ड → "उत्पाद जोड़ें" पर जाएं और गुणवत्ता वीडियो + क्रेट/बोरी विवरण अपलोड करें!',
    bulkGuide: 'थोक खरीद के लिए: थोक अनुरोध बनाएं और किसानों से सीधे ऑफर पाएं!',
    helpSupport: 'यदि आपको मानव सहायता की आवश्यकता है, तो सहायता डेस्क पर सहायता टिकट बनाएं।',
    agriStorageTip: 'टमाटर क्रेट और चावल की बोरियों को ठंडी सूखी जगह पर रखें। किसानकनेक्ट 24 घंटे में डिलीवरी सुनिश्चित करता है।',
    unknownFallback: 'आप पूछ सकते हैं: "मेरा ऑर्डर कहाँ है?", "क्या मैं ऑर्डर रद्द कर सकता हूँ?", "ड्राइवर कौन है?", या "टमाटर के क्रेट का भाव क्या है?"'
  },
  te: {
    greeting: 'నమస్కారం! నేను కిసాన్‌కనెక్ట్ AI. మీకు ఎలా సహాయపడగలను?',
    orderStatusFound: 'మీ ఆర్డర్ #%NUMBER% ప్రస్తుతం: %STATUS% స్థితిలో ఉంది. రైతు: %FARMER%, మొత్తం: ₹%AMOUNT%.',
    orderNotFound: 'మీ ఖాతాలో ఎలాంటి యాక్టివ్ ఆర్డర్‌లు లభించలేదు.',
    cancelInfo: 'ఆర్డర్ పిక్ అప్‌కి ముందు మాత్రమే రద్దు చేయవచ్చు (Order Placed, Confirmed, Preparing). ఆర్డర్ పేజీలో "Cancel Order" నొక్కండి.',
    driverInfo: 'మీ డెలివరీ భాగస్వామి %NAME% (%VEHICLE% - %NUMBER%), రేటింగ్: %RATING% ★. ఆర్డర్ ట్రాకింగ్ పేజీలో లైవ్ మ్యాప్ చూడవచ్చు.',
    videoInfo: 'పంట నాణ్యత వీడియోను చూడటానికి ఉత్పత్తుల పేజీలో "Watch Quality Video" బటన్ పై క్లిక్ చేయండి.',
    productSearchHeader: 'కిసాన్‌కనెక్ట్‌లో లభ్యమయ్యే తోట/బల్క్ పంట ఉత్పత్తులు (క్రేట్లు/బస్తాలు/క్యాన్లు):',
    productPriceHeader: 'ఈరోజు కిసాన్‌కనెక్ట్ రైతు ప్రత్యక్ష ధరలు:',
    cartInfo: 'మీ కార్ట్‌లో %COUNT% వస్తువులు ఉన్నాయి. మొత్తం: ₹%TOTAL%.',
    farmerGuide: 'మీ పంటను అమ్మడానికి: రైతు డాష్‌బోర్డ్ → "Add Product" కి వెళ్లి నాణ్యత వీడియోను అప్‌లోడ్ చేయండి!',
    bulkGuide: 'బల్క్ కొనుగోలుకు బల్క్ అభ్యర్థన సృష్టించండి!',
    helpSupport: 'సహాయం కోసం హెల్ప్ డెస్క్ సపోర్ట్ టికెట్ సృష్టించండి.',
    agriStorageTip: 'పంట ఉత్పత్తులను చల్లని వాతావరణంలో భద్రపరచండి.',
    unknownFallback: 'నన్ను అడగండి: "నా ఆర్డర్ ఎక్కడ ఉంది?", "ఆర్డర్ రద్దు చేయవచ్చా?", "డ్రైవర్ ఎవరు?", లేదా "టమోటా క్రేట్ ధర ఎంత?"'
  },
  en: {
    greeting: 'Hello! I am KissanConnect AI. How can I assist you with your agricultural produce orders today?',
    orderStatusFound: 'Your order #%NUMBER% is currently: %STATUS%. Farmer: %FARMER%, Total Amount: ₹%AMOUNT%.',
    orderNotFound: 'I could not find any active orders for your account.',
    cancelInfo: 'Order cancellation is allowed during Order Placed, Confirmed, or Preparing stages. Navigate to your Order Details page and click "Cancel Order". Demo refund will be initiated.',
    driverInfo: 'Your delivery partner is %NAME% driving a %VEHICLE% (%NUMBER%). Rating: %RATING% ★. You can view the Live/Demo Tracking Map on your order details page.',
    videoInfo: 'You can watch the farmer-uploaded Crop Quality Video directly on the Product Detail page before placing your bulk order.',
    productSearchHeader: 'Bulk agricultural produce available on KissanConnect (Crates / Bags / Cans):',
    productPriceHeader: 'Today\'s direct farm gate bulk prices on KissanConnect (0% Middlemen):',
    cartInfo: 'Your cart contains %COUNT% bulk items with direct farm subtotal of ₹%TOTAL%.',
    farmerGuide: 'To sell your produce: Go to Farmer Dashboard → Add Product, select unit type (Crates/Bags/Cans), unit size, and upload a Crop Quality Video!',
    bulkGuide: 'To procure in bulk: Post a Bulk Request to receive direct competitive bids from farmers!',
    helpSupport: 'If you need human assistance, please create a ticket on our Help Desk.',
    agriStorageTip: 'Store bulk crates and bags in dry, shaded warehouses. KissanConnect ensures farm-gate to doorstep logistics.',
    unknownFallback: 'You can ask: "Where is my order?", "Can I cancel my order?", "Who is delivering my order?", or "How much is one crate of tomatoes?"'
  }
};

const getDict = (lang: string) => localizedTemplates[lang] || localizedTemplates.en;

// ============================================================================
// 4. MAIN PROCESS AI CHAT FUNCTION WITH REAL PRISMA DATABASE QUERIES
// ============================================================================

export const processAIChat = async (reqPayload: AIChatRequest): Promise<AIChatResponse> => {
  const { message, userId } = reqPayload;
  const rawText = (message || '').trim();

  // ALWAYS detect language per-message from the user's input text
  const langInfo = detectLanguageAndScript(rawText);
  const detectedLang = langInfo.lang;
  const dict = getDict(detectedLang);

  // Classify Intent
  const { intent, confidence } = classifyIntent(rawText);
  const lowerMsg = rawText.toLowerCase();

  let replyText = dict.unknownFallback;
  let cardType: 'ORDER' | 'PRICE' | 'PRODUCT' | 'CART' | 'FARMER' | 'SUPPORT' | null = null;
  let cardData: any = null;
  let quickActions: Array<{ label: string; action: string; path?: string }> = [];

  // GREETING
  if (intent === 'GREETING') {
    replyText = dict.greeting;
    quickActions = [
      { label: '🛒 Browse Marketplace', action: 'NAVIGATE', path: '/marketplace' },
      { label: '📦 Track My Order', action: 'NAVIGATE', path: '/consumer/orders' }
    ];
  }

  // QUALITY VIDEO
  if (intent === 'QUALITY_VIDEO') {
    replyText = dict.videoInfo;
    quickActions = [
      { label: '🍅 View Tomatoes & Watch Video', action: 'NAVIGATE', path: '/marketplace' },
      { label: '📦 Browse Marketplace', action: 'NAVIGATE', path: '/marketplace' }
    ];
  }

  // DRIVER INFO
  else if (intent === 'DRIVER_INFO') {
    let order = await prisma.order.findFirst({
      where: { delivery: { isNot: null } },
      orderBy: { createdAt: 'desc' },
      include: { delivery: true }
    });

    const driverName = order?.delivery?.driverName || 'Ravi Kumar';
    const vehicleType = order?.delivery?.vehicleType || 'Tata Ace';
    const vehicleNumber = order?.delivery?.vehicleNumber || 'AP 03 TX 4821';
    const driverRating = (order?.delivery?.driverRating || 4.8).toString();

    replyText = dict.driverInfo
      .replace('%NAME%', driverName)
      .replace('%VEHICLE%', vehicleType)
      .replace('%NUMBER%', vehicleNumber)
      .replace('%RATING%', driverRating);

    cardType = 'ORDER';
    cardData = order ? {
      id: order.id,
      orderNumber: order.orderNumber,
      status: 'In Transit',
      driverName,
      vehicleNumber,
      totalAmount: order.totalAmount,
      itemsCount: 1,
      expectedDelivery: '25 mins away'
    } : null;

    quickActions = [
      { label: '🚚 Open Live Tracking Map', action: 'NAVIGATE', path: order ? `/orders/${order.id}` : '/consumer/orders' }
    ];
  }

  // CANCEL ORDER
  else if (intent === 'CANCEL_ORDER') {
    replyText = dict.cancelInfo;
    quickActions = [
      { label: '📦 Manage Orders & Cancel', action: 'NAVIGATE', path: '/consumer/orders' },
      { label: '❓ Help Desk', action: 'NAVIGATE', path: '/help' }
    ];
  }

  // ORDER STATUS & TRACKING
  else if (intent === 'ORDER_STATUS' || intent === 'ORDER_TRACKING') {
    let order = null;

    if (userId) {
      order = await prisma.order.findFirst({
        where: { OR: [{ buyerId: userId }, { farmerId: userId }] },
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { product: true } }, farmer: true }
      });
    }

    if (!order) {
      order = await prisma.order.findFirst({
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { product: true } }, farmer: true }
      });
    }

    if (order) {
      const rawStatus = order.status;
      const statusText = orderStatusMap[detectedLang]?.[rawStatus] || rawStatus.replace(/_/g, ' ');
      replyText = dict.orderStatusFound
        .replace('%NUMBER%', order.orderNumber)
        .replace('%STATUS%', statusText)
        .replace('%FARMER%', order.farmer?.name || 'Ramesh Kumar')
        .replace('%AMOUNT%', order.totalAmount.toString());

      cardType = 'ORDER';
      cardData = {
        id: order.id,
        orderNumber: order.orderNumber,
        status: statusText,
        farmerName: order.farmer?.name || 'Ramesh Kumar',
        totalAmount: order.totalAmount,
        itemsCount: order.items.length,
        expectedDelivery: '25 mins away'
      };

      quickActions = [
        { label: '🚚 Track Live Timeline', action: 'NAVIGATE', path: `/orders/${order.id}` },
        { label: '📦 All Orders', action: 'NAVIGATE', path: '/consumer/orders' }
      ];
    } else {
      replyText = dict.orderNotFound;
      quickActions = [
        { label: '🛒 Shop Produce', action: 'NAVIGATE', path: '/marketplace' }
      ];
    }
  }

  // PRODUCT PRICE & COMPARISON
  else if (intent === 'PRODUCT_PRICE') {
    const products = await prisma.product.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: { category: true }
    });

    if (products.length > 0) {
      replyText = dict.productPriceHeader;
      cardType = 'PRICE';
      cardData = products.map(p => ({
        id: p.id,
        name: `${p.name} ${p.category?.icon || '🌾'}`,
        farmPrice: p.price,
        marketPrice: Math.round(p.price * 1.25),
        savings: Math.round(p.price * 0.25),
        unit: p.unit
      }));
      quickActions = [
        { label: '🛒 Shop Direct Fresh', action: 'NAVIGATE', path: '/marketplace' },
        { label: '📊 Price Comparison', action: 'NAVIGATE', path: '/#ai-features' }
      ];
    } else {
      replyText = dict.unknownFallback;
    }
  }

  // PRODUCT SEARCH & AVAILABILITY
  else if (intent === 'PRODUCT_SEARCH' || lowerMsg.includes('tomato') || lowerMsg.includes('potato') || lowerMsg.includes('onion') || lowerMsg.includes('mango') || lowerMsg.includes('rice')) {
    let searchTerm = '';
    if (lowerMsg.includes('tomato') || lowerMsg.includes('tamatar')) searchTerm = 'Tomato';
    else if (lowerMsg.includes('potato') || lowerMsg.includes('aalu')) searchTerm = 'Potato';
    else if (lowerMsg.includes('onion') || lowerMsg.includes('pyaaz')) searchTerm = 'Onion';
    else if (lowerMsg.includes('mango')) searchTerm = 'Mango';
    else if (lowerMsg.includes('rice')) searchTerm = 'Rice';

    const whereClause = searchTerm ? { name: { contains: searchTerm } } : {};
    const products = await prisma.product.findMany({
      where: whereClause,
      take: 3,
      include: { farmer: true, category: true }
    });

    if (products.length > 0) {
      replyText = dict.productSearchHeader;
      cardType = 'PRODUCT';
      cardData = products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        unit: p.unit,
        farmer: p.farmer?.name || 'Local Farmer',
        location: p.location || 'Direct Farm',
        stock: p.quantity,
        image: p.image
      }));

      quickActions = [
        { label: '🛒 View All in Marketplace', action: 'NAVIGATE', path: '/marketplace' }
      ];
    } else {
      replyText = dict.orderNotFound;
      quickActions = [{ label: '🛒 Marketplace', action: 'NAVIGATE', path: '/marketplace' }];
    }
  }

  // CART
  else if (intent === 'CART') {
    let cartCount = 0;
    let cartTotal = 0;

    if (userId) {
      const cartItems = await prisma.cartItem.findMany({
        where: { cart: { userId } },
        include: { product: true }
      });
      cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
      cartTotal = cartItems.reduce((acc, item) => acc + (item.quantity * (item.product?.price || 0)), 0);
    }

    replyText = dict.cartInfo.replace('%COUNT%', cartCount.toString()).replace('%TOTAL%', cartTotal.toString());
    cardType = 'CART';
    cardData = { count: cartCount, total: cartTotal };
    quickActions = [
      { label: '🛒 Go to Cart & Checkout', action: 'NAVIGATE', path: '/cart' }
    ];
  }

  // FARMER INFO & CROP LISTING
  else if (intent === 'FARMER_INFO') {
    replyText = dict.farmerGuide;
    cardType = 'FARMER';
    cardData = {
      title: '👨‍🌾 Direct Farmer Crop Listing',
      steps: [
        '1. Open Farmer Dashboard',
        '2. Click [ ADD PRODUCT ]',
        '3. Enter harvest date, price & stock quantity',
        '4. Direct customer orders start arriving!'
      ]
    };
    quickActions = [
      { label: '👨‍🌾 Farmer Dashboard', action: 'NAVIGATE', path: '/farmer/dashboard' },
      { label: '➕ Add Product', action: 'NAVIGATE', path: '/farmer/products' }
    ];
  }

  // BULK ORDER PROCUREMENT
  else if (intent === 'BULK_ORDER') {
    replyText = dict.bulkGuide;
    quickActions = [
      { label: '🌾 Post Bulk Request', action: 'NAVIGATE', path: '/bulk-requests' }
    ];
  }

  // HELP DESK / HUMAN SUPPORT
  else if (intent === 'HELP_DESK') {
    replyText = dict.helpSupport;
    cardType = 'SUPPORT';
    quickActions = [
      { label: '❓ Open Support Ticket', action: 'NAVIGATE', path: '/help' }
    ];
  }

  // GENERAL AGRICULTURE TIPS
  else if (intent === 'GENERAL_AGRICULTURE') {
    replyText = dict.agriStorageTip;
    quickActions = [
      { label: '🌾 Browse Fresh Produce', action: 'NAVIGATE', path: '/marketplace' }
    ];
  }

  return {
    success: true,
    detectedLanguage: detectedLang,
    intent,
    confidence,
    replyText,
    cardType,
    cardData,
    quickActions,
    timestamp: new Date().toISOString()
  };
};
