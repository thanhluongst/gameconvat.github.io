window.AnimalSprites = {
    createSprites: function(scene, animals) {
        // Xóa sprite cũ nếu có
        if (scene.animalSprites && scene.animalSprites.length) {
            scene.animalSprites.forEach(function(s) { s.destroy(); });
        }
        scene.animalSprites = [];
        var headerBarHeight = 50;
        var bottomBarHeight = 40;

        // Random thứ tự các sprite trong array
        var shuffled = animals.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        var spriteSize = ANIMAL_MAX_SIZE;
        var spacing = ANIMAL_MAX_SIZE / 3;
        var canvasW = scene.sys.game.config.width;
        var canvasH = scene.sys.game.config.height;
        var availableW = canvasW;
        var availableH = canvasH - headerBarHeight - bottomBarHeight;

        // Số sprite mỗi hàng
        var spritesPerRow = Math.max(1, Math.floor(availableW / (spriteSize + spacing)));
        var rowCount = Math.ceil(shuffled.length / spritesPerRow);

        // Tính lại khoảng cách thực tế giữa các sprite để căn giữa grid
        var totalGridW = spritesPerRow * (spriteSize + spacing) - spacing;
        var offsetX = (canvasW - totalGridW) / 2;

        var totalGridH = rowCount * (spriteSize + spacing) - spacing;
        var offsetY = headerBarHeight + (availableH - totalGridH) / 2;

        shuffled.forEach(function(animal, i) {
            var row = Math.floor(i / spritesPerRow);
            var col = i % spritesPerRow;

            // Chính giữa từng ô trong grid
            var x = offsetX + col * (spriteSize + spacing) + spriteSize / 2;
            var y = offsetY + row * (spriteSize + spacing) + spriteSize / 2;

            var s = scene.add.image(x, y, animal.key).setInteractive();
            var maxDim = Math.max(s.width, s.height);
            if (maxDim > spriteSize) s.setScale(spriteSize / maxDim);
            s.setData('animalKey', animal.key);
            var speed = Phaser.Math.Between(ANIMAL_MIN_SPEED, ANIMAL_MAX_SPEED);
            var angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
            s.setData('vx', Math.cos(angle) * speed);
            s.setData('vy', Math.sin(angle) * speed);
            s.on('pointerdown', function() { scene.checkAnswer(animal.key); });
            // Thêm biến cho hiệu ứng lắc
            s.setData('shakePhase', Phaser.Math.FloatBetween(0, Math.PI * 2));
            s.setData('shakeSpeed', Phaser.Math.FloatBetween(1.2, 2.2));
            scene.animalSprites.push(s);
        });
    },
    updateSprites: function(scene) {
        if (!scene.animalSprites) return;
        var now = scene.time.now / 1000; // giây
        scene.animalSprites.forEach(function(s) {
            if (s.getData('animalKey') === scene.collisionDisabledSpriteKey) return;
            var x = s.x + s.getData('vx') * scene.game.loop.delta / 1000;
            var y = s.y + s.getData('vy') * scene.game.loop.delta / 1000;
            var halfW = s.displayWidth / 2, halfH = s.displayHeight / 2;
            if (x - halfW < 0 || x + halfW > scene.sys.game.config.width) s.setData('vx', -s.getData('vx'));
            if (y - halfH < 0 || y + halfH > scene.sys.game.config.height) s.setData('vy', -s.getData('vy'));
            s.x = Phaser.Math.Clamp(x, halfW, scene.sys.game.config.width - halfW);
            s.y = Phaser.Math.Clamp(y, halfH, scene.sys.game.config.height - halfH);
            // Hiệu ứng lắc qua lắc lại
            var shakePhase = s.getData('shakePhase');
            var shakeSpeed = s.getData('shakeSpeed');
            s.angle = Math.sin(now * shakeSpeed + shakePhase) * (typeof ANIMAL_SHAKE_DEGREE !== 'undefined' ? ANIMAL_SHAKE_DEGREE : 10); // lắc ±ANIMAL_SHAKE_DEGREE độ
        });
    },
    destroySprites: function(scene) {
        if (!scene.animalSprites) return;
        scene.animalSprites.forEach(function(s) { s.destroy(); });
        scene.animalSprites = [];
    }
};