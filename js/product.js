/* =============================================
   MONET - Página de Producto
   JavaScript específico para product.html
   ============================================= */

// =============================================
// DATOS DE PRODUCTOS
// =============================================
const ProductsData = {
    'jardin-rosas': {
        id: 'jardin-rosas',
        name: 'Un jardín de rosas',
        badge: 'Limitado',
        tagline: 'Una edición numerada inspirada en la casa entre las rosas',
        description: 'Un jardín de rosas nace del diálogo entre el paisaje de Claude Monet y la precisión de la marroquinería contemporánea. Una pieza artística, delicada y limitada.',
        image: 'images/jardinderosas.png',
        galleryImages: [
            { src: 'images/jardindefloresdetras.png', alt: 'Vista trasera de Un jardín de rosas' },
            { src: 'images/jardinderosasinterior.png', alt: 'Interior de Un jardín de rosas' }
        ],
        dimensions: { width: '28 cm', height: '20 cm', depth: '12 cm', handle: '22 cm' },
        colors: { noir: 8500, ivory: 8500 },
        defaultColor: 'noir'
    },
    'equora-petit': {
        id: 'equora-petit',
        name: 'Équora Petit',
        badge: 'Best seller',
        tagline: 'Formato pequeño, estructura limpia y cierre superior',
        description: 'Équora Petit concentra la arquitectura de la línea en una silueta compacta. Comparte interior con Équora Grand y se presenta en cuatro colores.',
        image: 'images/petitÉquora.png',
        galleryImages: [
            { src: 'images/petitequoradetras.png', alt: 'Vista trasera de Équora Petit' },
            { src: 'images/equorainterior.png', alt: 'Interior Équora' }
        ],
        dimensions: { width: '24 cm', height: '18 cm', depth: '10 cm', handle: '16 cm' },
        colors: { noir: 3200, camel: 3200, burgundy: 3200, navy: 3200 },
        defaultColor: 'noir'
    },
    'fluvia-petit': {
        id: 'fluvia-petit',
        name: 'Fluvia Petit',
        badge: 'Petit',
        tagline: 'Una pieza ligera con caída suave y gesto escultórico',
        description: 'Fluvia Petit combina una silueta de hombro fluida con un interior artesanal coordinado. Una proporción pequeña para llevar lo esencial con calma.',
        image: 'images/petitfluvia.png',
        galleryImages: [
            { src: 'images/Petitfluviadetras.png', alt: 'Vista trasera de Fluvia Petit' },
            { src: 'images/fluviainterior.png', alt: 'Interior Fluvia' }
        ],
        dimensions: { width: '25 cm', height: '16 cm', depth: '9 cm', strap: '44 cm' },
        colors: { noir: 2700, camel: 2700, burgundy: 2700, navy: 2700 },
        defaultColor: 'camel'
    },
    'orbea-petit': {
        id: 'orbea-petit',
        name: 'Orbea Petit',
        badge: 'Petit',
        tagline: 'Volumen redondeado en formato compacto',
        description: 'Orbea Petit trabaja una forma redondeada, sobria y funcional. Su interior comparte la misma composición visual que Orbea Grand.',
        image: 'images/petitOrbea.png',
        galleryImages: [
            { src: 'images/petitorbeadetras.png', alt: 'Vista trasera de Orbea Petit' },
            { src: 'images/orbeainterior.png', alt: 'Interior Orbea' }
        ],
        dimensions: { width: '24 cm', height: '20 cm', depth: '8 cm', strap: '42 cm' },
        colors: { noir: 2400, camel: 2400, burgundy: 2400, navy: 2400 },
        defaultColor: 'noir'
    },
    'equora-grand': {
        id: 'equora-grand',
        name: 'Équora Grand',
        badge: 'Grand',
        tagline: 'La arquitectura Équora en su proporción más amplia',
        description: 'Équora Grand amplía la silueta del modelo Petit sin perder precisión. Su interior mantiene la misma identidad de la familia Équora.',
        image: 'images/GrandÉquora.png',
        galleryImages: [
            { src: 'images/grandequoradetras.png', alt: 'Vista trasera de Équora Grand' },
            { src: 'images/equorainterior.png', alt: 'Interior Équora' }
        ],
        dimensions: { width: '36 cm', height: '27 cm', depth: '14 cm', handle: '22 cm' },
        colors: { noir: 4100, camel: 4100, burgundy: 4100, navy: 4100 },
        defaultColor: 'noir'
    },
    'fluvia-grand': {
        id: 'fluvia-grand',
        name: 'Fluvia Grand',
        badge: 'Grand',
        tagline: 'Mayor amplitud para una silueta fluida de atelier',
        description: 'Fluvia Grand conserva la suavidad del modelo Petit y añade una capacidad mayor. El interior Fluvia se repite en ambas proporciones.',
        image: 'images/Grandfluvia.png',
        galleryImages: [
            { src: 'images/Grandfluviadetras.png', alt: 'Vista trasera de Fluvia Grand' },
            { src: 'images/fluviainterior.png', alt: 'Interior Fluvia' }
        ],
        dimensions: { width: '34 cm', height: '22 cm', depth: '12 cm', strap: '52 cm' },
        colors: { noir: 3200, camel: 3200, burgundy: 3200, navy: 3200 },
        defaultColor: 'burgundy'
    },
    'orbea-grand': {
        id: 'orbea-grand',
        name: 'Orbea Grand',
        badge: 'Grand',
        tagline: 'La forma Orbea con más presencia y capacidad',
        description: 'Orbea Grand lleva el volumen redondeado de la familia a una escala más generosa. Comparte interior con Orbea Petit.',
        image: 'images/GrandOrbea.png',
        galleryImages: [
            { src: 'images/grandorbeadetras.png', alt: 'Vista trasera de Orbea Grand' },
            { src: 'images/orbeainterior.png', alt: 'Interior Orbea' }
        ],
        dimensions: { width: '33 cm', height: '28 cm', depth: '11 cm', strap: '50 cm' },
        colors: { noir: 2900, camel: 2900, burgundy: 2900, navy: 2900 },
        defaultColor: 'camel'
    }
};

