// javascript
// `index.js`
import {
    Application,
    Assets,
    Container,
    Sprite,
    TilingSprite,
} from 'pixi.js';
import createPlayer from './CharacterUI.js';
import Fish from "./Fish.js";

(async () => {
    const app = new Application();
    await app.init({ width: 1450, height: 1000, antialias: true });

    document.body.appendChild(app.canvas);
    app.canvas.style.position = 'absolute';

    const centerCanvas = () => {
        app.canvas.style.top = `${(window.innerHeight - app.canvas.height) / 2}px`;
        app.canvas.style.left = `${(window.innerWidth - app.canvas.width) / 2}px`;
    };
    centerCanvas();

    window.addEventListener('resize', () => {
        centerCanvas();
        // if you resize the renderer you can update overlay/bg sizing here
    });

    await Assets.load([
        `https://pixijs.com/assets/pond/displacement_BG.jpg`,
        `https://pixijs.com/assets/pond/overlay.png`,
        `https://pixijs.com/assets/pond/displacement_map.png`,
        `https://pixijs.com/assets/pond/displacement_fish1.png`,
        `https://pixijs.com/assets/pond/displacement_fish2.png`,
    ]);

    await Assets.load('/img.png');
    const bgTex = Assets.get('/img.png');
    const background = new Sprite(bgTex);

    // fit background to app.screen
    const screenW = app.screen.width;
    const screenH = app.screen.height;
    const texW = background.texture.width;
    const texH = background.texture.height;
    const texRatio = texW / texH;
    const screenRatio = screenW / screenH;

    if (texRatio > screenRatio) {
        background.height = screenH;
        background.width = background.height * texRatio;
    } else {
        background.width = screenW;
        background.height = background.width / texRatio;
    }
    background.x = (screenW - background.width) / 2;
    background.y = (screenH - background.height) / 2;

    const pondContainer = new Container();
    pondContainer.addChild(background);
    app.stage.addChild(pondContainer);

    const overlayTex = Assets.get('https://pixijs.com/assets/pond/overlay.png');
    const waterOverlay = new TilingSprite(overlayTex, app.screen.width, app.screen.height);
    pondContainer.addChild(waterOverlay);

    // create and add player so it renders on top of overlay
    const player = await createPlayer(pondContainer, app);
    Fish(pondContainer, app, player);


    app.ticker.add(() => {
        waterOverlay.tilePosition.x += 0.5;
        waterOverlay.tilePosition.y += 0.5;
    });
})();
