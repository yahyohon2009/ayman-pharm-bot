const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

const token = '8166009723:AAHE5TFG0IJPXG-jwPVABQpU1RzRBkAvVwU';
const ADMIN_ID = 7791362060;
const bot = new TelegramBot(token, { polling: true });
console.log("✅ Bot ishga tushdi...");

const regions = {
  'Toshkent': ['Chilonzor', 'Yunusobod', 'Olmazor', 'Yakkasaroy', 'Mirzo Ulug‘bek', 'Bektemir'],
  'Namangan': ['Namangan shahri', 'Davlatobod', 'Chortoq', 'Pop', 'To‘raqo‘rg‘on', 'Yangiqo‘rg‘on'],
  'Andijon': ['Andijon shahri', 'Asaka', 'Xonobod', 'Shaxrixon', 'Paxtaobod', 'Qo‘rg‘ontepa'],
  'Farg‘ona': ['Farg‘ona shahri', 'Qo‘qon', 'Marg‘ilon', 'Rishton', 'Oltiariq', 'Quva'],
  'Samarqand': ['Samarqand shahri', 'Kattaqo‘rg‘on', 'Urgut', 'Ishtixon', 'Paxtachi'],
  'Buxoro': ['Buxoro shahri', 'Kogon', 'G‘ijduvon', 'Vobkent'],
  'Xorazm': ['Urganch', 'Xiva', 'Xonqa', 'Yangibozor'],
  'Qashqadaryo': ['Qarshi', 'Shahrisabz', 'Kitob', 'Koson'],
  'Surxondaryo': ['Termiz', 'Denov', 'Sherobod'],
  'Jizzax': ['Jizzax shahri', 'Zomin', 'G‘allaorol'],
  'Navoiy': ['Navoiy shahri', 'Zarafshon', 'Karmana'],
  'Sirdaryo': ['Guliston', 'Shirin', 'Boyovut'],
  'Qoraqalpog‘iston': ['Nukus', 'Xo‘jayli', 'Taxiatosh']
};


const medicines = {
  sinepar: {
    name: "Sinepar",
    price: "15 000 so'm",
    description: {
      'UZ': "Og'riq qoldiruvchi dori",
      'RU': "Обезболивающее средство",
      'EN': "Pain reliever medicine"
    },
    address: "Namangan, Davlatobod tumani, O‘rta Rovuston, Rovuston savdo markazi yonida",
    phone: "+998 88 686 47 47"
  },
  analgin: {
    name: "Analgin",
    price: "6 000 so'm",
    description: {
      'UZ': "Oddiy og'riq qoldiruvchi",
      'RU': "Обычное обезболивающее",
      'EN': "Regular pain reliever"
    },
    address: "Toshkent, Chilonzor tumanidagi dorixona",
    phone: "+998 99 123 45 67"
  },
  nurofen: {
    name: "Nurofen",
    price: "18 000 so'm",
    description: {
      'UZ': "Harorat tushiruvchi va og'riq qoldiruvchi",
      'RU': "Жаропонижающее и обезболивающее",
      'EN': "Fever reducer and painkiller"
    },
    address: "Andijon, Shaxrixon dorixonasi",
    phone: "+998 90 111 22 33"
  },
  paracetamol: {
    name: "Paracetamol",
    price: "5 000 so'm",
    description: {
      'UZ': "Issiqlikni tushiruvchi, og'riqni kamaytiruvchi",
      'RU': "Снижает жар и боль",
      'EN': "Reduces fever and pain"
    },
    address: "Farg‘ona, Marg‘ilon dorixonasi",
    phone: "+998 91 987 65 43"
  }
};


