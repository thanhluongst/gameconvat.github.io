/**
 * Quản lý va chạm, di chuyển sprite động vật.
 */
window.CollisionManager = {
    handleSpriteMove: function(scene, sprite, delta) {
        let x = sprite.x + sprite.getData('vx') * delta / 1000, y = sprite.y + sprite.getData('vy') * delta / 1000;
        const halfW = sprite.displayWidth / 2, halfH = sprite.displayHeight / 2;
        if (x - halfW < 0 || x + halfW > scene.sys.game.config.width) sprite.setData('vx', -sprite.getData('vx'));
        if (y - halfH < 0 || y + halfH > scene.sys.game.config.height) sprite.setData('vy', -sprite.getData('vy'));
        sprite.x = Phaser.Math.Clamp(x, halfW, scene.sys.game.config.width - halfW);
        sprite.y = Phaser.Math.Clamp(y, halfH, scene.sys.game.config.height - halfH);
    },
    handleSpriteCollisions: function(sprites) {
        for (let i = 0; i < sprites.length; i++) for (let j = i + 1; j < sprites.length; j++) {
            const a = sprites[i], b = sprites[j];
            if (Phaser.Geom.Intersects.RectangleToRectangle(a.getBounds(), b.getBounds())) {
                const dx = b.x - a.x, dy = b.y - a.y, dist = Math.sqrt(dx*dx + dy*dy) || 1;
                const minDist = (a.displayWidth + b.displayWidth) / 2 * 0.95, overlap = minDist - dist;
                if (overlap > 0) {
                    const pushX = (dx / dist) * (overlap / 2), pushY = (dy / dist) * (overlap / 2);
                    a.x -= pushX; a.y -= pushY; b.x += pushX; b.y += pushY;
                }
                a.setData('vx', -a.getData('vx'));
                a.setData('vy', -a.getData('vy'));
                b.setData('vx', -b.getData('vx'));
                b.setData('vy', -b.getData('vy'));
            }
        }
    }
    // ...bổ sung các hàm va chạm khác nếu cần...
};