// =============================================
// ESTADO DE LA PÁGINA
// =============================================
let currentProduct = null;
let isAutoRotating = true;
let rotationAngle = 0;
let isDragging = false;
let startX = 0;
let productPhotos = [];
let activeProductPhotoIndex = 0;
let imageColorVersion = 0;

const ImageColorTargets = {
    noir: null,
    camel: { r: 196, g: 167, b: 125 },
    burgundy: { r: 114, g: 47, b: 55 },
    navy: { r: 30, g: 58, b: 95 },
    ivory: { r: 226, g: 216, b: 198 },
    olive: { r: 92, g: 107, b: 74 }
};

const recoloredImageCache = new Map();

// =============================================
// ELEMENTOS DEL DOM
// =============================================
const ProductDOM = {
    bag3D: document.getElementById('bag3D'),
    bag3DViewer: document.getElementById('bag3DViewer'),
    productDetailPhoto: document.getElementById('productDetailPhoto'),
    productPhotoThumbs: document.getElementById('productPhotoThumbs'),
    handleOptionCheckboxes: document.querySelectorAll('[data-handle-option]'),
    headphonePocket: document.getElementById('headphonePocket'),
    optionCheckboxes: document.querySelectorAll('.option-checkbox input'),
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
    const productId = urlParams.get('id') || 'jardin-rosas';

    // Cargar datos del producto
    currentProduct = ProductsData[productId] || ProductsData['jardin-rosas'];

    // Actualizar UI
    updateProductUI();
    renderProductGallery();
    initProductOptions();
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
    document.title = `${currentProduct.name} | CAOSTRI`;

    // Precio
    updatePrice();

    // Dimensiones
    updateDimensions();
}

function updatePrice() {
    const price = getProductPrice(currentProduct);
    if (ProductDOM.productPrice) {
        ProductDOM.productPrice.textContent = formatProductPrice(price);
    }
}

function getProductPrice(product) {
    if (typeof product.price === 'number') {
        return product.price;
    }

    return Object.values(product.colors || {})[0] || 0;
}

