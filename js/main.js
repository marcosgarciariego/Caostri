/* =============================================
   MONET - Haute Maroquinerie
   JavaScript Principal (Compartido)
   ============================================= */

// =============================================
// ESTADO GLOBAL DE LA APLICACIÓN
// =============================================
const AppState = {
    cart: [],
    colorNames: {
        'noir': 'Noir Élégant',
        'camel': 'Camel Classique',
        'burgundy': 'Bordeaux Prestige',
        'navy': 'Bleu Nuit',
        'ivory': 'Ivoire Pur',
        'olive': 'Olive Toscan'
    }
};

// =============================================
// ELEMENTOS COMUNES DEL DOM
// =============================================
const CommonDOM = {
    header: document.getElementById('mainHeader'),
    navMenu: document.getElementById('navMenu'),
    navLinks: document.querySelectorAll('.nav-link'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    cartCount: document.getElementById('cartCount'),
    cartNotification: document.getElementById('cartNotification')
};

// =============================================
// NAVEGACIÓN Y HEADER
// =============================================

function initNavigation() {
    // Scroll listener para efecto del header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            CommonDOM.header?.classList.add('scrolled');
        } else {
            CommonDOM.header?.classList.remove('scrolled');
        }
        updateActiveNavLink();
    });

    // Click en enlaces de navegación con secciones
    CommonDOM.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const section = link.getAttribute('data-section');
            if (section) {
                e.preventDefault();
                scrollToSection(section);
                closeMobileMenu();
            }
        });
    });

    // Menú móvil
    CommonDOM.mobileMenuBtn?.addEventListener('click', toggleMobileMenu);
}

function updateActiveNavLink() {
    const sections = ['private-edition', 'coleccion', 'maison'];
    const scrollPos = window.scrollY + 150;

    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                CommonDOM.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        }
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = CommonDOM.header?.offsetHeight || 90;
        const targetPos = section.offsetTop - headerHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
}

function toggleMobileMenu() {
    CommonDOM.mobileMenuBtn?.classList.toggle('active');
    CommonDOM.navMenu?.classList.toggle('open');
}

function closeMobileMenu() {
    CommonDOM.mobileMenuBtn?.classList.remove('active');
    CommonDOM.navMenu?.classList.remove('open');
}

// =============================================
// GESTIÓN DEL CARRITO (COMPARTIDO)
// =============================================

function loadCart() {
    const savedCart = localStorage.getItem('monetCart');
    if (savedCart) {
        AppState.cart = JSON.parse(savedCart);
    }
    updateCartCount();
}

function saveCart() {
    localStorage.setItem('monetCart', JSON.stringify(AppState.cart));
}

function addToCart(product) {
    const existingIndex = AppState.cart.findIndex(
        item => item.id === product.id && item.color === product.color
    );

    if (existingIndex > -1) {
        AppState.cart[existingIndex].quantity += 1;
    } else {
        AppState.cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartCount();
    showCartNotification('Añadido a tu cesta');
}

function removeFromCart(productId, color) {
    AppState.cart = AppState.cart.filter(
        item => !(item.id === productId && (item.color === color || item.colorCode === color))
    );
    saveCart();
    updateCartCount();
}

function updateCartItemQuantity(productId, color, change) {
    const item = AppState.cart.find(
        item => item.id === productId && (item.color === color || item.colorCode === color)
    );

    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId, item.colorCode || item.color);
        } else {
            saveCart();
            updateCartCount();
        }
    }
}

function clearCart() {
    AppState.cart = [];
    saveCart();
    updateCartCount();
}

function updateCartCount() {
    const totalItems = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);

    if (CommonDOM.cartCount) {
        CommonDOM.cartCount.textContent = totalItems;
        if (totalItems > 0) {
            CommonDOM.cartCount.classList.add('visible');
        } else {
            CommonDOM.cartCount.classList.remove('visible');
        }
    }
}

function getCartTotal() {
    return AppState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function showCartNotification(message = 'Añadido a tu cesta') {
    if (CommonDOM.cartNotification) {
        const textEl = CommonDOM.cartNotification.querySelector('span');
        if (textEl) textEl.textContent = message;

        CommonDOM.cartNotification.classList.add('visible');
        setTimeout(() => {
            CommonDOM.cartNotification.classList.remove('visible');
        }, 3000);
    }
}

// =============================================
// ANIMACIONES DE SCROLL
// =============================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    const animatableElements = document.querySelectorAll(
        '.product-card, .maison-block'
    );

    animatableElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Añadir estilos para elementos en vista
    if (!document.getElementById('animation-styles')) {
        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `.in-view { opacity: 1 !important; transform: translateY(0) !important; }`;
        document.head.appendChild(style);
    }
}

// =============================================
// ENLACES INTERNOS
// =============================================

function initInternalLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href').substring(1);
            if (targetId && document.getElementById(targetId)) {
                e.preventDefault();
                scrollToSection(targetId);
            }
        });
    });
}

// =============================================
// INICIALIZACIÓN COMÚN
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    loadCart();
    initScrollAnimations();
    initInternalLinks();

    console.log('MONET - Módulos comunes inicializados');
});

// Exportar funciones para otros scripts
window.MonetApp = {
    AppState,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    updateCartCount,
    getCartTotal,
    showCartNotification,
    loadCart,
    saveCart,
    clearCart
};
