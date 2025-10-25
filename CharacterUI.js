import { Sprite, Assets } from 'pixi.js';

export default async function createPlayer(container, app) {
    const pngfront = await Assets.load('front.png');
    const pngback = await Assets.load('back.png');
    const pngleft = await Assets.load('left.png');
    const pngright = await Assets.load('right.png');
    const player = new Sprite(pngfront);

    player.width = 70;
    player.height = 150;

    player.x = app.screen.width / 2 - player.width / 2;
    player.y = app.screen.height / 2 - player.height / 2;

    container.addChild(player);

    const speed = 5;
    const keys = {};

    window.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;
    });
    window.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });

    app.ticker.add(() => {
        if (keys['w']) player.y -= speed;
        if (keys['s']) player.y += speed;
        if (keys['a']) player.x -= speed;
        if (keys['d']) player.x += speed;

        player.x = Math.max(0, Math.min(app.screen.width - player.width, player.x));
        player.y = Math.max(0, Math.min(app.screen.height - player.height, player.y));
    });

    return player;
}
