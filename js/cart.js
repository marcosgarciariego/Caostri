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
    const colorIdentifier = item.colorCode || item.color;

    div.innerHTML = `
        <div class="cart-item-thumbnail">
            <div class="mini-bag ${bagStyle}">
                <div class="mini-bag-body"></div>
                <div class="mini-bag-flap"></div>
                <div class="mini-bag-handle"></div>
            </div>
        </div>
        <div class="cart-item-details">
            <h3><a href="product.html?id=${item.id}">${item.name}</a></h3>
            <p class="cart-item-color">${item.color}</p>
            <p class="cart-item-price">€${item.price.toLocaleString()}</p>
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
        handleQuantityChange(item.id, colorIdentifier, -1);
    });

    plusBtn?.addEventListener('click', () => {
        handleQuantityChange(item.id, colorIdentifier, 1);
    });

    removeBtn?.addEventListener('click', () => {
        handleRemoveItem(item.id, colorIdentifier);
    });

    return div;
}

function getBagStyleClass(productId) {
    const styleMap = {
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
        CartDOM.subtotal.textContent = `€${total.toLocaleString()}`;
    }

    if (CartDOM.total) {
        CartDOM.total.textContent = `€${total.toLocaleString()}`;
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
        `• ${item.name} (${item.color}) x${item.quantity} - €${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');

    const message = `¡Gracias por tu compra en MONET!

Tu pedido:
${itemsSummary}

Total: €${total.toLocaleString()}

En una implementación real:
• Recibirías un email de confirmación
• Seguimiento de envío en tiempo real
• Entrega en 2-3 días laborables

¡Gracias por elegir MONET!`;

    alert(message);

    // Vaciar el carrito después del checkout
    if (window.MonetApp?.clearCart) {
        window.MonetApp.clearCart();
    }

    // Actualizar la UI
    renderCartItems();
    updateCartSummary();
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