function formatProductPrice(price) {
    return `€${price.toLocaleString('en-US')}`;
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

function renderProductGallery() {
    if (!ProductDOM.productDetailPhoto || !ProductDOM.productPhotoThumbs) return;

    productPhotos = [
        { src: currentProduct.image, alt: currentProduct.name },
        ...(currentProduct.galleryImages || [])
    ].filter(photo => photo.src);
    activeProductPhotoIndex = 0;

    if (!productPhotos.length) return;

    ProductDOM.productDetailPhoto.src = productPhotos[0].src;
    ProductDOM.productDetailPhoto.alt = productPhotos[0].alt || currentProduct.name;

    ProductDOM.productPhotoThumbs.innerHTML = productPhotos.map((photo, index) => `
        <button class="product-photo-thumb${index === 0 ? ' active' : ''}" type="button" data-photo-index="${index}" aria-label="${photo.alt || currentProduct.name}">
            <img src="${photo.src}" alt="${photo.alt || currentProduct.name}">
        </button>
    `).join('');

    ProductDOM.productPhotoThumbs.querySelectorAll('.product-photo-thumb').forEach(button => {
        button.addEventListener('click', () => {
            const photo = productPhotos[Number(button.dataset.photoIndex)];
            if (!photo) return;

            activeProductPhotoIndex = Number(button.dataset.photoIndex);
            ProductDOM.productDetailPhoto.src = photo.src;
            ProductDOM.productDetailPhoto.alt = photo.alt || currentProduct.name;
            ProductDOM.productPhotoThumbs.querySelectorAll('.product-photo-thumb').forEach(thumb => thumb.classList.remove('active'));
            button.classList.add('active');
            updateProductImageColor();
        });
    });

    updateProductImageColor();
}

async function updateProductImageColor() {
    if (!ProductDOM.productDetailPhoto || !ProductDOM.productPhotoThumbs || !productPhotos.length) return;

    const colorVersion = ++imageColorVersion;
    const activePhoto = productPhotos[activeProductPhotoIndex] || productPhotos[0];

    ProductDOM.productDetailPhoto.src = activePhoto.src;
    ProductDOM.productDetailPhoto.alt = activePhoto.alt || currentProduct.name;

    const thumbImages = ProductDOM.productPhotoThumbs.querySelectorAll('.product-photo-thumb img');
    productPhotos.forEach((photo, index) => {
        const thumbImage = thumbImages[index];
        if (!thumbImage) return;

        if (colorVersion !== imageColorVersion) return;
        thumbImage.src = photo.src;
    });
}

async function getColorizedImageSrc(src, color) {
    const target = ImageColorTargets[color];
    if (!target) return src;

    const cacheKey = `${src}|${color}`;
    if (recoloredImageCache.has(cacheKey)) {
        return recoloredImageCache.get(cacheKey);
    }

    try {
        const image = await loadImage(src);
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

            const shade = clamp(0.35 + (luminance / 255) * 1.08, 0.28, 1.24);
            data[i] = clamp(Math.round(target.r * shade), 0, 255);
            data[i + 1] = clamp(Math.round(target.g * shade), 0, 255);
            data[i + 2] = clamp(Math.round(target.b * shade), 0, 255);
        }

        ctx.putImageData(imageData, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        recoloredImageCache.set(cacheKey, dataUrl);
        return dataUrl;
    } catch (error) {
        console.warn('CAOSTRI - No se pudo recolorear la imagen:', src, error);
        return src;
    }
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
    });
}

function clamp(value, min = 0, max = 255) {
    return Math.min(max, Math.max(min, value));
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
        ProductDOM.bag3D.setAttribute('data-color', 'noir');
    }
    updateProductImageColor();
}

// =============================================
// PERSONALIZACION
// =============================================

function initProductOptions() {
    const handleCheckboxes = Array.from(ProductDOM.handleOptionCheckboxes || []);

    const syncOptionLabels = () => {
        ProductDOM.optionCheckboxes?.forEach(input => {
            input.closest('.option-checkbox')?.classList.toggle('is-selected', input.checked);
        });
    };

    handleCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                handleCheckboxes.forEach(otherCheckbox => {
                    if (otherCheckbox !== checkbox) {
                        otherCheckbox.checked = false;
                    }
                });
            } else if (!handleCheckboxes.some(otherCheckbox => otherCheckbox.checked)) {
                checkbox.checked = true;
            }

            syncOptionLabels();
        });
    });

    ProductDOM.headphonePocket?.addEventListener('change', syncOptionLabels);
    syncOptionLabels();
}

function getSelectedProductOptions() {
    const selectedHandle = Array
        .from(ProductDOM.handleOptionCheckboxes || [])
        .find(checkbox => checkbox.checked);
    const hasHeadphonePocket = Boolean(ProductDOM.headphonePocket?.checked);

    return {
        handleSize: selectedHandle?.value || 'Asa pequeña',
        headphonePocket: hasHeadphonePocket,
        pocketLabel: hasHeadphonePocket ? 'Con bolsillo para auricular' : 'Sin bolsillo para auricular'
    };
}

function getProductOptionKey(options) {
    return [
        options.handleSize === 'Asa grande' ? 'handle-large' : 'handle-small',
        options.headphonePocket ? 'headphone-pocket' : 'no-headphone-pocket'
    ].join('|');
}

function getProductOptionSummary(options) {
    return `${options.handleSize} · ${options.pocketLabel}`;
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
        const options = getSelectedProductOptions();

        const product = {
            id: currentProduct.id,
            name: currentProduct.name,
            price: getProductPrice(currentProduct),
            options,
            optionKey: getProductOptionKey(options),
            optionSummary: getProductOptionSummary(options),
            image: currentProduct.image,
            galleryImages: currentProduct.galleryImages || []
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
