/* =============================================
   MONET - Página de Producto
   JavaScript específico para product.html
   ============================================= */

// =============================================
// DATOS DE PRODUCTOS
// =============================================
const ProductsData = {
    signature: {
        id: 'signature',
        name: 'Signature Monet',
        badge: 'Signature',
        tagline: 'Nuestra pieza icónica, símbolo de elegancia atemporal',
        description: 'El Signature Monet encarna la esencia de nuestra maison: líneas puras, proporciones perfectas y una atención obsesiva al detalle. Confeccionado íntegramente a mano en nuestro atelier parisino.',
        dimensions: { width: '28 cm', height: '20 cm', depth: '12 cm', handle: '22 cm' },
        colors: {
            noir: 2450, camel: 2450, burgundy: 2550,
            navy: 2450, ivory: 2650, olive: 2550
        },
        defaultColor: 'noir'
    },
    classic: {
        id: 'classic',
        name: 'Le Monet Classic',
        badge: 'Bestseller',
        tagline: 'Elegancia estructurada con cierre de cremallera dorada',
        description: 'El Classic Monet es la expresión perfecta de la sofisticación discreta. Su silueta estructurada y su cierre de cremallera YKK Gold lo convierten en el compañero ideal para cada ocasión.',
        dimensions: { width: '32 cm', height: '24 cm', depth: '14 cm', handle: '18 cm' },
        colors: { noir: 1890, camel: 1890, burgundy: 1990, navy: 1890 },
        defaultColor: 'noir'
    },
    tote: {
        id: 'tote',
        name: 'Le Monet Tote',
        badge: 'Spacieux',
        tagline: 'Amplitud y elegancia en perfecta armonía',
        description: 'El Tote Monet ofrece generoso espacio sin sacrificar la elegancia. Con doble asa reforzada y bolsillo interior con cremallera, es perfecto para la mujer moderna que no renuncia al estilo.',
        dimensions: { width: '38 cm', height: '30 cm', depth: '16 cm', handle: '24 cm' },
        colors: { noir: 2150, camel: 2150, burgundy: 2250, navy: 2150, olive: 2250 },
        defaultColor: 'camel'
    },
    pochette: {
        id: 'pochette',
        name: 'La Pochette Monet',
        badge: 'Nouveau',
        tagline: 'Glamour nocturno con cadena desmontable',
        description: 'La Pochette Monet es la encarnación del glamour contemporáneo. Su cadena bañada en oro puede llevarse al hombro o guardarse para usar como clutch de mano.',
        dimensions: { width: '24 cm', height: '14 cm', depth: '6 cm', chain: '120 cm' },
        colors: { noir: 1290, burgundy: 1390, navy: 1290, ivory: 1450 },
        defaultColor: 'noir'
    },
    mini: {
        id: 'mini',
        name: 'Le Mini Monet',
        badge: 'Compact',
        tagline: 'Lo esencial, con estilo inigualable',
        description: 'El Mini Monet demuestra que el lujo no necesita grandes dimensiones. Con correa ajustable y cierre frontal, es perfecto para llevar solo lo esencial con máxima elegancia.',
        dimensions: { width: '20 cm', height: '15 cm', depth: '8 cm', strap: '60-120 cm' },
        colors: { noir: 1450, camel: 1450, burgundy: 1550, navy: 1450, ivory: 1650, olive: 1550 },
        defaultColor: 'navy'
    },
    voyage: {
        id: 'voyage',
        name: 'Le Voyage Monet',
        badge: 'Exclusivo',
        tagline: 'El arte de viajar con distinción',
        description: 'El Voyage Monet es el compañero perfecto para escapadas de fin de semana. Con múltiples compartimentos, doble cremallera con candado y base reforzada, combina funcionalidad y lujo.',
        dimensions: { width: '48 cm', height: '28 cm', depth: '22 cm', handle: '20 cm' },
        colors: { noir: 3200, camel: 3200, olive: 3350 },
        defaultColor: 'olive'
    },
    bucket: {
        id: 'bucket',
        name: 'Le Seau Monet',
        badge: 'Artisanal',
        tagline: 'Silueta icónica con cierre de cordón',
        description: 'El Seau Monet reinterpreta la forma clásica del bucket bag con la exquisitez de la artesanía francesa. Su cierre de cordón en piel y el bolsillo interior con cremallera lo hacen único.',
        dimensions: { width: '26 cm', height: '28 cm', depth: '18 cm', strap: '50-110 cm' },
        colors: { noir: 1750, camel: 1750, burgundy: 1850, navy: 1750, olive: 1850 },
        defaultColor: 'camel'
    },
    baguette: {
        id: 'baguette',
        name: 'La Baguette Monet',
        badge: 'Nouveau',
        tagline: 'Silueta alargada, elegancia infinita',
        description: 'La Baguette Monet rinde homenaje a las formas clásicas con un toque contemporáneo. Su asa corta permite llevarla bajo el brazo o al hombro con igual distinción.',
        dimensions: { width: '28 cm', height: '14 cm', depth: '8 cm', handle: '20 cm' },
        colors: { noir: 1650, camel: 1650, burgundy: 1750, ivory: 1850 },
        defaultColor: 'camel'
    }
};

