/* =============================================
   MONET - Página de Carrito
   JavaScript específico para cart.html
   ============================================= */

// =============================================
// ELEMENTOS DEL DOM
// =============================================
const CartDOM = {
    cartItemsList: document.getElementById('cartItemsList'),
    cartEmptyState: document.getElementById('cartEmptyState'),
    cartSummaryPanel: document.getElementById('cartSummaryPanel'),
    cartSubtitle: document.getElementById('cartSubtitle'),
    subtotal: document.getElementById('subtotal'),
    total: document.getElementById('total'),
    checkoutBtn: document.getElementById('checkoutBtn')
};

const CartImageColorTargets = {
    noir: null,
    camel: { r: 196, g: 167, b: 125 },
    burgundy: { r: 114, g: 47, b: 55 },
    navy: { r: 30, g: 58, b: 95 },
    ivory: { r: 226, g: 216, b: 198 },
    olive: { r: 92, g: 107, b: 74 }
};

const cartRecoloredImageCache = new Map();

// =============================================
// INICIALIZACIÓN
// =============================================

function initCartPage() {
    renderCartItems();
    updateCartSummary();

    // Iniciar checkout
    CartDOM.checkoutBtn?.addEventListener('click', handleCheckout);

    console.log('MONET - Página de carrito inicializada');
}

// =============================================
// RENDERIZADO DE ITEMS
// =============================================

function renderCartItems() {
    const cart = window.MonetApp?.AppState?.cart || [];

    // Actualizar subtítulo
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (CartDOM.cartSubtitle) {
        CartDOM.cartSubtitle.textContent = `${totalItems} ${totalItems === 1 ? 'artículo' : 'artículos'}`;
    }

    // Limpiar items existentes (excepto el estado vacío)
    const existingItems = CartDOM.cartItemsList?.querySelectorAll('.cart-item-card');
    existingItems?.forEach(item => item.remove());

    if (cart.length === 0) {
        // Mostrar estado vacío
        if (CartDOM.cartEmptyState) CartDOM.cartEmptyState.style.display = 'block';
        if (CartDOM.cartSummaryPanel) CartDOM.cartSummaryPanel.style.display = 'none';
        return;
    }

    // Ocultar estado vacío y mostrar resumen
    if (CartDOM.cartEmptyState) CartDOM.cartEmptyState.style.display = 'none';
    if (CartDOM.cartSummaryPanel) CartDOM.cartSummaryPanel.style.display = 'block';

    // Renderizar cada item
    cart.forEach(item => {
        const itemElement = createCartItemElement(item);
        CartDOM.cartItemsList?.appendChild(itemElement);
    });
}

function createCartItemElement(item) {
    const div = document.createElement('div');
    div.className = 'cart-item-card';
    div.setAttribute('data-item-id', item.id);

    const bagStyle = getBagStyleClass(item.id);
    const colorCode = item.colorCode || getColorCodeFromName(item.color) || 'noir';
    const itemIdentifier = item.optionKey || colorCode || item.color;
    const optionSummary = item.optionSummary || item.color || 'Configuración estándar';
    const galleryImages = Array.isArray(item.galleryImages) ? item.galleryImages : [];
    const cartGallery = galleryImages.length
        ? `<div class="cart-item-gallery">
                ${galleryImages.map(image => `
                    <span class="cart-gallery-thumb">
                        <img src="${image.src}" data-original-src="${image.src}" alt="${image.alt || item.name}">
                    </span>
                `).join('')}
            </div>`
        : '';
    const thumbnailMarkup = item.image
        ? `<div class="cart-item-media" data-color="${colorCode}">
                <img class="cart-item-photo" src="${item.image}" data-original-src="${item.image}" alt="${item.name}">
                ${cartGallery}
            </div>`
        : `<div class="mini-bag ${bagStyle}">
                <div class="mini-bag-body"></div>
                <div class="mini-bag-flap"></div>
                <div class="mini-bag-handle"></div>
            </div>`;

    div.innerHTML = `
        <div class="cart-item-thumbnail">
            ${thumbnailMarkup}
        </div>
        <div class="cart-item-details">
            <h3><a href="product.html?id=${item.id}">${item.name}</a></h3>
            <p class="cart-item-color">${optionSummary}</p>
            <p class="cart-item-price">€${formatCartPrice(item.price)}</p>
        </div>
        <div class="cart-item-actions">
            <div class="quantity-selector">
                <button class="qty-btn qty-minus">−</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn qty-plus">+</button>
            </div>
            <button class="remove-item-btn">Eliminar</button>
        </div>
    `;

    // Event listeners con closure para capturar los valores correctos
    const minusBtn = div.querySelector('.qty-minus');
    const plusBtn = div.querySelector('.qty-plus');
    const removeBtn = div.querySelector('.remove-item-btn');

    minusBtn?.addEventListener('click', () => {
        handleQuantityChange(item.id, itemIdentifier, -1);
    });

    plusBtn?.addEventListener('click', () => {
        handleQuantityChange(item.id, itemIdentifier, 1);
    });

    removeBtn?.addEventListener('click', () => {
        handleRemoveItem(item.id, itemIdentifier);
    });

    applyCartImageColor(div, colorCode);

    return div;
}

function getColorCodeFromName(colorName = '') {
    const normalized = colorName.toLowerCase();
    if (normalized.includes('camel')) return 'camel';
    if (normalized.includes('bordeaux') || normalized.includes('burgundy')) return 'burgundy';
    if (normalized.includes('bleu') || normalized.includes('navy')) return 'navy';
    if (normalized.includes('ivoire') || normalized.includes('ivory')) return 'ivory';
    if (normalized.includes('olive')) return 'olive';
    if (normalized.includes('noir')) return 'noir';
    return null;
}

