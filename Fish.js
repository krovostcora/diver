import { Graphics } from 'pixi.js';

export default function Fish(container, app) {
    const fishes = [];
    const fishCount = 13;

    for (let i = 0; i < fishCount; i++) {
        const fish = new Graphics();

        const color = Math.random() * 0xffffff;

        fish.beginFill(color);
        fish.drawCircle(0, 0, Math.random() * 15 + 10); // різний розмір рибок
        fish.endFill();

        fish.x = Math.random() * app.screen.width;
        fish.y = Math.random() * app.screen.height;

        fish.speed = Math.random() * 1.5 + 0.5;
        fish.direction = Math.random() < 0.5 ? 1 : -1;

        container.addChild(fish);
        fishes.push(fish);
    }

    // Анімація рибок
    app.ticker.add(() => {
        fishes.forEach(fish => {
            fish.x += fish.speed;

            // Якщо рибка вилетіла за край — повертаємо з іншого боку
            if (fish.x > app.screen.width + 20) {
                fish.x = -20;
            } else if (fish.x < -20) {
                fish.x = app.screen.width + 20;
            }
        });
    });

    return fishes;
}