// =============================================
// ESTADO DE LA PÁGINA
// =============================================
let currentProduct = null;
let currentColor = 'noir';
let isAutoRotating = true;
let rotationAngle = 0;
let isDragging = false;
let startX = 0;

// =============================================
// ELEMENTOS DEL DOM
// =============================================
const ProductDOM = {
    bag3D: document.getElementById('bag3D'),
    bag3DViewer: document.getElementById('bag3DViewer'),
    colorSwatches: document.getElementById('colorSwatches'),
    selectedColorName: document.getElementById('selectedColorName'),
    productTitle: document.getElementById('productTitle'),
    productTagline: document.getElementById('productTagline'),
    productPrice: document.getElementById('productPrice'),
    productBadge: document.getElementById('productBadge'),
    productDescription: document.getElementById('productDescription'),
    breadcrumbProduct: document.getElementById('breadcrumbProduct'),
    dimensionsGrid: document.getElementById('dimensionsGrid'),
    addToCartBtn: document.getElementById('addToCartBtn'),
    rotateLeft: document.getElementById('rotateLeft'),
    rotateRight: document.getElementById('rotateRight'),
    toggleRotation: document.getElementById('toggleRotation'),
    playIcon: document.getElementById('playIcon'),
    pauseIcon: document.getElementById('pauseIcon')
};

// =============================================
// INICIALIZACIÓN
// =============================================

function initProductPage() {
    // Obtener ID del producto de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || 'signature';

    // Cargar datos del producto
    currentProduct = ProductsData[productId] || ProductsData.signature;
    currentColor = currentProduct.defaultColor;

    // Actualizar UI
    updateProductUI();
    updateColorSwatches();
    init3DViewer();
    initAccordions();
    initAddToCart();

    console.log('MONET - Página de producto inicializada:', currentProduct.name);
}

// =============================================
// ACTUALIZACIÓN DE UI
// =============================================

function updateProductUI() {
    // Título y textos
    if (ProductDOM.productTitle) {
        ProductDOM.productTitle.textContent = currentProduct.name;
    }
    if (ProductDOM.productTagline) {
        ProductDOM.productTagline.textContent = currentProduct.tagline;
    }
    if (ProductDOM.productBadge) {
        ProductDOM.productBadge.textContent = currentProduct.badge;
    }
    if (ProductDOM.productDescription) {
        ProductDOM.productDescription.textContent = currentProduct.description;
    }
    if (ProductDOM.breadcrumbProduct) {
        ProductDOM.breadcrumbProduct.textContent = currentProduct.name;
    }

    // Actualizar título de la página
    document.title = `${currentProduct.name} | MONET`;

    // Precio
    updatePrice();

    // Dimensiones
    updateDimensions();
}

function updatePrice() {
    const price = currentProduct.colors[currentColor];
    if (ProductDOM.productPrice) {
        ProductDOM.productPrice.textContent = `€${price.toLocaleString()}`;
    }
}

function updateDimensions() {
    if (ProductDOM.dimensionsGrid && currentProduct.dimensions) {
        const dims = currentProduct.dimensions;
        ProductDOM.dimensionsGrid.innerHTML = `
            <div class="dimension">
                <span class="dim-label">Ancho</span>
                <span class="dim-value">${dims.width}</span>
            </div>
            <div class="dimension">
                <span class="dim-label">Alto</span>
                <span class="dim-value">${dims.height}</span>
            </div>
            <div class="dimension">
                <span class="dim-label">Profundidad</span>
                <span class="dim-value">${dims.depth}</span>
            </div>
            <div class="dimension">
                <span class="dim-label">${dims.handle ? 'Asa' : dims.strap ? 'Correa' : dims.chain ? 'Cadena' : 'Asa'}</span>
                <span class="dim-value">${dims.handle || dims.strap || dims.chain}</span>
            </div>
        `;
    }
}

// =============================================
// SELECTOR DE COLORES
// =============================================

function updateColorSwatches() {
    if (!ProductDOM.colorSwatches) return;

    const availableColors = Object.keys(currentProduct.colors);
    const swatches = ProductDOM.colorSwatches.querySelectorAll('.color-swatch');

    swatches.forEach(swatch => {
        const color = swatch.getAttribute('data-color');
        if (availableColors.includes(color)) {
            swatch.style.display = 'block';
            swatch.classList.toggle('active', color === currentColor);
            // Actualizar precio en el swatch
            swatch.setAttribute('data-price', currentProduct.colors[color]);
        } else {
            swatch.style.display = 'none';
        }
    });

    updateColorName();

    // Event listeners para swatches
    swatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            const color = swatch.getAttribute('data-color');
            if (currentProduct.colors[color]) {
                currentColor = color;
                swatches.forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');
                updateColorName();
                updatePrice();
                update3DColor();
            }
        });
    });
}

