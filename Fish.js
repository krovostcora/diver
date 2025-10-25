import { Graphics } from 'pixi.js';

export default function Fish(container, app) {
    const fishes = [];
    const fishCount = 13;

    for (let i = 0; i < fishCount; i++) {
        const fish = new Graphics();

        // Малюємо кружечок — рибка 🙂
        fish.beginFill(0x00aaff);
        fish.drawCircle(0, 0, 15);
        fish.endFill();

        // Рандомне розташування
        fish.x = Math.random() * app.screen.width;
        fish.y = Math.random() * app.screen.height;

        // Рандомна швидкість та напрямок
        fish.speed = (Math.random() * 2 + 1) * (Math.random() < 0.5 ? 1 : -1);

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
