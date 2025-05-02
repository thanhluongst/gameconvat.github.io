/**
 * Quản lý va chạm, di chuyển sprite động vật.
 */
window.CollisionManager = {
    handleSpriteMove: function(scene, sprite, delta) {
        let x = sprite.x + sprite.getData('vx') * delta / 1000, y = sprite.y + sprite.getData('vy') * delta / 1000;
        const halfW = sprite.displayWidth / 2, halfH = sprite.displayHeight / 2;
        var headerBarHeight = scene.headerBar && scene.headerBar.bg ? scene.headerBar.bg.height : 50;
        var bottomBarHeight = scene.bottomBar && scene.bottomBar.bg ? scene.bottomBar.bg.height : 40;
        var overlapRatio = typeof ANIMAL_OVERLAP_RATIO !== 'undefined' ? ANIMAL_OVERLAP_RATIO : 0.1;
        var allowedHeaderOverlap = halfH * overlapRatio;
        var allowedFooterOverlap = halfH * overlapRatio;
        if (x - halfW < 0 || x + halfW > scene.sys.game.config.width) sprite.setData('vx', -sprite.getData('vx'));
        if (y - halfH < headerBarHeight - allowedHeaderOverlap || y + halfH > scene.sys.game.config.height - bottomBarHeight + allowedFooterOverlap) sprite.setData('vy', -sprite.getData('vy'));
        sprite.x = Phaser.Math.Clamp(x, halfW, scene.sys.game.config.width - halfW);
        sprite.y = Phaser.Math.Clamp(y, headerBarHeight - allowedHeaderOverlap + halfH, scene.sys.game.config.height - bottomBarHeight + allowedFooterOverlap - halfH);
    },
    handleSpriteCollisions: function(sprites) {
        for (let i = 0; i < sprites.length; i++) for (let j = i + 1; j < sprites.length; j++) {
            const a = sprites[i], b = sprites[j];
            if (Phaser.Geom.Intersects.RectangleToRectangle(a.getBounds(), b.getBounds())) {
                const dx = b.x - a.x, dy = b.y - a.y, dist = Math.sqrt(dx*dx + dy*dy) || 1;
                var overlapRatio = typeof ANIMAL_OVERLAP_RATIO !== 'undefined' ? ANIMAL_OVERLAP_RATIO : 0.1;
                const minDist = (a.displayWidth + b.displayWidth) / 2 * (1 - overlapRatio), overlap = minDist - dist; // allow overlapRatio overlap
                if (overlap > 0) {
                    const pushX = (dx / dist) * (overlap / 2), pushY = (dy / dist) * (overlap / 2);
                    a.x -= pushX; a.y -= pushY; b.x += pushX; b.y += pushY;
                    // Clamp after push to keep inside header/bottom bar with overlapRatio overlap
                    var scene = a.scene || b.scene;
                    var headerBarHeight = scene.headerBar && scene.headerBar.bg ? scene.headerBar.bg.height : 50;
                    var bottomBarHeight = scene.bottomBar && scene.bottomBar.bg ? scene.bottomBar.bg.height : 40;
                    var allowedHeaderOverlapA = (a.displayHeight / 2) * overlapRatio;
                    var allowedFooterOverlapA = (a.displayHeight / 2) * overlapRatio;
                    var allowedHeaderOverlapB = (b.displayHeight / 2) * overlapRatio;
                    var allowedFooterOverlapB = (b.displayHeight / 2) * overlapRatio;
                    a.x = Phaser.Math.Clamp(a.x, a.displayWidth / 2, scene.sys.game.config.width - a.displayWidth / 2);
                    a.y = Phaser.Math.Clamp(a.y, headerBarHeight - allowedHeaderOverlapA + a.displayHeight / 2, scene.sys.game.config.height - bottomBarHeight + allowedFooterOverlapA - a.displayHeight / 2);
                    b.x = Phaser.Math.Clamp(b.x, b.displayWidth / 2, scene.sys.game.config.width - b.displayWidth / 2);
                    b.y = Phaser.Math.Clamp(b.y, headerBarHeight - allowedHeaderOverlapB + b.displayHeight / 2, scene.sys.game.config.height - bottomBarHeight + allowedFooterOverlapB - b.displayHeight / 2);
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