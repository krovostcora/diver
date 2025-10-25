import { Graphics } from 'pixi.js';

export default function Fish(container, app, player) {
    if (!player) {
        console.error("❌ Player is missing in Fish()");
        return;
    }

    const fishes = [];
    const fishCount = 10;

    for (let i = 0; i < fishCount; i++) {
        const fish = new Graphics();

        const color = Math.random() * 0xffffff;
        const radius = Math.random() * 10 + 10;

        fish.beginFill(color);
        fish.drawCircle(0, 0, radius);
        fish.endFill();

        fish.x = Math.random() * app.screen.width;
        fish.y = Math.random() * app.screen.height;

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

            if (distance < safeDistance) {
                fish.direction = dx > 0 ? 1 : -1;
                fish.x += fish.speed * 2 * fish.direction;
                fish.y += (dy > 0 ? 1 : -1) * fish.speed;
            } else {
                fish.x += fish.speed * fish.direction;
            }

            fish.scale.x = fish.direction;

            if (fish.x > app.screen.width + 20) fish.x = -20;
            if (fish.x < -20) fish.x = app.screen.width + 20;
        });
    });

    return fishes;
}
