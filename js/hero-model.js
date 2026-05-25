const viewer = document.getElementById('heroModelViewer');
const stage = document.querySelector('.hero-model-stage');
const status = document.getElementById('heroModelStatus');
const HERO_FRAMES = Array.from(
    { length: 24 },
    (_, index) => `./images/hero-model-frames/frame-${String(index).padStart(2, '0')}.png`
);
const HERO_FRONT_FRAME = 12;
const HERO_AUTO_ROTATE_SPEED = 0.65;
const HERO_SPRITE_FRAME_DELAY_MS = 180;

if (!viewer || !stage || !status) {
    throw new Error('Hero 3D viewer container not found.');
}

bootstrapHeroModel();

async function bootstrapHeroModel() {
    if (window.location.protocol === 'file:') {
        initSpriteFallback();
        return;
    }

    if (!window.WebGLRenderingContext) {
        initSpriteFallback('Tu navegador no soporta WebGL.');
        return;
    }

    try {
        await initHeroModel();
    } catch (error) {
        console.error('No se pudo iniciar el visor 3D del hero.', error);
        initSpriteFallback();
    }
}

async function initHeroModel() {
    stage.classList.remove('is-sprite');
    const THREE = await import('three');
    const [{ OrbitControls }, { FBXLoader }] = await Promise.all([
        import('three/addons/controls/OrbitControls.js'),
        import('three/addons/loaders/FBXLoader.js')
    ]);

    viewer.innerHTML = '';
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.setAttribute('aria-hidden', 'true');
    viewer.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableRotate = false;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = HERO_AUTO_ROTATE_SPEED;
    controls.minPolarAngle = Math.PI / 2 - 0.35;
    controls.maxPolarAngle = Math.PI / 2 + 0.3;

    const ambientLight = new THREE.HemisphereLight(0xfffbf6, 0xcbbca8, 2.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(3.8, 5.4, 6.8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf2dfbf, 1.5);
    fillLight.position.set(-5.4, 2.4, 2.5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xd6c7b1, 1.35);
    rimLight.position.set(-3.2, 2.4, -4.5);
    scene.add(rimLight);

    const groundShadow = new THREE.Mesh(
        new THREE.CircleGeometry(1, 64),
        new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.08
        })
    );
    groundShadow.rotation.x = -Math.PI / 2;
    scene.add(groundShadow);

    const loader = new FBXLoader();
    const modelState = {
        wrapper: null,
        baseRotationY: Math.PI * 1.92
    };

    await new Promise((resolve, reject) => {
        loader.load(
            './models/bolso3d.fbx',
            (object) => {
                modelState.wrapper = prepareModel(object);
                stage.classList.add('is-ready');
                stage.classList.remove('is-error');
                status.textContent = 'Modelo cargado';
                resolve();
            },
            (event) => {
                if (!event.total) {
                    return;
                }

                const progress = Math.min(99, Math.round((event.loaded / event.total) * 100));
                status.textContent = `Cargando bolso 3D... ${progress}%`;
            },
            reject
        );
    });

    const resizeViewer = () => {
        const width = Math.max(viewer.clientWidth, 1);
        const height = Math.max(viewer.clientHeight, 1);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
    };

    if (typeof ResizeObserver !== 'undefined') {
        const resizeObserver = new ResizeObserver(resizeViewer);
        resizeObserver.observe(viewer);
    } else {
        window.addEventListener('resize', resizeViewer);
    }
    resizeViewer();

    const render = () => {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
    window.__heroModelDebug = {
        setAutoRotate(enabled) {
            controls.autoRotate = Boolean(enabled);
        },
        setModelRotation(degrees) {
            if (!modelState.wrapper) {
                return;
            }

            modelState.wrapper.rotation.y = modelState.baseRotationY + THREE.MathUtils.degToRad(degrees);
            controls.update();
            renderer.render(scene, camera);
        }
    };

    function prepareModel(object) {
        object.traverse((child) => {
            if (!child.isMesh) {
                return;
            }

            child.frustumCulled = false;

            if (Array.isArray(child.material)) {
                child.material.forEach(tuneMaterial);
            } else if (child.material) {
                tuneMaterial(child.material);
            }
        });

        const wrapper = new THREE.Group();
        wrapper.add(object);
        scene.add(wrapper);

        const initialBox = new THREE.Box3().setFromObject(object);
        const initialCenter = initialBox.getCenter(new THREE.Vector3());
        const initialSphere = initialBox.getBoundingSphere(new THREE.Sphere());

        object.position.sub(initialCenter);

        const targetRadius = 1.85;
        const scale = targetRadius / Math.max(initialSphere.radius, 0.001);
        wrapper.scale.setScalar(scale);
        wrapper.rotation.set(-0.05, modelState.baseRotationY, 0);

        wrapper.updateMatrixWorld(true);

        const fittedBox = new THREE.Box3().setFromObject(wrapper);
        const fittedCenter = fittedBox.getCenter(new THREE.Vector3());
        const fittedSize = fittedBox.getSize(new THREE.Vector3());
        wrapper.position.y = -fittedCenter.y - fittedSize.y * 0.01;
        wrapper.position.x = 0;
        wrapper.updateMatrixWorld(true);

        const finalBox = new THREE.Box3().setFromObject(wrapper);
        const finalCenter = finalBox.getCenter(new THREE.Vector3());
        const finalSphere = finalBox.getBoundingSphere(new THREE.Sphere());

        const fov = THREE.MathUtils.degToRad(camera.fov);
        const distance = (finalSphere.radius * 1.24) / Math.sin(fov / 2);

        camera.position.set(
            finalCenter.x + distance * 0.18,
            finalCenter.y + finalSphere.radius * 0.22,
            finalCenter.z + distance * 0.96
        );

        controls.target.set(
            finalCenter.x,
            finalCenter.y + finalSphere.radius * 0.14,
            finalCenter.z
        );
        controls.update();

        groundShadow.scale.setScalar(finalSphere.radius * 1.75);
        groundShadow.position.set(
            finalCenter.x,
            finalCenter.y - finalSphere.radius * 1.22,
            finalCenter.z
        );

        return wrapper;
    }

    function tuneMaterial(material) {
        if ('side' in material) {
            material.side = THREE.DoubleSide;
        }

        if ('metalness' in material) {
            material.metalness = Math.min(material.metalness ?? 0.2, 0.45);
        }

        if ('roughness' in material) {
            material.roughness = Math.max(material.roughness ?? 0.7, 0.45);
        }

        material.needsUpdate = true;
    }
}