async function applyCartImageColor(container, colorCode) {
    const images = container.querySelectorAll('[data-original-src]');
    images.forEach(async image => {
        const originalSrc = image.getAttribute('data-original-src');
        if (!originalSrc) return;

        image.src = originalSrc;
        image.src = await getCartColorizedImageSrc(originalSrc, colorCode);
    });
}

async function getCartColorizedImageSrc(src, color) {
    const target = CartImageColorTargets[color];
    if (!target) return src;

    const cacheKey = `${src}|${color}`;
    if (cartRecoloredImageCache.has(cacheKey)) {
        return cartRecoloredImageCache.get(cacheKey);
    }

    try {
        const image = await loadCartImage(src);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        ctx.drawImage(image, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const alpha = data[i + 3];
            if (alpha < 12) continue;

            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max === 0 ? 0 : (max - min) / max;
            const luminance = (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
            const isBackground = luminance > 238 && saturation < 0.08;
            const isLeatherTone = luminance < 205 && saturation < 0.34;

            if (isBackground || !isLeatherTone) continue;

            const shade = clampCartValue(0.35 + (luminance / 255) * 1.08, 0.28, 1.24);
            data[i] = clampCartValue(Math.round(target.r * shade), 0, 255);
            data[i + 1] = clampCartValue(Math.round(target.g * shade), 0, 255);
            data[i + 2] = clampCartValue(Math.round(target.b * shade), 0, 255);
        }

        ctx.putImageData(imageData, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        cartRecoloredImageCache.set(cacheKey, dataUrl);
        return dataUrl;
    } catch (error) {
        console.warn('CAOSTRI - No se pudo recolorear la imagen del carrito:', src, error);
        return src;
    }
}

function loadCartImage(src) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
    });
}

function clampCartValue(value, min = 0, max = 255) {
    return Math.min(max, Math.max(min, value));
}

function getBagStyleClass(productId) {
    const styleMap = {
        'jardin-rosas': 'signature',
        'equora-petit': '',
        'fluvia-petit': 'pochette',
        'orbea-petit': 'crossbody',
        'equora-grand': 'tote',
        'fluvia-grand': 'weekender',
        'orbea-grand': 'bucket',
        signature: 'signature',
        classic: '',
        tote: 'tote',
        pochette: 'pochette',
        mini: 'crossbody',
        voyage: 'weekender',
        bucket: 'bucket',
        baguette: 'baguette'
    };
    return styleMap[productId] || '';
}

// =============================================
// MANEJO DE ACCIONES
// =============================================

function handleQuantityChange(productId, color, change) {
    if (window.MonetApp?.updateCartItemQuantity) {
        window.MonetApp.updateCartItemQuantity(productId, color, change);
        renderCartItems();
        updateCartSummary();
    }
}

function handleRemoveItem(productId, color) {
    if (window.MonetApp?.removeFromCart) {
        // Buscar el elemento por ID
        const itemElement = CartDOM.cartItemsList?.querySelector(
            `[data-item-id="${productId}"]`
        );

        if (itemElement) {
            // Animación de salida
            itemElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            itemElement.style.opacity = '0';
            itemElement.style.transform = 'translateX(-20px)';

            setTimeout(() => {
                window.MonetApp.removeFromCart(productId, color);
                renderCartItems();
                updateCartSummary();
            }, 300);
        } else {
            window.MonetApp.removeFromCart(productId, color);
            renderCartItems();
            updateCartSummary();
        }
    }
}

// =============================================
// RESUMEN DEL CARRITO
// =============================================

function updateCartSummary() {
    const total = window.MonetApp?.getCartTotal?.() || 0;
    const cart = window.MonetApp?.AppState?.cart || [];

    if (CartDOM.subtotal) {
        CartDOM.subtotal.textContent = `€${formatCartPrice(total)}`;
    }

    if (CartDOM.total) {
        CartDOM.total.textContent = `€${formatCartPrice(total)}`;
    }

    if (CartDOM.checkoutBtn) {
        CartDOM.checkoutBtn.disabled = cart.length === 0;
    }
}

// =============================================
// CHECKOUT
// =============================================

function handleCheckout() {
    const cart = window.MonetApp?.AppState?.cart || [];
    const total = window.MonetApp?.getCartTotal?.() || 0;

    if (cart.length === 0) return;

    // Crear resumen de productos
    const itemsSummary = cart.map(item =>
        `• ${item.name} (${item.optionSummary || item.color || 'Configuración estándar'}) x${item.quantity} - €${formatCartPrice(item.price * item.quantity)}`
    ).join('\n');

    const message = `¡Gracias por tu compra en CAOSTRI!

Tu pedido:
${itemsSummary}

Total: €${formatCartPrice(total)}

En una implementación real:
• Recibirías un email de confirmación
• Seguimiento de envío en tiempo real
• Entrega en 2-3 días laborables

¡Gracias por elegir CAOSTRI!`;

    alert(message);

    // Vaciar el carrito después del checkout
    if (window.MonetApp?.clearCart) {
        window.MonetApp.clearCart();
    }

    // Actualizar la UI
    renderCartItems();
    updateCartSummary();
}

function formatCartPrice(price) {
    return price.toLocaleString('en-US');
}

// =============================================
// INICIAR CUANDO EL DOM ESTÉ LISTO
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    // Esperar a que main.js cargue
    setTimeout(initCartPage, 100);
});

// Escuchar cambios en el carrito desde otras pestañas
window.addEventListener('storage', (e) => {
    if (e.key === 'monetCart') {
        window.MonetApp?.loadCart?.();
        renderCartItems();
        updateCartSummary();
    }
});