function updateColorName() {
    if (ProductDOM.selectedColorName) {
        const colorNames = window.MonetApp?.AppState?.colorNames || {
            'noir': 'Noir Élégant',
            'camel': 'Camel Classique',
            'burgundy': 'Bordeaux Prestige',
            'navy': 'Bleu Nuit',
            'ivory': 'Ivoire Pur',
            'olive': 'Olive Toscan'
        };
        ProductDOM.selectedColorName.textContent = colorNames[currentColor] || currentColor;
    }
}

// =============================================
// VISOR 3D
// =============================================

function init3DViewer() {
    if (!ProductDOM.bag3D || !ProductDOM.bag3DViewer) return;

    // Establecer color inicial
    ProductDOM.bag3D.setAttribute('data-color', currentColor);

    // Iniciar rotación automática
    startAutoRotation();

    // Eventos de arrastre
    ProductDOM.bag3DViewer.addEventListener('mousedown', handleDragStart);
    ProductDOM.bag3DViewer.addEventListener('touchstart', handleDragStart, { passive: true });
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('touchmove', handleDragMove, { passive: true });
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);

    // Controles de rotación
    ProductDOM.rotateLeft?.addEventListener('click', () => {
        stopAutoRotation();
        rotationAngle -= 45;
        applyRotation();
    });

    ProductDOM.rotateRight?.addEventListener('click', () => {
        stopAutoRotation();
        rotationAngle += 45;
        applyRotation();
    });

    ProductDOM.toggleRotation?.addEventListener('click', () => {
        if (isAutoRotating) {
            stopAutoRotation();
        } else {
            startAutoRotation();
        }
    });
}

let rotationInterval = null;

function startAutoRotation() {
    isAutoRotating = true;
    updateRotationButton();

    if (rotationInterval) clearInterval(rotationInterval);

    rotationInterval = setInterval(() => {
        if (isAutoRotating && !isDragging) {
            rotationAngle += 0.5;
            applyRotation();
        }
    }, 30);
}

function stopAutoRotation() {
    isAutoRotating = false;
    updateRotationButton();

    if (rotationInterval) {
        clearInterval(rotationInterval);
        rotationInterval = null;
    }
}

function updateRotationButton() {
    if (ProductDOM.playIcon && ProductDOM.pauseIcon) {
        ProductDOM.playIcon.style.display = isAutoRotating ? 'none' : 'block';
        ProductDOM.pauseIcon.style.display = isAutoRotating ? 'block' : 'none';
    }
    ProductDOM.toggleRotation?.classList.toggle('active', isAutoRotating);
}

function applyRotation() {
    if (ProductDOM.bag3D) {
        ProductDOM.bag3D.style.transform = `rotateY(${rotationAngle}deg)`;
    }
}

function handleDragStart(e) {
    isDragging = true;
    startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    stopAutoRotation();
}

function handleDragMove(e) {
    if (!isDragging) return;

    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const deltaX = clientX - startX;
    rotationAngle += deltaX * 0.5;
    startX = clientX;
    applyRotation();
}

function handleDragEnd() {
    isDragging = false;
}

function update3DColor() {
    if (ProductDOM.bag3D) {
        ProductDOM.bag3D.setAttribute('data-color', currentColor);
    }
}

// =============================================
// ACORDEONES
// =============================================

function initAccordions() {
    const headers = document.querySelectorAll('.accordion-header');

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const accordionId = header.getAttribute('data-accordion');
            const content = document.getElementById(accordionId);

            // Toggle estado
            const isActive = header.classList.contains('active');

            // Cerrar todos
            headers.forEach(h => h.classList.remove('active'));
            document.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('active'));

            // Abrir el clickeado si estaba cerrado
            if (!isActive) {
                header.classList.add('active');
                content?.classList.add('active');
            }
        });
    });
}

// =============================================
// AÑADIR AL CARRITO
// =============================================

function initAddToCart() {
    ProductDOM.addToCartBtn?.addEventListener('click', () => {
        const colorNames = window.MonetApp?.AppState?.colorNames || {};

        const product = {
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.colors[currentColor],
            color: colorNames[currentColor] || currentColor,
            colorCode: currentColor
        };

        if (window.MonetApp?.addToCart) {
            window.MonetApp.addToCart(product);
        }
    });
}

// =============================================
// INICIAR CUANDO EL DOM ESTÉ LISTO
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    // Esperar a que main.js cargue
    setTimeout(initProductPage, 100);
});
