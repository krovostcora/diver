import { Application, Assets, Container, Sprite, TilingSprite } from 'pixi.js';
import createPlayer from './CreatePlayer.js';
import Fish from './Fish.js';

/**
 * Bootstraps Pixi app, background, water overlay, GLB diver and fish.
 */
(async () => {
    // Init Pixi
    const app = new Application();
    await app.init({ width: 1450, height: 1000, antialias: true });

    // Attach canvas
    document.body.appendChild(app.canvas);
    app.canvas.style.position = 'absolute';

    // Center canvas on screen
    const centerCanvas = () => {
        app.canvas.style.top = `${(window.innerHeight - app.canvas.height) / 2}px`;
        app.canvas.style.left = `${(window.innerWidth - app.canvas.width) / 2}px`;
    };

    centerCanvas();
    window.addEventListener('resize', centerCanvas);

    // Load assets
    await Assets.load([
        `https://pixijs.com/assets/pond/displacement_BG.jpg`,
        `https://pixijs.com/assets/pond/overlay.png`,
        `https://pixijs.com/assets/pond/displacement_map.png`,
    ]);

    await Assets.load('./img_1.png');
    const bgTex = Assets.get('./img_1.png');

    // Background sprite
    const background = new Sprite(bgTex);

    const screenW = app.screen.width;
    const screenH = app.screen.height;
    const texW = background.texture.width;
    const texH = background.texture.height;

    // Fit background to canvas
    if (texW / texH > screenW / screenH) {
        background.height = screenH;
        background.width = background.height * (texW / texH);
    } else {
        background.width = screenW;
        background.height = background.width / (texW / texH);
    }

    background.x = (screenW - background.width) / 2;
    background.y = (screenH - background.height) / 2;

    const pondContainer = new Container();
    pondContainer.addChild(background);
    app.stage.addChild(pondContainer);

    // Water overlay
    const overlayTex = Assets.get(`https://pixijs.com/assets/pond/overlay.png`);
    const waterOverlay = new TilingSprite(overlayTex, screenW, screenH);
    pondContainer.addChild(waterOverlay);

    // Add GLB diver
    const player = await createPlayer(pondContainer, app);

    // Add fish
    Fish(pondContainer, app, player);

    // Animate water layer
    app.ticker.add(() => {
        waterOverlay.tilePosition.x += 0.5;
        waterOverlay.tilePosition.y += 0.5;
    });
})();