const userStates = {};
const messages = {
  UZ: {
    welcome: "🇺🇿 Marhamat, tilni tanlang 👇",
    send_phone: "📞 Telefon raqamingizni yuboring:",
    region: "📍 Viloyatingizni tanlang:",
    district: "📍 Tumaningizni tanlang:",
    pharmacy_welcome: "🤝 Ayman Pharm dorixonasiga xush kelibsiz!",
    search: "💊 Dori nomini kiriting (kamida 3 ta harf):",
    not_found: "❌ Dori topilmadi",
    suggestion: "Siz rostan ham ushbu dorini buyurtma qilmoqchimisiz?",
    confirmed: "✅ Buyurtmangiz qabul qilindi.",
    cancelled: "❌ Buyurtma bekor qilindi.",
    feedback: "📩 Takliflaringizni @umarxanoff ga yuboring.",
    send: "📲 Raqamni yuborish",
    change_lang: "🗣 Tilni o‘zgartirish",
    change_location: "📍 Hududni o‘zgartirish",
    search_btn: "🔍 Qidiruv",
    feedback_btn: "💬 Fikr bildirish"
  },
  RU: {
    welcome: "🇷🇺 Пожалуйста, выберите язык 👇",
    send_phone: "📞 Отправьте свой номер телефона:",
    region: "📍 Выберите вашу область:",
    district: "📍 Выберите ваш район:",
    pharmacy_welcome: "🤝 Добро пожаловать в аптеку Ayman Pharm!",
    search: "💊 Введите название лекарства (не менее 3 букв):",
    not_found: "❌ Лекарство не найдено",
    suggestion: "Вы действительно хотите заказать это лекарство?",
    confirmed: "✅ Ваш заказ принят.",
    cancelled: "❌ Заказ отменен.",
    feedback: "📩 Отправьте ваши предложения @umarxanoff.",
    send: "📲 Отправить номер",
    change_lang: "🗣 Сменить язык",
    change_location: "📍 Сменить регион",
    search_btn: "🔍 Поиск",
    feedback_btn: "💬 Обратная связь"
  },
  EN: {
    welcome: "🇬🇧 Please choose a language 👇",
    send_phone: "📞 Please send your phone number:",
    region: "📍 Choose your region:",
    district: "📍 Choose your district:",
    pharmacy_welcome: "🤝 Welcome to Ayman Pharm pharmacy!",
    search: "💊 Enter medicine name (at least 3 letters):",
    not_found: "❌ Medicine not found",
    suggestion: "Do you really want to order this medicine?",
    confirmed: "✅ Your order has been received.",
    cancelled: "❌ Order cancelled.",
    feedback: "📩 Send your feedback to @umarxanoff.",
    send: "📲 Send phone",
    change_lang: "🗣 Change language",
    change_location: "📍 Change region",
    search_btn: "🔍 Search",
    feedback_btn: "💬 Feedback"
  }
};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  userStates[chatId] = {};
  const langs = ['🇺🇿 UZ', '🇷🇺 RU', '🇬🇧 EN'];
  bot.sendMessage(chatId,
    `${messages.UZ.welcome}\n\n${messages.RU.welcome}\n\n${messages.EN.welcome}`,
    {
      reply_markup: {
        keyboard: [langs],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    });
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  if (!userStates[chatId]) userStates[chatId] = {};
  const state = userStates[chatId];

  // til tanlovi
  if (['🇺🇿 UZ', '🇷🇺 RU', '🇬🇧 EN'].includes(text)) {
    state.lang = text.includes('UZ') ? 'UZ' : text.includes('RU') ? 'RU' : 'EN';
    bot.sendMessage(chatId, messages[state.lang].send_phone, {
      reply_markup: {
        keyboard: [[{ text: '📲 ' + messages[state.lang].send, request_contact: true }]],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    });
    return;
  }

  if (msg.contact) {
    state.phone = msg.contact.phone_number;
    bot.sendMessage(chatId, messages[state.lang].region, {
      reply_markup: {
        keyboard: Object.keys(regions).map(r => [r]),
        resize_keyboard: true,
        one_time_keyboard: true
      }
    });
    return;
  }

  if (regions[text]) {
    state.region = text;
    bot.sendMessage(chatId, messages[state.lang].district, {
      reply_markup: {
        keyboard: regions[text].map(d => [d]),
        resize_keyboard: true,
        one_time_keyboard: true
      }
    });
    return;
  }

  if (state.region && regions[state.region].includes(text)) {
    state.district = text;
    const m = messages[state.lang];
    bot.sendMessage(chatId, m.pharmacy_welcome, {
      reply_markup: {
        keyboard: [
          [m.search_btn],
          [m.change_lang, m.change_location],
          [m.feedback_btn]
        ],
        resize_keyboard: true
      }
    });
    return;
  }

  const m = messages[state.lang || 'UZ'];

  if (text === m.change_lang) {
    bot.sendMessage(chatId, `${messages.UZ.welcome}\n\n${messages.RU.welcome}\n\n${messages.EN.welcome}`, {
      reply_markup: {
        keyboard: [['🇺🇿 UZ', '🇷🇺 RU', '🇬🇧 EN']],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    });
    return;
  }

  if (text === m.change_location) {
    bot.sendMessage(chatId, m.region, {
      reply_markup: {
        keyboard: Object.keys(regions).map(r => [r]),
        resize_keyboard: true,
        one_time_keyboard: true
      }
    });
    return;
  }

  if (text === m.feedback_btn) {
    bot.sendMessage(chatId, m.feedback);
    return;
  }

  if (text === m.search_btn) {
    bot.sendMessage(chatId, m.search);
    return;
  }

  const keyword = text?.toLowerCase();
  if (keyword && keyword.length >= 3 && medicines[keyword]) {
    const med = medicines[keyword];
    bot.sendMessage(chatId, `💊 ${med.name}\n💵 ${med.price}\n🏪 Ayman Pharm\n📍 ${med.address}\n📞 ${med.phone}\n\n${m.suggestion}`, {
      reply_markup: {
        inline_keyboard: [[
          { text: '✅ Ha', callback_data: 'confirm_order' },
          { text: '❌ Yo‘q', callback_data: 'cancel_order' }
        ]]
      }
    });
  } else if (keyword && keyword.length >= 3) {
    bot.sendMessage(chatId, m.not_found);
  }
});

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const state = userStates[chatId] || {};
  const m = messages[state.lang || 'UZ'];

  if (query.data === 'confirm_order') {
    const order = `📦 Yangi buyurtma:\n👤 ID: ${chatId}\n📞 Tel: ${state.phone}\n📍 Hudud: ${state.region}, ${state.district}\n💊 Dori: Sinepar\n💵 Narx: 15 000 so'm\n\n`;

    // Adminga yuborish
    bot.sendMessage(ADMIN_ID, order);
    bot.sendMessage(chatId, m.confirmed);

    // Faylga yozish
    fs.appendFile('orders.txt', order, (err) => {
      if (err) console.error('❌ Faylga yozishda xatolik:', err);
    });
  } else {
    bot.sendMessage(chatId, m.cancelled);
  }
});
