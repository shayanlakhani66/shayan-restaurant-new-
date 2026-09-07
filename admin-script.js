/**
 * SHAYAN RESTAURANT - ADMIN DASHBOARD CONTROLLER
 * Full CRUD for Menu Items, Category Management, Settings & LocalStorage Synchronization.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. DATA STORE & INITIAL SEEDING
  // =========================================================================
  const STORAGE_KEYS = {
    DISHES: 'shayan_restaurant_dishes',
    CATEGORIES: 'shayan_restaurant_categories',
    SETTINGS: 'shayan_restaurant_settings'
  };

  // Initial Seed Categories
  const DEFAULT_CATEGORIES = [
    { slug: 'pakistani', name: 'Pakistani', icon: 'fa-bowl-rice' },
    { slug: 'bbq', name: 'BBQ', icon: 'fa-fire' },
    { slug: 'burgers', name: 'Burgers', icon: 'fa-burger' },
    { slug: 'pizza', name: 'Pizza', icon: 'fa-pizza-slice' },
    { slug: 'fastfood', name: 'Fast Food', icon: 'fa-drumstick-bite' },
    { slug: 'drinks', name: 'Drinks', icon: 'fa-martini-glass-citrus' },
    { slug: 'desserts', name: 'Desserts', icon: 'fa-ice-cream' }
  ];

  // Initial Seed Settings
  const DEFAULT_SETTINGS = {
    name: 'Shayan Restaurant',
    tagline: 'Royal Dining & Authentic Culinary Heritage',
    description: 'Where centuries of traditional culinary recipes meet contemporary gastronomic perfection. 100% fresh Halal ingredients and royal hospitality.',
    whatsapp: '03092273955',
    email: 'shayanlakhani66@gmail.com',
    hours: 'Monday – Sunday: 12:00 PM – 12:00 AM',
    address: 'Shayan Restaurant, Main Commercial Avenue, Food Street District, Pakistan'
  };

  // Initial Seed Dishes (26 Items)
  const DEFAULT_DISHES = [
    {
      id: 'dish-1',
      name: 'Royal Chicken Dum Biryani',
      category: 'pakistani',
      price: 650,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      description: 'Fragrant basmati rice steamed with saffron, spiced marinated chicken, tender potatoes, and kewra water.',
      badge: 'Best Seller',
      isSpicy: true,
      isVeg: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dish-2',
      name: 'Desi Butter Chicken Karahi',
      category: 'pakistani',
      price: 1450,
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
      description: 'Succulent chicken pieces cooked in a wok with fresh tomatoes, ginger juliennes, green chilies, and pure butter.',
      badge: "Chef's Choice",
      isSpicy: true,
      isVeg: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dish-3',
      name: 'Special Mutton Handi',
      category: 'pakistani',
      price: 1850,
      image: 'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=600&q=80',
      description: 'Boneless tender mutton simmered slowly in a traditional clay handi with rich almond and cream gravy.',
      badge: 'Royal Feast',
      isSpicy: false,
      isVeg: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dish-4',
      name: 'Garlic Butter Roghani Naan Basket',
      category: 'pakistani',
      price: 150,
      image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80',
      description: 'Fluffy tandoori naans infused with crushed garlic, sesame seeds, and golden desi ghee.',
      badge: 'Fresh',
      isSpicy: false,
      isVeg: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dish-5',
      name: 'Grand Royal Mixed BBQ Platter',
      category: 'bbq',
      price: 2350,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
      description: 'A lavish combo of Chicken Malai Boti, Spicy Beef Seekh Kababs, Tandoori Tikka Boti, and mint raita with hot naans.',
      badge: 'Royal Feast',
      isSpicy: true,
      isVeg: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dish-6',
      name: 'Creamy Chicken Malai Boti',
      category: 'bbq',
      price: 850,
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
      description: 'Boneless chicken cubes marinated in green cardamom, fresh cream, yogurt, and mild aromatic spices grilled over coals.',
      badge: "Chef's Choice",
      isSpicy: false,
      isVeg: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dish-7',
      name: 'Spicy Beef Seekh Kabab',
      category: 'bbq',
      price: 790,
      image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=600&q=80',
      description: 'Charcoal-grilled minced beef skewers blended with crushed onions, fresh coriander, mint, and secret masala.',
      badge: 'Popular',
      isSpicy: true,
      isVeg: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dish-8',
      name: 'Whole Tandoori Chargha',
      category: 'bbq',
      price: 1390,
      image: 'https://images.unsplash.com/photo-1527477378377-160759055819?auto=format&fit=crop&w=600&q=80',
      badge: 'Must Try',
      isSpicy: true,
      isVeg: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dish-9',
      name: 'Crispy Gourmet Zinger Burger',
      category: 'burgers',
      price: 590,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      description: 'Crispy hand-breaded chicken breast fillet topped with spicy secret sauce, crunchy iceberg, and cheddar slice.',
      badge: 'Best Seller',
      isSpicy: true,
      isVeg: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dish-10',
      name: 'Double Beef Smash Cheeseburger',
      category: 'burgers',
      price: 790,
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
      description: 'Two seared 100% prime beef patties, double American cheddar cheese, caramelized onions, pickles, and burger relish.',
      badge: 'Popular',
      isSpicy: false,
      isVeg: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dish-11',
      name: 'Smoky BBQ Bacon Crunch Burger',
      category: 'burgers',
      price: 850,
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
      description: 'Grilled beef patty glazed with hickory BBQ glaze, crispy onions, smoked turkey bacon strip, and melted provolone.',
      badge: 'Crispy',
      isSpicy: false,
      isVeg: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dish-12',
      name: 'Chicken Supreme Deluxe Pizza',
      category: 'pizza',
      price: 1550,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
      description: 'Special house sauce, mozzarella, marinated chicken fajita chunks, black olives, bell peppers, onions, and mushrooms.',
      badge: 'Best Seller',
      isSpicy: false,
      isVeg: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dish-13',
      name: 'Spicy Chicken Fajita Pizza',
      category: 'pizza',
      price: 1490,
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
      description: 'Smoky spiced Mexican chicken, jalapeños, onions, diced tomatoes, cilantro, and stretchy mozzarella cheese.',
      badge: 'Must Try',
      isSpicy: true,
      isVeg: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dish-14',
      name: 'Classic Pepperoni Melt Pizza',
      category: 'pizza',
      price: 1650,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
      description: 'Golden crust layered with authentic Italian pizza sauce, double mozzarella, and generously covered with savory pepperoni.',
      badge: 'Popular',
      isSpicy: false,
      isVeg: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dish-15',
      name: 'Four Cheese Alfredo Pizza',
      category: 'pizza',
      price: 1590,
      image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=600&q=80',
      description: 'Rich creamy alfredo base with mozzarella, cheddar, parmesan, and ricotta cheese with fresh basil drizzle.',
      badge: 'Fresh',
      isSpicy: false,
      isVeg: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dish-16',
      name: 'Cheesy Loaded Chicken Fries',
      category: 'fastfood',
      price: 490,
      image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80',
      description: 'Crispy potato fries loaded with fried chicken bits, melted cheddar sauce, spicy ranch, and sliced jalapeños.',
      badge: 'Popular',
      isSpicy: true,
      isVeg: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dish-17',
      name: 'Crispy Golden Chicken Tenders',
      category: 'fastfood',
      price: 450,
      image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
      description: 'Golden fried crispy chicken tenders served with honey mustard and garlic mayo dip.',
      badge: 'Crispy',
      isSpicy: false,
      isVeg: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dish-18',
      name: 'Club Sandwich Deluxe',
      category: 'fastfood',
      price: 520,
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
      description: 'Triple-decker toasted bread filled with roasted chicken shreds, fried egg, cheese slice, lettuce, and tomatoes.',
      badge: 'Fresh',
      isSpicy: false,
      isVeg: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dish-19',
      name: 'Fresh Mint & Lemon Margarita',
      category: 'drinks',
      price: 280,
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
      description: 'Refreshing blended ice drink with fresh crushed mint leaves, lemon juice, soda, and Himalayan black salt.',
      badge: 'Fresh',
      isSpicy: false,
      isVeg: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dish-20',
      name: 'Signature Peach Iced Tea',
      category: 'drinks',
      price: 260,
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
      description: 'Brewed black tea infused with natural peach syrup, citrus slices, and crushed ice.',
      badge: 'Popular',
      isSpicy: false,
      isVeg: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dish-21',
      name: 'Royal Mango Lassi Shake',
      category: 'drinks',
      price: 320,
      image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',
      description: 'Thick traditional yogurt lassi blended with sweet ripe mangoes and garnished with chopped pistachios.',
      badge: 'Must Try',
      isSpicy: false,
      isVeg: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dish-22',
      name: 'Cold Mocha Frappuccino',
      category: 'drinks',
      price: 380,
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
      description: 'Rich espresso blended with dark chocolate ganache, cold milk, ice, and crowned with whipped cream.',
      badge: "Chef's Choice",
      isSpicy: false,
      isVeg: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dish-23',
      name: 'Sizzling Hot Brownie with Ice Cream',
      category: 'desserts',
      price: 490,
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
      description: 'Warm fudge brownie served on a sizzling hot skillet, topped with vanilla ice cream and drizzled with molten chocolate.',
      badge: 'Must Try',
      isSpicy: false,
      isVeg: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dish-24',
      name: 'Traditional Royal Gulab Jamun',
      category: 'desserts',
      price: 250,
      image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
      description: 'Soft warm milk dough dumplings soaked in fragrant cardamom and saffron sugar syrup, garnished with silver vark.',
      badge: 'Popular',
      isSpicy: false,
      isVeg: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dish-25',
      name: 'New York Style Velvet Cheesecake',
      category: 'desserts',
      price: 520,
      image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80',
      description: 'Classic creamy baked cheesecake on a buttery graham cracker crust with strawberry coulis swirl.',
      badge: "Chef's Choice",
      isSpicy: false,
      isVeg: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dish-26',
      name: 'Royal Pistachio Kulfi Falooda',
      category: 'desserts',
      price: 360,
      image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=600&q=80',
      badge: 'Royal Feast',
      isSpicy: false,
      isVeg: true,
      createdAt: new Date().toISOString()
    }
  ];

  // Initialize LocalStorage Data if not present
  function initLocalStorageData() {
    if (!localStorage.getItem(STORAGE_KEYS.DISHES)) {
      localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(DEFAULT_DISHES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
  }
  initLocalStorageData();

  // Data Access Helpers
  function getDishes() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.DISHES)) || [];
    } catch {
      return DEFAULT_DISHES;
    }
  }

  function saveDishes(dishes) {
    localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(dishes));
  }

  function getCategories() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES)) || [];
    } catch {
      return DEFAULT_CATEGORIES;
    }
  }

  function saveCategories(categories) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }

  function getSettings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  // =========================================================================
  // 2. TOAST NOTIFICATIONS
  // =========================================================================
  const adminToast = document.getElementById('adminToast');
  const adminToastText = document.getElementById('adminToastText');
  const adminToastIcon = document.getElementById('adminToastIcon');

  function showToast(message, isSuccess = true) {
    if (!adminToast) return;
    adminToastText.textContent = message;
    adminToastIcon.innerHTML = isSuccess ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-triangle-exclamation"></i>';
    adminToast.classList.add('show');

    setTimeout(() => {
      adminToast.classList.remove('show');
    }, 4000);
  }

  // =========================================================================
  // 3. NAVIGATION & VIEW SWITCHING
  // =========================================================================
  const navTabBtns = document.querySelectorAll('.nav-tab-btn[data-target]');
  const adminViews = document.querySelectorAll('.admin-view');
  const pageTitle = document.getElementById('pageTitle');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const adminSidebar = document.getElementById('adminSidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const logoutBtn = document.getElementById('logoutBtn');

  const viewTitles = {
    dashboardView: 'Admin Dashboard',
    menuMgmtView: 'Menu Items Management',
    categoriesView: 'Category Management',
    settingsView: 'Restaurant Settings'
  };

  function switchView(targetViewId) {
    adminViews.forEach(view => {
      view.classList.remove('active');
      if (view.id === targetViewId) {
        view.classList.add('active');
      }
    });

    navTabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-target') === targetViewId);
    });

    if (pageTitle && viewTitles[targetViewId]) {
      pageTitle.textContent = viewTitles[targetViewId];
    }

    // Refresh view specific data
    if (targetViewId === 'dashboardView') renderDashboard();
    if (targetViewId === 'menuMgmtView') renderDishesTable();
    if (targetViewId === 'categoriesView') renderCategoriesGrid();
    if (targetViewId === 'settingsView') populateSettingsForm();

    closeMobileSidebar();
  }

  navTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      if (target) switchView(target);
    });
  });

  // Mobile Sidebar Toggle
  function openMobileSidebar() {
    adminSidebar.classList.add('open');
    sidebarBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileSidebar() {
    adminSidebar.classList.remove('open');
    sidebarBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (sidebarToggleBtn) sidebarToggleBtn.addEventListener('click', openMobileSidebar);
  if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeMobileSidebar);
  if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeMobileSidebar);

  // Logout Handler
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('shayan_admin_auth');
      sessionStorage.removeItem('shayan_admin_user');
      localStorage.removeItem('shayan_admin_auth');
      localStorage.removeItem('shayan_admin_user');
      window.location.href = 'admin-login.html';
    });
  }

  // Topbar Clock
  function updateLiveClock() {
    const clockEl = document.getElementById('liveTimeStr');
    if (!clockEl) return;
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  setInterval(updateLiveClock, 1000);
  updateLiveClock();

  // Quick Action buttons on Dashboard
  document.getElementById('dashAddDishBtn')?.addEventListener('click', () => openDishModal());
  document.getElementById('dashAddCategoryBtn')?.addEventListener('click', () => openCategoryModal());
  document.getElementById('dashGoSettingsBtn')?.addEventListener('click', () => switchView('settingsView'));
  document.getElementById('viewAllDishesLink')?.addEventListener('click', () => switchView('menuMgmtView'));
  document.getElementById('quickAddDishBtn')?.addEventListener('click', () => openDishModal());
  document.getElementById('openAddDishModalBtn')?.addEventListener('click', () => openDishModal());
  document.getElementById('openAddCategoryModalBtn')?.addEventListener('click', () => openCategoryModal());
  document.getElementById('emptyAddDishBtn')?.addEventListener('click', () => openDishModal());

  // Restore Defaults Button
  document.getElementById('resetDefaultDataBtn')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to restore default demo menu items and categories? Any added custom dishes will be reset.')) {
      localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(DEFAULT_DISHES));
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      showToast('All menu data and settings restored to default!');
      renderDashboard();
      renderDishesTable();
      renderCategoriesGrid();
      populateSettingsForm();
    }
  });

  // =========================================================================
  // 4. DASHBOARD VIEW CONTROLLER
  // =========================================================================
  function renderDashboard() {
    const dishes = getDishes();
    const categories = getCategories();
    const settings = getSettings();

    // Update KPIs
    document.getElementById('kpiTotalDishes').textContent = dishes.length;
    document.getElementById('kpiTotalCategories').textContent = categories.length;
    document.getElementById('kpiWhatsAppNum').textContent = settings.whatsapp || '03092273955';
    
    // Sidebar counts
    document.getElementById('sidebarDishCount').textContent = dishes.length;
    document.getElementById('sidebarCategoryCount').textContent = categories.length;

    // Top Dish
    const bestSeller = dishes.find(d => d.badge === 'Best Seller') || dishes[0];
    document.getElementById('kpiTopDish').textContent = bestSeller ? bestSeller.name : 'N/A';

    // Render Recent Dishes Table (Top 5)
    const recentTbody = document.getElementById('recentDishesTbody');
    if (!recentTbody) return;
    recentTbody.innerHTML = '';

    const recentDishes = [...dishes].slice(0, 5);
    recentDishes.forEach(dish => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div style="display:flex; align-items:center; gap:12px;">
            <img src="${dish.image}" alt="${dish.name}" class="dish-table-thumb" />
            <div>
              <span class="dish-cell-name">${dish.name}</span>
              <span class="dish-cell-desc">${dish.description}</span>
            </div>
          </div>
        </td>
        <td><span class="category-tag-pill">${dish.category}</span></td>
        <td><span class="price-text-bold">Rs. ${dish.price.toLocaleString()}</span></td>
        <td>${dish.badge ? `<span class="dish-badge-pill">${dish.badge}</span>` : '<span style="color:#94a3b8;">—</span>'}</td>
        <td>
          <div class="table-actions">
            <button class="action-btn edit" data-id="${dish.id}" title="Edit Dish"><i class="fa-solid fa-pen"></i></button>
            <button class="action-btn delete" data-id="${dish.id}" title="Delete Dish"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      `;

      tr.querySelector('.action-btn.edit').addEventListener('click', () => openDishModal(dish.id));
      tr.querySelector('.action-btn.delete').addEventListener('click', () => confirmDeleteDish(dish.id, dish.name));
      recentTbody.appendChild(tr);
    });
  }

  // =========================================================================
  // 5. MENU ITEMS TABLE & FILTERING
  // =========================================================================
  const adminDishesTbody = document.getElementById('adminDishesTbody');
  const adminDishSearch = document.getElementById('adminDishSearch');
  const clearAdminSearch = document.getElementById('clearAdminSearch');
  const adminCategoryFilter = document.getElementById('adminCategoryFilter');
  const adminSortSelect = document.getElementById('adminSortSelect');
  const adminDishCountLabel = document.getElementById('adminDishCountLabel');
  const dishesEmptyState = document.getElementById('dishesEmptyState');

  function populateCategoryDropdowns() {
    const categories = getCategories();
    
    // Category Filter in toolbar
    if (adminCategoryFilter) {
      const currentVal = adminCategoryFilter.value;
      adminCategoryFilter.innerHTML = '<option value="all">All Categories</option>';
      categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.slug;
        opt.textContent = cat.name;
        adminCategoryFilter.appendChild(opt);
      });
      adminCategoryFilter.value = currentVal || 'all';
    }

    // Category Select inside Add/Edit Dish Modal
    const modalCatSelect = document.getElementById('dishCategoryInput');
    if (modalCatSelect) {
      modalCatSelect.innerHTML = '';
      categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.slug;
        opt.textContent = cat.name;
        modalCatSelect.appendChild(opt);
      });
    }
  }

  function renderDishesTable() {
    populateCategoryDropdowns();
    const dishes = getDishes();
    const query = (adminDishSearch?.value || '').trim().toLowerCase();
    const catFilter = adminCategoryFilter?.value || 'all';
    const sortVal = adminSortSelect?.value || 'newest';

    // Filter
    let filtered = dishes.filter(dish => {
      const matchCat = catFilter === 'all' || dish.category === catFilter;
      const matchQuery = query === '' || 
        dish.name.toLowerCase().includes(query) || 
        dish.description.toLowerCase().includes(query) ||
        dish.category.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });

    // Sort
    if (sortVal === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sortVal === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sortVal === 'name-asc') filtered.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortVal === 'newest') filtered.reverse();

    if (adminDishCountLabel) {
      adminDishCountLabel.textContent = `Showing ${filtered.length} of ${dishes.length} dishes`;
    }

    if (!adminDishesTbody) return;
    adminDishesTbody.innerHTML = '';

    if (filtered.length === 0) {
      if (dishesEmptyState) dishesEmptyState.style.display = 'block';
      return;
    } else {
      if (dishesEmptyState) dishesEmptyState.style.display = 'none';
    }

    filtered.forEach(dish => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <img src="${dish.image}" alt="${dish.name}" class="dish-table-thumb" />
        </td>
        <td>
          <span class="dish-cell-name">${dish.name}</span>
          <span class="dish-cell-desc">${dish.description}</span>
        </td>
        <td><span class="category-tag-pill">${dish.category}</span></td>
        <td><span class="price-text-bold">Rs. ${dish.price.toLocaleString()}</span></td>
        <td>
          <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
            ${dish.badge ? `<span class="dish-badge-pill">${dish.badge}</span>` : ''}
            ${dish.isSpicy ? '<i class="fa-solid fa-pepper-hot" style="color:#dc2626;" title="Spicy"></i>' : ''}
            ${dish.isVeg ? '<i class="fa-solid fa-leaf" style="color:#10b981;" title="Vegetarian"></i>' : ''}
          </div>
        </td>
        <td>
          <div class="table-actions">
            <button class="action-btn edit" data-id="${dish.id}" title="Edit Dish"><i class="fa-solid fa-pen"></i></button>
            <button class="action-btn delete" data-id="${dish.id}" title="Delete Dish"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      `;

      tr.querySelector('.action-btn.edit').addEventListener('click', () => openDishModal(dish.id));
      tr.querySelector('.action-btn.delete').addEventListener('click', () => confirmDeleteDish(dish.id, dish.name));
      adminDishesTbody.appendChild(tr);
    });
  }

  // Filter Listeners
  adminDishSearch?.addEventListener('input', (e) => {
    if (clearAdminSearch) clearAdminSearch.style.display = e.target.value ? 'block' : 'none';
    renderDishesTable();
  });

  clearAdminSearch?.addEventListener('click', () => {
    if (adminDishSearch) adminDishSearch.value = '';
    clearAdminSearch.style.display = 'none';
    renderDishesTable();
  });

  adminCategoryFilter?.addEventListener('change', renderDishesTable);
  adminSortSelect?.addEventListener('change', renderDishesTable);

  // =========================================================================
  // 6. ADD / EDIT DISH MODAL & FILE UPLOADS
  // =========================================================================
  const dishModal = document.getElementById('dishModal');
  const dishModalOverlay = document.getElementById('dishModalOverlay');
  const closeDishModalBtn = document.getElementById('closeDishModalBtn');
  const cancelDishBtn = document.getElementById('cancelDishBtn');
  const dishForm = document.getElementById('dishForm');
  const dishModalTitle = document.getElementById('dishModalTitle');

  const dishEditId = document.getElementById('dishEditId');
  const dishNameInput = document.getElementById('dishNameInput');
  const dishCategoryInput = document.getElementById('dishCategoryInput');
  const dishPriceInput = document.getElementById('dishPriceInput');
  const dishBadgeInput = document.getElementById('dishBadgeInput');
  const dishDescInput = document.getElementById('dishDescInput');
  const dishIsSpicy = document.getElementById('dishIsSpicy');
  const dishIsVeg = document.getElementById('dishIsVeg');

  const tabUploadImg = document.getElementById('tabUploadImg');
  const tabUrlImg = document.getElementById('tabUrlImg');
  const fileUploadZone = document.getElementById('fileUploadZone');
  const urlInputZone = document.getElementById('urlInputZone');
  const dishFileInput = document.getElementById('dishFileInput');
  const dishUrlInput = document.getElementById('dishUrlInput');
  const imagePreviewBox = document.getElementById('imagePreviewBox');
  const dishPreviewImg = document.getElementById('dishPreviewImg');
  const removePreviewBtn = document.getElementById('removePreviewBtn');

  let currentImageDataUrl = '';

  function openDishModal(dishId = null) {
    populateCategoryDropdowns();
    dishForm.reset();
    currentImageDataUrl = '';
    imagePreviewBox.style.display = 'none';
    dishPreviewImg.src = '';
    
    // Clear errors
    document.querySelectorAll('.field-error').forEach(el => el.style.display = 'none');

    if (dishId) {
      // Edit mode
      const dishes = getDishes();
      const dish = dishes.find(d => d.id === dishId);
      if (!dish) return;

      dishModalTitle.textContent = 'Edit Menu Dish';
      dishEditId.value = dish.id;
      dishNameInput.value = dish.name;
      dishCategoryInput.value = dish.category;
      dishPriceInput.value = dish.price;
      dishBadgeInput.value = dish.badge || '';
      dishDescInput.value = dish.description;
      dishIsSpicy.checked = !!dish.isSpicy;
      dishIsVeg.checked = !!dish.isVeg;

      if (dish.image) {
        currentImageDataUrl = dish.image;
        dishPreviewImg.src = dish.image;
        imagePreviewBox.style.display = 'block';
        dishUrlInput.value = dish.image.startsWith('http') ? dish.image : '';
      }
    } else {
      // Add mode
      dishModalTitle.textContent = 'Add New Menu Dish';
      dishEditId.value = '';
    }

    dishModal.classList.add('active');
    dishModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDishModal() {
    dishModal.classList.remove('active');
    dishModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  closeDishModalBtn?.addEventListener('click', closeDishModal);
  dishModalOverlay?.addEventListener('click', closeDishModal);
  cancelDishBtn?.addEventListener('click', closeDishModal);

  // Tab switching for image mode (File vs URL)
  tabUploadImg?.addEventListener('click', () => {
    tabUploadImg.classList.add('active');
    tabUrlImg.classList.remove('active');
    fileUploadZone.style.display = 'block';
    urlInputZone.style.display = 'none';
  });

  tabUrlImg?.addEventListener('click', () => {
    tabUrlImg.classList.add('active');
    tabUploadImg.classList.remove('active');
    urlInputZone.style.display = 'block';
    fileUploadZone.style.display = 'none';
  });

  // URL Input listener
  dishUrlInput?.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (val) {
      currentImageDataUrl = val;
      dishPreviewImg.src = val;
      imagePreviewBox.style.display = 'block';
    }
  });

  // File Upload (FileReader to Base64 Data URL)
  dishFileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      currentImageDataUrl = event.target.result;
      dishPreviewImg.src = currentImageDataUrl;
      imagePreviewBox.style.display = 'block';
    };
    reader.readAsDataURL(file);
  });

  // Remove preview
  removePreviewBtn?.addEventListener('click', () => {
    currentImageDataUrl = '';
    dishFileInput.value = '';
    dishUrlInput.value = '';
    dishPreviewImg.src = '';
    imagePreviewBox.style.display = 'none';
  });

  // Handle Save Dish Form Submission
  dishForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = dishNameInput.value.trim();
    const category = dishCategoryInput.value;
    const price = parseFloat(dishPriceInput.value);
    const badge = dishBadgeInput.value;
    const description = dishDescInput.value.trim();
    const isSpicy = dishIsSpicy.checked;
    const isVeg = dishIsVeg.checked;
    const editId = dishEditId.value;

    let hasError = false;

    if (!name || name.length < 2) {
      document.getElementById('dishNameError').textContent = 'Dish name must be at least 2 characters.';
      document.getElementById('dishNameError').style.display = 'block';
      hasError = true;
    }

    if (!price || price <= 0) {
      document.getElementById('dishPriceError').textContent = 'Please provide a valid positive price in PKR.';
      document.getElementById('dishPriceError').style.display = 'block';
      hasError = true;
    }

    if (!description || description.length < 5) {
      document.getElementById('dishDescError').textContent = 'Please enter a description (at least 5 characters).';
      document.getElementById('dishDescError').style.display = 'block';
      hasError = true;
    }

    // Default fallback image if none provided
    const image = currentImageDataUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

    if (hasError) return;

    let dishes = getDishes();

    if (editId) {
      // Update existing
      const idx = dishes.findIndex(d => d.id === editId);
      if (idx !== -1) {
        dishes[idx] = {
          ...dishes[idx],
          name,
          category,
          price,
          badge,
          description,
          image,
          isSpicy,
          isVeg,
          updatedAt: new Date().toISOString()
        };
        saveDishes(dishes);
        showToast(`Dish "${name}" updated successfully!`);
      }
    } else {
      // Add new dish
      const newDish = {
        id: 'dish-' + Date.now(),
        name,
        category,
        price,
        badge,
        description,
        image,
        isSpicy,
        isVeg,
        createdAt: new Date().toISOString()
      };
      dishes.unshift(newDish);
      saveDishes(dishes);
      showToast(`New dish "${name}" added to menu!`);
    }

    closeDishModal();
    renderDashboard();
    renderDishesTable();
  });

  // =========================================================================
  // 7. DELETE DISH CONFIRMATION MODAL
  // =========================================================================
  const deleteConfirmModal = document.getElementById('deleteConfirmModal');
  const deleteModalOverlay = document.getElementById('deleteModalOverlay');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const deleteModalMessage = document.getElementById('deleteModalMessage');

  let pendingDeleteDishId = null;

  function confirmDeleteDish(id, dishName) {
    pendingDeleteDishId = id;
    if (deleteModalMessage) {
      deleteModalMessage.innerHTML = `Are you sure you want to delete <strong>"${dishName}"</strong> from the restaurant menu?`;
    }
    deleteConfirmModal.classList.add('active');
    deleteConfirmModal.setAttribute('aria-hidden', 'false');
  }

  function closeDeleteModal() {
    pendingDeleteDishId = null;
    deleteConfirmModal.classList.remove('active');
    deleteConfirmModal.setAttribute('aria-hidden', 'true');
  }

  cancelDeleteBtn?.addEventListener('click', closeDeleteModal);
  deleteModalOverlay?.addEventListener('click', closeDeleteModal);

  confirmDeleteBtn?.addEventListener('click', () => {
    if (!pendingDeleteDishId) return;

    let dishes = getDishes();
    const deletedDish = dishes.find(d => d.id === pendingDeleteDishId);
    dishes = dishes.filter(d => d.id !== pendingDeleteDishId);
    saveDishes(dishes);

    showToast(`Dish "${deletedDish ? deletedDish.name : ''}" deleted from menu.`);
    closeDeleteModal();
    renderDashboard();
    renderDishesTable();
  });

  // =========================================================================
  // 8. CATEGORY MANAGEMENT
  // =========================================================================
  const adminCategoriesGrid = document.getElementById('adminCategoriesGrid');
  const categoryModal = document.getElementById('categoryModal');
  const categoryModalOverlay = document.getElementById('categoryModalOverlay');
  const closeCategoryModalBtn = document.getElementById('closeCategoryModalBtn');
  const cancelCategoryBtn = document.getElementById('cancelCategoryBtn');
  const categoryForm = document.getElementById('categoryForm');
  const categoryModalTitle = document.getElementById('categoryModalTitle');
  const catEditSlug = document.getElementById('catEditSlug');
  const catNameInput = document.getElementById('catNameInput');
  const catIconInput = document.getElementById('catIconInput');

  function renderCategoriesGrid() {
    if (!adminCategoriesGrid) return;
    const categories = getCategories();
    const dishes = getDishes();

    adminCategoriesGrid.innerHTML = '';

    categories.forEach(cat => {
      const dishCount = dishes.filter(d => d.category === cat.slug).length;
      const card = document.createElement('div');
      card.className = 'category-admin-card';

      card.innerHTML = `
        <div class="cat-card-header">
          <div class="cat-icon-badge">
            <i class="fa-solid ${cat.icon || 'fa-utensils'}"></i>
          </div>
          <span class="cat-dish-count-badge">${dishCount} ${dishCount === 1 ? 'Dish' : 'Dishes'}</span>
        </div>
        <h3 class="cat-card-title">${cat.name}</h3>
        <span class="cat-card-slug">Slug: ${cat.slug}</span>
        <div class="cat-card-footer">
          <button class="btn btn-outline btn-sm edit-cat-btn" data-slug="${cat.slug}">
            <i class="fa-solid fa-pen"></i> Edit
          </button>
          <button class="btn btn-outline btn-sm delete-cat-btn" data-slug="${cat.slug}" data-count="${dishCount}">
            <i class="fa-solid fa-trash"></i> Delete
          </button>
        </div>
      `;

      card.querySelector('.edit-cat-btn').addEventListener('click', () => openCategoryModal(cat.slug));
      card.querySelector('.delete-cat-btn').addEventListener('click', () => handleDeleteCategory(cat.slug, cat.name, dishCount));

      adminCategoriesGrid.appendChild(card);
    });
  }

  function openCategoryModal(slug = null) {
    categoryForm.reset();
    document.getElementById('catNameError').style.display = 'none';

    if (slug) {
      const categories = getCategories();
      const cat = categories.find(c => c.slug === slug);
      if (!cat) return;

      categoryModalTitle.textContent = 'Edit Food Category';
      catEditSlug.value = cat.slug;
      catNameInput.value = cat.name;
      catIconInput.value = cat.icon || '';
    } else {
      categoryModalTitle.textContent = 'Add New Category';
      catEditSlug.value = '';
    }

    categoryModal.classList.add('active');
    categoryModal.setAttribute('aria-hidden', 'false');
  }

  function closeCategoryModal() {
    categoryModal.classList.remove('active');
    categoryModal.setAttribute('aria-hidden', 'true');
  }

  closeCategoryModalBtn?.addEventListener('click', closeCategoryModal);
  categoryModalOverlay?.addEventListener('click', closeCategoryModal);
  cancelCategoryBtn?.addEventListener('click', closeCategoryModal);

  categoryForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = catNameInput.value.trim();
    let icon = catIconInput.value.trim() || 'fa-utensils';
    if (icon.startsWith('fa-') === false && !icon.includes(' ')) {
      icon = 'fa-' + icon;
    }
    const editSlug = catEditSlug.value;

    if (!name || name.length < 2) {
      document.getElementById('catNameError').textContent = 'Category name must be at least 2 characters.';
      document.getElementById('catNameError').style.display = 'block';
      return;
    }

    let categories = getCategories();

    if (editSlug) {
      // Edit existing
      const idx = categories.findIndex(c => c.slug === editSlug);
      if (idx !== -1) {
        categories[idx].name = name;
        categories[idx].icon = icon;
        saveCategories(categories);
        showToast(`Category "${name}" updated.`);
      }
    } else {
      // Generate slug
      const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (categories.some(c => c.slug === slug)) {
        document.getElementById('catNameError').textContent = 'A category with this name already exists.';
        document.getElementById('catNameError').style.display = 'block';
        return;
      }

      categories.push({ slug, name, icon });
      saveCategories(categories);
      showToast(`New category "${name}" created.`);
    }

    closeCategoryModal();
    renderCategoriesGrid();
    renderDashboard();
  });

  function handleDeleteCategory(slug, name, dishCount) {
    if (dishCount > 0) {
      alert(`Cannot delete category "${name}" because there are currently ${dishCount} dishes assigned to it. Please reassign or delete the dishes first.`);
      return;
    }

    if (confirm(`Are you sure you want to delete the category "${name}"?`)) {
      let categories = getCategories();
      categories = categories.filter(c => c.slug !== slug);
      saveCategories(categories);
      showToast(`Category "${name}" deleted.`);
      renderCategoriesGrid();
      renderDashboard();
    }
  }

  // =========================================================================
  // 9. RESTAURANT SETTINGS CONTROLLER
  // =========================================================================
  const settingsForm = document.getElementById('restaurantSettingsForm');
  const settingRestName = document.getElementById('settingRestName');
  const settingTagline = document.getElementById('settingTagline');
  const settingDescription = document.getElementById('settingDescription');
  const settingWhatsApp = document.getElementById('settingWhatsApp');
  const settingEmail = document.getElementById('settingEmail');
  const settingHours = document.getElementById('settingHours');
  const settingAddress = document.getElementById('settingAddress');

  function populateSettingsForm() {
    const settings = getSettings();
    if (settingRestName) settingRestName.value = settings.name || '';
    if (settingTagline) settingTagline.value = settings.tagline || '';
    if (settingDescription) settingDescription.value = settings.description || '';
    if (settingWhatsApp) settingWhatsApp.value = settings.whatsapp || '03092273955';
    if (settingEmail) settingEmail.value = settings.email || 'shayanlakhani66@gmail.com';
    if (settingHours) settingHours.value = settings.hours || 'Monday – Sunday: 12:00 PM – 12:00 AM';
    if (settingAddress) settingAddress.value = settings.address || '';
  }

  settingsForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const updatedSettings = {
      name: settingRestName.value.trim() || 'Shayan Restaurant',
      tagline: settingTagline.value.trim(),
      description: settingDescription.value.trim(),
      whatsapp: settingWhatsApp.value.trim() || '03092273955',
      email: settingEmail.value.trim() || 'shayanlakhani66@gmail.com',
      hours: settingHours.value.trim() || 'Monday – Sunday: 12:00 PM – 12:00 AM',
      address: settingAddress.value.trim()
    };

    saveSettings(updatedSettings);
    showToast('Restaurant information & settings updated across the website!');
    renderDashboard();
  });

  // =========================================================================
  // INITIAL RENDER
  // =========================================================================
  renderDashboard();
  renderDishesTable();
  renderCategoriesGrid();
  populateSettingsForm();
});
