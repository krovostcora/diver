import { Sprite, Assets } from 'pixi.js';

/**
 * Spawns multiple fish sprites and animates them.
 * Fish flee when player is near and wrap around screen edges.
 */
export default async function Fish(container, app, player) {
    if (!player) {
        console.error('Player is missing in Fish()');
        return;
    }

    // Fish sprite config
    const fishData = [
        { path: './png_fish/1fish.png', flipLeft: true,  flipRight: false },
        { path: './png_fish/2fish.png', flipLeft: false, flipRight: true },
        { path: './png_fish/3fish.png', flipLeft: false, flipRight: true },
        { path: './png_fish/4fish.png', flipLeft: true,  flipRight: false },
        { path: './png_fish/5fish.png', flipLeft: false, flipRight: true },
    ];

    // Load textures
    const loadedTextures = await Assets.load(fishData.map((f) => f.path));

    const fishes = [];
    const fishCount = 40;

    for (let i = 0; i < fishCount; i++) {
        const data = fishData[Math.floor(Math.random() * fishData.length)];
        const fish = new Sprite(loadedTextures[data.path]);

        // Random scale (fish 1 is smaller)
        const scale = data.path === 'png_fish/1fish.png'
            ? Math.random() * 0.005 + 0.005
            : Math.random() * 0.005 + 0.01;

        fish.scale.set(scale);

        // Store flip and scale rules
        fish.flipRules = { left: data.flipLeft, right: data.flipRight };
        fish.originalScale = scale;

        // Random start position
        fish.x = Math.random() * app.screen.width;
        fish.y = Math.random() * app.screen.height;

        fish.speed = Math.random() * 1.5 + 0.5;
        fish.direction = Math.random() < 0.5 ? 1 : -1;

        container.addChild(fish);
        fishes.push(fish);
    }

    app.ticker.add(() => {
        fishes.forEach((fish) => {
            const dx = fish.x - player.x;
            const dy = fish.y - player.y;
            const dist = Math.hypot(dx, dy);
            const safeDist = 200;

            // Move away if player too close
            if (dist < safeDist) {
                fish.direction = dx > 0 ? 1 : -1;
                fish.x += fish.speed * 2 * fish.direction;
                fish.y += (dy > 0 ? 1 : -1) * fish.speed;
            } else {
                fish.x += fish.speed * fish.direction;
            }

            // Flip sprite depending on direction and rule
            fish.scale.x =
                fish.direction === -1
                    ? (fish.flipRules.left ? -fish.originalScale : fish.originalScale)
                    : (fish.flipRules.right ? -fish.originalScale : fish.originalScale);

            fish.scale.y = fish.originalScale;

            // Wrap around screen edges
            if (fish.x > app.screen.width + 20) fish.x = -20;
            if (fish.x < -20) fish.x = app.screen.width + 20;
        });
    });

    return fishes;
}
