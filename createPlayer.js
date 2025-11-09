import { Sprite, Texture } from 'pixi.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * Creates a Pixi sprite rendered from a Three.js GLB model.
 * Model rotates smoothly depending on movement direction.
 */
export default async function createPlayer(container, app) {
    // Render size for diver character
    const width = 70;
    const height = 150;

    // Offscreen canvas for Three.js → used as Pixi texture
    const canvas = document.createElement('canvas');
    const threeRenderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
    });

    threeRenderer.setSize(width, height);
    threeRenderer.setClearColor(0x000000, 0); // Transparent background

    // Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 3);

    // Simple environment lighting setup
    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    scene.add(hemi);

    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(1, 1, 1);
    scene.add(dir);

    // GLB diver model
    let diver = null;
    const loader = new GLTFLoader();

    loader.load(
        `${import.meta.env.BASE_URL}diver.glb`,
        (gltf) => {
            diver = gltf.scene;

            // Reset rotation
            diver.rotation.set(0, 0, 0);

            // Auto-scale and center model
            const box = new THREE.Box3().setFromObject(diver);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z) || 1;
            const scale = 1.2 / maxDim;

            diver.scale.setScalar(scale);
            const center = box.getCenter(new THREE.Vector3());
            diver.position.sub(center);

            scene.add(diver);
        },
        undefined,
        (err) => console.error('GLTF load error:', err)
    );

    // Create Pixi sprite linked to the Three renderer texture
    const texture = Texture.from(canvas);
    const player = new Sprite(texture);

    player.width = width;
    player.height = height;
    player.x = app.screen.width / 2 - width / 2;
    player.y = app.screen.height / 2 - height / 2;

    container.addChild(player);

    // Keyboard input state
    const keys = {};
    window.addEventListener('keydown', (e) => (keys[e.key.toLowerCase()] = true));
    window.addEventListener('keyup', (e) => (keys[e.key.toLowerCase()] = false));

    // Movement settings
    const speed = 5;
    let targetRotationY = 0;      // Target yaw for model smoothing
    const lerpSpeed = 0.1;        // Smoothing factor

    app.ticker.add(() => {
        if (!diver) return; // Wait until GLB loaded

        // Choose rotation based on movement direction
        if (keys['w']) targetRotationY = 0;
        else if (keys['s']) targetRotationY = 3.14;
        else if (keys['a']) targetRotationY = 1;
        else if (keys['d']) targetRotationY = -1;

        // Move player sprite
        if (keys['w']) player.y -= speed;
        if (keys['s']) player.y += speed;
        if (keys['a']) player.x -= speed;
        if (keys['d']) player.x += speed;

        // Keep inside screen
        player.x = Math.max(0, Math.min(app.screen.width - width, player.x));
        player.y = Math.max(0, Math.min(app.screen.height - height, player.y));

        // Smoothly rotate the GLB model
        diver.rotation.y += (targetRotationY - diver.rotation.y) * lerpSpeed;

        // Disable rotation on X/Z axis
        diver.rotation.x = 0;
        diver.rotation.z = 0;

        // Render Three scene → push to Pixi texture
        threeRenderer.render(scene, camera);
        texture.baseTexture.update();
    });

    return player;
}
