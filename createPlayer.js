import { Sprite, Texture } from 'pixi.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default async function createPlayer(container, app) {
    // size of the "sprite" coming from Three render
    const width = 70;
    const height = 150;

    // Three setup with an offscreen canvas
    const canvas = document.createElement('canvas');
    const threeRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    threeRenderer.setSize(width, height);
    threeRenderer.setClearColor(0x000000, 0); // transparent

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 3);

    // simple lighting
    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(1, 1, 1);
    scene.add(dir);

    // load GLTF
    let diver = null;
    const loader = new GLTFLoader();
    loader.load('public/diver.glb',
        (gltf) => {
            diver = gltf.scene;
            // reset rotations and center/scale the model
            diver.rotation.set(0, 0, 0);
            const box = new THREE.Box3().setFromObject(diver);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z) || 1;
            const desired = 1.2;
            const scale = (desired / maxDim);
            diver.scale.setScalar(scale);
            // center
            const center = box.getCenter(new THREE.Vector3());
            diver.position.sub(center);
            scene.add(diver);
        },
        undefined,
        (err) => console.error('GLTF load error:', err)
    );

    // create PIXI texture from Three canvas and sprite
    const threeTexture = Texture.from(canvas);
    const player = new Sprite(threeTexture);
    player.width = width;
    player.height = height;
    player.x = app.screen.width / 2 - player.width / 2;
    player.y = app.screen.height / 2 - player.height / 2;
    container.addChild(player);

    // input + movement
    const speed = 5;
    const keys = {};
    window.addEventListener('keydown', (e) => { keys[e.key.toLowerCase()] = true; });
    window.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });

    // додаємо зверху перед ticker
    let targetRotationY = 0; // бажаний кут
    const rotationLerpSpeed = 0.1; // чим менше, тим повільніше поворот

    app.ticker.add(() => {
        if (!diver) return; // чекаємо, поки модель завантажиться

        // визначаємо цільовий кут по Y
        if (keys['w']) targetRotationY = 0;
        else if (keys['s']) targetRotationY = 3.14;
        else if (keys['a']) targetRotationY = 1;
        else if (keys['d']) targetRotationY = -1;

        // рух гравця
        if (keys['w']) player.y -= speed;
        if (keys['s']) player.y += speed;
        if (keys['a']) player.x -= speed;
        if (keys['d']) player.x += speed;

        // обмеження екрану
        player.x = Math.max(0, Math.min(app.screen.width - player.width, player.x));
        player.y = Math.max(0, Math.min(app.screen.height - player.height, player.y));

        // плавне обертання diver по Y
        diver.rotation.y += (targetRotationY - diver.rotation.y) * rotationLerpSpeed;

        // обертання тільки по X/Z
        diver.rotation.x = 0;
        diver.rotation.z = 0;

        // render Three scene to canvas
        threeRenderer.render(scene, camera);
        threeTexture.baseTexture.update();
    });


    return player;
}
