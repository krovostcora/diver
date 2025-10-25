import { Sprite, Assets } from 'pixi.js';

export default async function Fish(container, app, player) {
    if (!player) {
        console.error("❌ Player is missing in Fish()");
        return;
    }

    // Fish definitions with flip rules
    const fishData = [
        { path: 'png_fish/1fish.png', flipLeft: true,  flipRight: false },
        { path: 'png_fish/2fish.png', flipLeft: false, flipRight: true },
        { path: 'png_fish/3fish.png', flipLeft: false, flipRight: true },
        { path: 'png_fish/4fish.png', flipLeft: true,  flipRight: false },
        { path: 'png_fish/5fish.png', flipLeft: false, flipRight: true },
    ];

    // Load all textures
    const loadedTextures = await Assets.load(fishData.map(f => f.path));

    const fishes = [];
    const fishCount = 40;

    for (let i = 0; i < fishCount; i++) {
        // Pick random fish
        const randomIndex = Math.floor(Math.random() * fishData.length);
        const data = fishData[randomIndex];
        const fish = new Sprite(loadedTextures[data.path]);

        // Special scale for fish 1 (it's too big)
        let scale;
        if (data.path === 'png_fish/1fish.png') {
            scale = Math.random() * 0.005 + 0.005; // 0.02 to 0.04 for fish 1
        } else {
            scale = Math.random() * 0.005 + 0.01; // 0.2 to 0.5 for other fish
        }

        fish.scale.set(scale);

        // Save flip info and original scale
        fish.flipRules = { left: data.flipLeft, right: data.flipRight };
        fish.originalScale = scale;

        // Initial position
        fish.x = Math.random() * app.screen.width;
        fish.y = Math.random() * app.screen.height;

        // Movement properties
        fish.speed = Math.random() * 1.5 + 0.5;
        fish.direction = Math.random() < 0.5 ? 1 : -1;

        container.addChild(fish);
        fishes.push(fish);
    }

    app.ticker.add(() => {
        fishes.forEach(fish => {
            const dx = fish.x - player.x;
            const dy = fish.y - player.y;
            const distance = Math.hypot(dx, dy);
            const safeDistance = 200;

            // Move fish away from player if too close
            if (distance < safeDistance) {
                fish.direction = dx > 0 ? 1 : -1;
                fish.x += fish.speed * 2 * fish.direction;
                fish.y += (dy > 0 ? 1 : -1) * fish.speed;
            } else {
                fish.x += fish.speed * fish.direction;
            }

            // Flip horizontally depending on direction and fish type
            if (fish.direction === -1) {
                fish.scale.x = fish.flipRules.left ? -fish.originalScale : fish.originalScale;
            } else {
                fish.scale.x = fish.flipRules.right ? -fish.originalScale : fish.originalScale;
            }

            // Vertical scale always positive (to avoid upside-down fish)
            fish.scale.y = fish.originalScale;

            // Wrap around screen edges
            if (fish.x > app.screen.width + 20) fish.x = -20;
            if (fish.x < -20) fish.x = app.screen.width + 20;
        });
    });

    return fishes;
}