function initSpriteFallback(message = 'Visor local listo.') {
    viewer.innerHTML = '';
    stage.classList.add('is-sprite');
    stage.classList.remove('is-error');
    status.textContent = 'Cargando visor local...';

    const sprite = document.createElement('img');
    sprite.className = 'hero-model-sprite';
    sprite.alt = 'Bolso 3D';
    sprite.draggable = false;
    viewer.appendChild(sprite);

    let currentFrame = HERO_FRONT_FRAME;
    let lastAutoFrameTime = 0;

    const updateFrame = () => {
        sprite.src = HERO_FRAMES[currentFrame];
    };

    const advanceFrame = (step) => {
        const total = HERO_FRAMES.length;
        currentFrame = (currentFrame + step + total) % total;
        updateFrame();
    };

    const autoRotate = (timestamp) => {
        if (timestamp - lastAutoFrameTime > HERO_SPRITE_FRAME_DELAY_MS) {
            advanceFrame(1);
            lastAutoFrameTime = timestamp;
        }

        requestAnimationFrame(autoRotate);
    };

    sprite.addEventListener('load', () => {
        stage.classList.add('is-ready');
        status.textContent = message;
        requestAnimationFrame(autoRotate);
    }, { once: true });

    sprite.addEventListener('error', () => {
        stage.classList.add('is-error');
        status.textContent = 'No se pudo cargar el visor local.';
    }, { once: true });

    updateFrame();
}
