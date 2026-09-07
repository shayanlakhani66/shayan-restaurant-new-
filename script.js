/**
 * SHAYAN RESTAURANT - JAVASCRIPT CONTROLLER
 * Fully Interactive: LocalStorage Sync with Admin Panel, Dynamic Menu Filtering,
 * Lightbox, Reviews Slider, WhatsApp Ordering, Live Opening Hours & Form Validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. LOCALSTORAGE SYNC & DYNAMIC SETTINGS LOADER
  // =========================================================================
  const STORAGE_KEYS = {
    DISHES: 'shayan_restaurant_dishes',
    CATEGORIES: 'shayan_restaurant_categories',
    SETTINGS: 'shayan_restaurant_settings'
  };

  // Default Fallback Settings
  const DEFAULT_SETTINGS = {
    name: 'Shayan Restaurant',
    tagline: 'Royal Dining & Authentic Culinary Heritage',
    description: 'Indulge in an exquisite feast of mouth-watering Biryanis, sizzling Karahis, slow-smoked BBQ, artisan Pizzas, and gourmet Burgers. Prepared fresh daily with premium ingredients and unmatched culinary passion.',
    whatsapp: '03092273955',
    email: 'shayanlakhani66@gmail.com',
    hours: 'Monday – Sunday: 12:00 PM – 12:00 AM',
    address: 'Shayan Restaurant, Main Commercial Avenue, Food Street District, Pakistan'
  };

  // Load Settings from LocalStorage
  let currentSettings = DEFAULT_SETTINGS;
  try {
    const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (storedSettings) {
      currentSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) };
    }
  } catch (e) {
    currentSettings = DEFAULT_SETTINGS;
  }

  // Format WhatsApp Number for wa.me URL
  function cleanWhatsAppNumber(phone) {
    let clean = (phone || '').replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '92' + clean.slice(1);
    }
    if (!clean.startsWith('92')) {
      clean = '92' + clean;
    }
    return clean;
  }

  const CONFIG = {
    rawWhatsApp: currentSettings.whatsapp || '03092273955',
    whatsappNumber: cleanWhatsAppNumber(currentSettings.whatsapp || '03092273955'),
    restaurantEmail: currentSettings.email || 'shayanlakhani66@gmail.com',
    openHour: 12,
    closeHour: 24,
  };

  // Helper: Format WhatsApp URL
  function createWhatsAppUrl(message) {
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${CONFIG.whatsappNumber}?text=${encoded}`;
  }

  // Helper: Format Price
  function formatPrice(amount) {
    return 'Rs. ' + (amount ? Number(amount).toLocaleString() : '0');
  }

  // Update Dynamic Text and Links from Settings
  function syncSettingsToDOM() {
    // Floating WhatsApp
    const floatingWA = document.getElementById('floatingWhatsApp');
    if (floatingWA) {
      floatingWA.href = createWhatsAppUrl('Hello! I would like to place an order.');
    }

    // Top Bar Phone & Email
    const topBarPhone = document.querySelector('.top-bar-link[href^="tel"]');
    if (topBarPhone) {
      topBarPhone.href = `tel:+${CONFIG.whatsappNumber}`;
      topBarPhone.innerHTML = `<i class="fa-solid fa-phone"></i> ${CONFIG.rawWhatsApp}`;
    }

    const topBarEmail = document.querySelector('.top-bar-link[href^="mailto"]');
    if (topBarEmail) {
      topBarEmail.href = `mailto:${CONFIG.restaurantEmail}`;
      topBarEmail.innerHTML = `<i class="fa-solid fa-envelope"></i> ${CONFIG.restaurantEmail}`;
    }
  }
  syncSettingsToDOM();

  // =========================================================================
  // 2. MENU DATA & CATEGORIES LOADER
  // =========================================================================
  // Default Initial Dishes
  const DEFAULT_DISHES = [
    {
      id: 'pak-1',
      category: 'pakistani',
      name: 'Royal Chicken Dum Biryani',
      description: 'Fragrant basmati rice steamed with saffron, spiced marinated chicken, tender potatoes, and kewra water.',
      price: 650,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      badge: 'Best Seller',
      isSpicy: true,
      isVeg: false
    },
    {
      id: 'pak-2',
      category: 'pakistani',
      name: 'Desi Butter Chicken Karahi',
      description: 'Succulent chicken pieces cooked in a wok with fresh tomatoes, ginger juliennes, green chilies, and pure butter.',
      price: 1450,
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
      badge: "Chef's Choice",
      isSpicy: true,
      isVeg: false
    },
    {
      id: 'pak-3',
      category: 'pakistani',
      name: 'Special Mutton Handi',
      description: 'Boneless tender mutton simmered slowly in a traditional clay handi with rich almond and cream gravy.',
      price: 1850,
      image: 'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=600&q=80',
      badge: 'Royal Feast',
      isSpicy: false,
      isVeg: false
    },
    {
      id: 'pak-4',
      category: 'pakistani',
      name: 'Garlic Butter Roghani Naan Basket',
      description: 'Fluffy tandoori naans infused with crushed garlic, sesame seeds, and golden desi ghee.',
      price: 150,
      image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80',
      badge: 'Fresh',
      isSpicy: false,
      isVeg: true
    },
    {
      id: 'bbq-1',
      category: 'bbq',
      name: 'Grand Royal Mixed BBQ Platter',
      description: 'A lavish combo of Chicken Malai Boti, Spicy Beef Seekh Kababs, Tandoori Tikka Boti, and mint raita with hot naans.',
      price: 2350,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
      badge: 'Royal Feast',
      isSpicy: true,
      isVeg: false
    },
    {
      id: 'bbq-2',
      category: 'bbq',
      name: 'Creamy Chicken Malai Boti',
      description: 'Boneless chicken cubes marinated in green cardamom, fresh cream, yogurt, and mild aromatic spices grilled over coals.',
      price: 850,
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
      badge: "Chef's Choice",
      isSpicy: false,
      isVeg: false
    },
    {
      id: 'bbq-3',
      category: 'bbq',
      name: 'Spicy Beef Seekh Kabab',
      description: 'Charcoal-grilled minced beef skewers blended with crushed onions, fresh coriander, mint, and secret masala.',
      price: 790,
      image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=600&q=80',
      badge: 'Popular',
      isSpicy: true,
      isVeg: false
    },
    {
      id: 'bbq-4',
      category: 'bbq',
      name: 'Whole Tandoori Chargha',
      description: 'Full whole chicken deeply seasoned with Lahori spices, steamed and roasted over intense coal heat.',
      price: 1390,
      image: 'https://images.unsplash.com/photo-1527477378377-160759055819?auto=format&fit=crop&w=600&q=80',
      badge: 'Must Try',
      isSpicy: true,
      isVeg: false
    },
    {
      id: 'bur-1',
      category: 'burgers',
      name: 'Crispy Gourmet Zinger Burger',
      description: 'Crispy hand-breaded chicken breast fillet topped with spicy secret sauce, crunchy iceberg, and cheddar slice.',
      price: 590,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      badge: 'Best Seller',
      isSpicy: true,
      isVeg: false
    },
    {
      id: 'bur-2',
      category: 'burgers',
      name: 'Double Beef Smash Cheeseburger',
      description: 'Two seared 100% prime beef patties, double American cheddar cheese, caramelized onions, pickles, and burger relish.',
      price: 790,
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
      badge: 'Popular',
      isSpicy: false,
      isVeg: false
    },
    {
      id: 'bur-3',
      category: 'burgers',
      name: 'Smoky BBQ Bacon Crunch Burger',
      description: 'Grilled beef patty glazed with hickory BBQ glaze, crispy onions, smoked turkey bacon strip, and melted provolone.',
      price: 850,
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
      badge: 'Crispy',
      isSpicy: false,
      isVeg: false
    },
    {
      id: 'piz-1',
      category: 'pizza',
      name: 'Chicken Supreme Deluxe Pizza',
      description: 'Special house sauce, mozzarella, marinated chicken fajita chunks, black olives, bell peppers, onions, and mushrooms.',
      price: 1550,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
      badge: 'Best Seller',
      isSpicy: false,
      isVeg: false
    },
    {
      id: 'piz-2',
      category: 'pizza',
      name: 'Spicy Chicken Fajita Pizza',
      description: 'Smoky spiced Mexican chicken, jalapeños, onions, diced tomatoes, cilantro, and stretchy mozzarella cheese.',
      price: 1490,
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
      badge: 'Must Try',
      isSpicy: true,
      isVeg: false
    },
    {
      id: 'piz-3',
      category: 'pizza',
      name: 'Classic Pepperoni Melt Pizza',
      description: 'Golden crust layered with authentic Italian pizza sauce, double mozzarella, and generously covered with savory pepperoni.',
      price: 1650,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
      badge: 'Popular',
      isSpicy: false,
      isVeg: false
    },
    {
      id: 'piz-4',
      category: 'pizza',
      name: 'Four Cheese Alfredo Pizza',
      description: 'Rich creamy alfredo base with mozzarella, cheddar, parmesan, and ricotta cheese with fresh basil drizzle.',
      price: 1590,
      image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=600&q=80',
      badge: 'Fresh',
      isSpicy: false,
      isVeg: true
    },
    {
      id: 'ff-1',
      category: 'fastfood',
      name: 'Cheesy Loaded Chicken Fries',
      description: 'Crispy potato fries loaded with fried chicken bits, melted cheddar sauce, spicy ranch, and sliced jalapeños.',
      price: 490,
      image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80',
      badge: 'Popular',
      isSpicy: true,
      isVeg: false
    },
    {
      id: 'ff-2',
      category: 'fastfood',
      name: 'Crispy Golden Chicken Tenders',
      description: 'Golden fried crispy chicken tenders served with honey mustard and garlic mayo dip.',
      price: 450,
      image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
      badge: 'Crispy',
      isSpicy: false,
      isVeg: false
    },
    {
      id: 'ff-3',
      category: 'fastfood',
      name: 'Club Sandwich Deluxe',
      description: 'Triple-decker toasted bread filled with roasted chicken shreds, fried egg, cheese slice, lettuce, and tomatoes.',
      price: 520,
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
      badge: 'Fresh',
      isSpicy: false,
      isVeg: false
    },
    {
      id: 'drk-1',
      category: 'drinks',
      name: 'Fresh Mint & Lemon Margarita',
      description: 'Refreshing blended ice drink with fresh crushed mint leaves, lemon juice, soda, and Himalayan black salt.',
      price: 280,
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
      badge: 'Fresh',
      isSpicy: false,
      isVeg: true
    },
    {
      id: 'drk-2',
      category: 'drinks',
      name: 'Signature Peach Iced Tea',
      description: 'Brewed black tea infused with natural peach syrup, citrus slices, and crushed ice.',
      price: 260,
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
      badge: 'Popular',
      isSpicy: false,
      isVeg: true
    },
    {
      id: 'drk-3',
      category: 'drinks',
      name: 'Royal Mango Lassi Shake',
      description: 'Thick traditional yogurt lassi blended with sweet ripe mangoes and garnished with chopped pistachios.',
      price: 320,
      image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',
      badge: 'Must Try',
      isSpicy: false,
      isVeg: true
    },
    {
      id: 'drk-4',
      category: 'drinks',
      name: 'Cold Mocha Frappuccino',
      description: 'Rich espresso blended with dark chocolate ganache, cold milk, ice, and crowned with whipped cream.',
      price: 380,
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
      badge: "Chef's Choice",
      isSpicy: false,
      isVeg: true
    },
    {
      id: 'des-1',
      category: 'desserts',
      name: 'Sizzling Hot Brownie with Ice Cream',
      description: 'Warm fudge brownie served on a sizzling hot skillet, topped with vanilla ice cream and drizzled with molten chocolate.',
      price: 490,
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
      badge: 'Must Try',
      isSpicy: false,
      isVeg: true
    },
    {
      id: 'des-2',
      category: 'desserts',
      name: 'Traditional Royal Gulab Jamun',
      description: 'Soft warm milk dough dumplings soaked in fragrant cardamom and saffron sugar syrup, garnished with silver vark.',
      price: 250,
      image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
      badge: 'Popular',
      isSpicy: false,
      isVeg: true
    },
    {
      id: 'des-3',
      category: 'desserts',
      name: 'New York Style Velvet Cheesecake',
      description: 'Classic creamy baked cheesecake on a buttery graham cracker crust with strawberry coulis swirl.',
      price: 520,
      image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80',
      badge: "Chef's Choice",
      isSpicy: false,
      isVeg: true
    },
    {
      id: 'des-4',
      category: 'desserts',
      name: 'Royal Pistachio Kulfi Falooda',
      description: 'Rich dense saffron-pistachio kulfi layered with rose syrup, sweet falooda vermicelli, and basil seeds.',
      price: 360,
      image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=600&q=80',
      badge: 'Royal Feast',
      isSpicy: false,
      isVeg: true
    }
  ];

  // Get active dishes from LocalStorage or fall back
  function getActiveDishes() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DISHES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('LocalStorage error, using default dishes:', e);
    }
    return DEFAULT_DISHES;
  }

  // Get active categories from LocalStorage or fall back
  function getActiveCategories() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('LocalStorage error, using default categories:', e);
    }
    return [
      { slug: 'pakistani', name: 'Pakistani', icon: 'fa-bowl-rice' },
      { slug: 'bbq', name: 'BBQ', icon: 'fa-fire' },
      { slug: 'burgers', name: 'Burgers', icon: 'fa-burger' },
      { slug: 'pizza', name: 'Pizza', icon: 'fa-pizza-slice' },
      { slug: 'fastfood', name: 'Fast Food', icon: 'fa-drumstick-bite' },
      { slug: 'drinks', name: 'Drinks', icon: 'fa-martini-glass-citrus' },
      { slug: 'desserts', name: 'Desserts', icon: 'fa-ice-cream' }
    ];
  }

  // =========================================================================
  // 3. LIVE OPENING HOURS CHECKER
  // =========================================================================
  function initLiveHours() {
    const statusTextEl = document.getElementById('statusText');
    const liveBadgeEl = document.getElementById('liveStatusBadge');
    const hoursCardStatusEl = document.getElementById('hoursCardStatus');

    const now = new Date();
    const currentHour = now.getHours();
    
    const isOpen = currentHour >= CONFIG.openHour && currentHour < CONFIG.closeHour;

    if (isOpen) {
      if (statusTextEl) statusTextEl.textContent = 'Open Now (12 PM – 12 AM)';
      if (liveBadgeEl) {
        liveBadgeEl.classList.remove('closed');
        liveBadgeEl.title = 'We are currently accepting dine-in and WhatsApp orders!';
      }
      if (hoursCardStatusEl) {
        hoursCardStatusEl.textContent = '🟢 Open Now';
        hoursCardStatusEl.classList.remove('closed');
      }
    } else {
      if (statusTextEl) statusTextEl.textContent = 'Opens at 12:00 PM';
      if (liveBadgeEl) {
        liveBadgeEl.classList.add('closed');
        liveBadgeEl.title = 'Closed right now. Opens today at 12:00 PM.';
      }
      if (hoursCardStatusEl) {
        hoursCardStatusEl.textContent = '🔴 Closed (Opens 12 PM)';
        hoursCardStatusEl.classList.add('closed');
      }
    }
  }
  initLiveHours();

  // =========================================================================
  // 4. STICKY NAVBAR & ACTIVE SCROLL SPY
  // =========================================================================
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  function handleScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }

    let currentSection = 'hero';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================================================
  // 5. MOBILE DRAWER NAVIGATION
  // =========================================================================
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    mobileDrawer.classList.add('open');
    drawerBackdrop.classList.add('active');
    mobileMenuToggle.classList.add('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('active');
    mobileMenuToggle.classList.remove('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      if (mobileDrawer.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeMobileMenu);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // =========================================================================
  // 6. DYNAMIC CATEGORY BUTTONS GENERATOR & MENU FILTERING
  // =========================================================================
  const menuGrid = document.getElementById('menuGrid');
  const menuCategories = document.getElementById('menuCategories');
  const menuSearchInput = document.getElementById('menuSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const menuItemCount = document.getElementById('menuItemCount');
  const noResults = document.getElementById('noResults');
  const resetFilterBtn = document.getElementById('resetFilterBtn');

  let activeCategory = 'all';
  let searchQuery = '';
  let activeDishes = getActiveDishes();

  // Generate Category Filter Buttons Dynamically
  function buildCategoryTabs() {
    if (!menuCategories) return;
    const categories = getActiveCategories();
    menuCategories.innerHTML = '';

    // 'All Dishes' Tab
    const allBtn = document.createElement('button');
    allBtn.className = `menu-cat-btn ${activeCategory === 'all' ? 'active' : ''}`;
    allBtn.setAttribute('data-category', 'all');
    allBtn.setAttribute('role', 'tab');
    allBtn.innerHTML = '<i class="fa-solid fa-utensils"></i> All Dishes';
    allBtn.addEventListener('click', () => selectCategory('all', allBtn));
    menuCategories.appendChild(allBtn);

    // Dynamic Category Tabs
    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `menu-cat-btn ${activeCategory === cat.slug ? 'active' : ''}`;
      btn.setAttribute('data-category', cat.slug);
      btn.setAttribute('role', 'tab');
      btn.innerHTML = `<i class="fa-solid ${cat.icon || 'fa-utensils'}"></i> ${cat.name}`;
      btn.addEventListener('click', () => selectCategory(cat.slug, btn));
      menuCategories.appendChild(btn);
    });
  }

  function selectCategory(categorySlug, btnEl) {
    activeCategory = categorySlug;
    const catButtons = menuCategories.querySelectorAll('.menu-cat-btn');
    catButtons.forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');
    filterMenu();
  }

  function renderMenuItems(items) {
    if (!menuGrid) return;
    menuGrid.innerHTML = '';

    if (items.length === 0) {
      if (noResults) noResults.style.display = 'block';
      if (menuItemCount) menuItemCount.textContent = 'No matching dishes';
      return;
    }

    if (noResults) noResults.style.display = 'none';
    if (menuItemCount) {
      menuItemCount.textContent = `Showing ${items.length} ${items.length === 1 ? 'dish' : 'dishes'}`;
    }

    items.forEach(dish => {
      const card = document.createElement('div');
      card.className = 'menu-item-card';

      const whatsappMsg = `Hello! I would like to order ${dish.name} (${formatPrice(dish.price)}) from Shayan Restaurant.`;
      const orderLink = createWhatsAppUrl(whatsappMsg);

      card.innerHTML = `
        <div class="menu-item-img-wrap">
          <img src="${dish.image}" alt="${dish.name}" loading="lazy" />
          ${dish.badge ? `<span class="menu-item-badge">${dish.badge}</span>` : ''}
        </div>
        <div class="menu-item-content">
          <div class="menu-item-top">
            <h3 class="menu-item-name">${dish.name}</h3>
            <span class="menu-item-price">${formatPrice(dish.price)}</span>
          </div>
          <p class="menu-item-desc">${dish.description}</p>
          <div class="menu-item-footer">
            <span class="menu-item-tag">
              ${dish.isSpicy ? '<i class="fa-solid fa-pepper-hot" style="color:#dc2626;"></i>' : ''}
              ${dish.isVeg ? '<i class="fa-solid fa-leaf" style="color:#10b981;"></i>' : ''}
              ${dish.category || 'Specialty'}
            </span>
            <a href="${orderLink}" target="_blank" rel="noopener noreferrer" class="btn btn-order" aria-label="Order ${dish.name} on WhatsApp">
              <i class="fa-brands fa-whatsapp"></i> Order
            </a>
          </div>
        </div>
      `;

      menuGrid.appendChild(card);
    });
  }

  function filterMenu() {
    activeDishes = getActiveDishes();
    const query = searchQuery.trim().toLowerCase();
    
    const filtered = activeDishes.filter(item => {
      const matchCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchSearch = query === '' || 
        item.name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query);
      return matchCategory && matchSearch;
    });

    renderMenuItems(filtered);
  }

  // Search Input Handler
  if (menuSearchInput) {
    menuSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (clearSearchBtn) {
        clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
      }
      filterMenu();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (menuSearchInput) menuSearchInput.value = '';
      searchQuery = '';
      clearSearchBtn.style.display = 'none';
      filterMenu();
      if (menuSearchInput) menuSearchInput.focus();
    });
  }

  if (resetFilterBtn) {
    resetFilterBtn.addEventListener('click', () => {
      if (menuSearchInput) menuSearchInput.value = '';
      searchQuery = '';
      if (clearSearchBtn) clearSearchBtn.style.display = 'none';
      
      activeCategory = 'all';
      buildCategoryTabs();
      filterMenu();
    });
  }

  // Build tabs and render items
  buildCategoryTabs();
  filterMenu();

  // =========================================================================
  // 7. GALLERY LIGHTBOX MODAL
  // =========================================================================
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryLightbox = document.getElementById('galleryLightbox');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCat = document.getElementById('lightboxCat');
  const lightboxOrderBtn = document.getElementById('lightboxOrderBtn');

  let currentGalleryIndex = 0;

  function updateLightboxContent(index) {
    if (index < 0) index = galleryItems.length - 1;
    if (index >= galleryItems.length) index = 0;
    currentGalleryIndex = index;

    const targetItem = galleryItems[currentGalleryIndex];
    if (!targetItem) return;

    const imgSrc = targetItem.getAttribute('data-img') || targetItem.querySelector('img').src;
    const title = targetItem.getAttribute('data-title') || 'Delicious Food';
    const cat = targetItem.getAttribute('data-category') || 'Shayan Restaurant';

    if (lightboxImg) {
      lightboxImg.src = imgSrc;
      lightboxImg.alt = title;
    }
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxCat) lightboxCat.textContent = cat;

    if (lightboxOrderBtn) {
      const orderMsg = `Hello! I would like to inquire/order ${title} from Shayan Restaurant.`;
      lightboxOrderBtn.href = createWhatsAppUrl(orderMsg);
    }
  }

  function openLightbox(index) {
    updateLightboxContent(index);
    galleryLightbox.classList.add('active');
    galleryLightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    galleryLightbox.classList.remove('active');
    galleryLightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      openLightbox(idx);
    });
  });

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);

  if (lightboxPrevBtn) {
    lightboxPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateLightboxContent(currentGalleryIndex - 1);
    });
  }

  if (lightboxNextBtn) {
    lightboxNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateLightboxContent(currentGalleryIndex + 1);
    });
  }

  // Keyboard navigation for Lightbox
  document.addEventListener('keydown', (e) => {
    if (!galleryLightbox || !galleryLightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') updateLightboxContent(currentGalleryIndex - 1);
    if (e.key === 'ArrowRight') updateLightboxContent(currentGalleryIndex + 1);
  });

  // =========================================================================
  // 8. CUSTOMER REVIEWS / TESTIMONIALS SLIDER
  // =========================================================================
  const reviewsTrack = document.getElementById('reviewsTrack');
  const reviewSlides = document.querySelectorAll('.review-slide');
  const reviewPrevBtn = document.getElementById('reviewPrevBtn');
  const reviewNextBtn = document.getElementById('reviewNextBtn');
  const reviewDotsContainer = document.getElementById('reviewDots');

  let currentReviewIndex = 0;
  let reviewAutoPlayTimer = null;

  if (reviewSlides.length > 0 && reviewsTrack) {
    reviewDotsContainer.innerHTML = '';
    reviewSlides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to review slide ${i + 1}`);
      dot.addEventListener('click', () => goToReviewSlide(i));
      reviewDotsContainer.appendChild(dot);
    });

    const dots = reviewDotsContainer.querySelectorAll('.slider-dot');

    function goToReviewSlide(index) {
      if (index < 0) index = reviewSlides.length - 1;
      if (index >= reviewSlides.length) index = 0;
      currentReviewIndex = index;

      reviewsTrack.style.transform = `translateX(-${currentReviewIndex * 100}%)`;

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentReviewIndex);
      });
    }

    function startReviewAutoPlay() {
      reviewAutoPlayTimer = setInterval(() => {
        goToReviewSlide(currentReviewIndex + 1);
      }, 5000);
    }

    function stopReviewAutoPlay() {
      if (reviewAutoPlayTimer) clearInterval(reviewAutoPlayTimer);
    }

    if (reviewPrevBtn) {
      reviewPrevBtn.addEventListener('click', () => {
        stopReviewAutoPlay();
        goToReviewSlide(currentReviewIndex - 1);
        startReviewAutoPlay();
      });
    }

    if (reviewNextBtn) {
      reviewNextBtn.addEventListener('click', () => {
        stopReviewAutoPlay();
        goToReviewSlide(currentReviewIndex + 1);
        startReviewAutoPlay();
      });
    }

    const reviewsWrapper = document.querySelector('.reviews-slider-wrapper');
    if (reviewsWrapper) {
      reviewsWrapper.addEventListener('mouseenter', stopReviewAutoPlay);
      reviewsWrapper.addEventListener('mouseleave', startReviewAutoPlay);
    }

    // Touch Swipe Support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    reviewsTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopReviewAutoPlay();
    }, { passive: true });

    reviewsTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        goToReviewSlide(currentReviewIndex + 1);
      } else if (touchEndX - touchStartX > 50) {
        goToReviewSlide(currentReviewIndex - 1);
      }
      startReviewAutoPlay();
    }, { passive: true });

    startReviewAutoPlay();
  }

  // =========================================================================
  // 9. CONTACT FORM VALIDATION & TOAST NOTIFICATION
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  const userNameInput = document.getElementById('userName');
  const userEmailInput = document.getElementById('userEmail');
  const userPhoneInput = document.getElementById('userPhone');
  const inquiryTypeInput = document.getElementById('inquiryType');
  const userMessageInput = document.getElementById('userMessage');
  const formAlert = document.getElementById('formAlert');
  const sendViaWhatsAppBtn = document.getElementById('sendViaWhatsAppBtn');
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  const toastIcon = document.getElementById('toastIcon');

  function showToast(msg, isSuccess = true) {
    if (!toastNotification) return;
    if (toastMessage) toastMessage.textContent = msg;
    if (toastIcon) {
      toastIcon.innerHTML = isSuccess 
        ? '<i class="fa-solid fa-check"></i>' 
        : '<i class="fa-solid fa-triangle-exclamation"></i>';
      toastIcon.style.color = isSuccess ? 'var(--color-whatsapp)' : '#ef4444';
      toastIcon.style.background = isSuccess ? 'rgba(37, 211, 102, 0.2)' : 'rgba(239, 68, 68, 0.2)';
    }

    toastNotification.classList.add('show');
    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 4500);
  }

  function setFieldError(input, errorElId, message) {
    const group = input.closest('.form-group');
    const errorEl = document.getElementById(errorElId);
    if (group) group.classList.add('has-error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  }

  function clearFieldError(input, errorElId) {
    const group = input.closest('.form-group');
    const errorEl = document.getElementById(errorElId);
    if (group) group.classList.remove('has-error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
  }

  if (userNameInput) userNameInput.addEventListener('input', () => clearFieldError(userNameInput, 'nameError'));
  if (userEmailInput) userEmailInput.addEventListener('input', () => clearFieldError(userEmailInput, 'emailError'));
  if (userPhoneInput) userPhoneInput.addEventListener('input', () => clearFieldError(userPhoneInput, 'phoneError'));
  if (userMessageInput) userMessageInput.addEventListener('input', () => clearFieldError(userMessageInput, 'messageError'));

  function validateContactForm() {
    let isValid = true;

    const nameVal = userNameInput.value.trim();
    if (!nameVal || nameVal.length < 2) {
      setFieldError(userNameInput, 'nameError', 'Please enter your full name (minimum 2 characters).');
      isValid = false;
    } else {
      clearFieldError(userNameInput, 'nameError');
    }

    const emailVal = userEmailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRegex.test(emailVal)) {
      setFieldError(userEmailInput, 'emailError', 'Please provide a valid email address.');
      isValid = false;
    } else {
      clearFieldError(userEmailInput, 'emailError');
    }

    const phoneVal = userPhoneInput.value.trim();
    const phoneRegex = /^[0-9+()-\s]{7,16}$/;
    if (!phoneVal || !phoneRegex.test(phoneVal)) {
      setFieldError(userPhoneInput, 'phoneError', 'Please enter a valid contact phone number.');
      isValid = false;
    } else {
      clearFieldError(userPhoneInput, 'phoneError');
    }

    const msgVal = userMessageInput.value.trim();
    if (!msgVal || msgVal.length < 5) {
      setFieldError(userMessageInput, 'messageError', 'Please enter a detailed message or order info (min 5 characters).');
      isValid = false;
    } else {
      clearFieldError(userMessageInput, 'messageError');
    }

    return isValid;
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateContactForm()) {
        if (formAlert) {
          formAlert.className = 'form-alert error';
          formAlert.textContent = 'Please fill out all required fields correctly.';
          formAlert.style.display = 'block';
        }
        return;
      }

      const name = userNameInput.value.trim();
      const inquiry = inquiryTypeInput.value;

      if (formAlert) {
        formAlert.className = 'form-alert success';
        formAlert.innerHTML = `<strong>Thank you, ${name}!</strong> Your ${inquiry} message has been received. Our team will contact you shortly.`;
        formAlert.style.display = 'block';
      }

      showToast(`Thank you ${name}! Your inquiry has been sent successfully.`);
      contactForm.reset();

      setTimeout(() => {
        if (formAlert) formAlert.style.display = 'none';
      }, 7000);
    });
  }

  if (sendViaWhatsAppBtn) {
    sendViaWhatsAppBtn.addEventListener('click', () => {
      const name = userNameInput.value.trim() || 'Valued Guest';
      const phone = userPhoneInput.value.trim() || 'N/A';
      const inquiry = inquiryTypeInput.value;
      const msg = userMessageInput.value.trim() || 'Hello! I would like to inquire about Shayan Restaurant services.';

      const formattedText = `*New Inquiry from Shayan Restaurant Website*\n\n` +
        `👤 *Name:* ${name}\n` +
        `📞 *Phone:* ${phone}\n` +
        `📌 *Inquiry Type:* ${inquiry}\n` +
        `💬 *Message:* ${msg}`;

      const waUrl = createWhatsAppUrl(formattedText);
      window.open(waUrl, '_blank');
      showToast('Opening WhatsApp with your filled inquiry details...');
    });
  }

  // =========================================================================
  // 10. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  // =========================================================================
  const revealElements = document.querySelectorAll('.reveal-fade, .reveal-left, .reveal-right, .reveal-card');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }
});
