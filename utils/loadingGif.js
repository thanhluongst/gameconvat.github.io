/**
 * Hiển thị loading.gif ở giữa màn hình, trả về object chứa image và hàm destroy.
 * @param {Phaser.Scene} scene
 * @returns {{ imgObj: Phaser.GameObjects.Image, destroy: function }}
 */
window.showLoadingText = function(scene) {
    const w = scene.sys.game.config.width;
    const h = scene.sys.game.config.height;

    // Danh sách các frame đã preload
    const frames = ['loading_1', 'loading_2', 'loading_3', 'loading_4'];
    let currentFrame = 0;

    // Tạo image với frame đầu tiên
    const imgObj = scene.add.image(w / 2, h / 2, frames[0]).setOrigin(0.5);
    imgObj.setDisplaySize(200, 200);

    // Tạo timer để đổi frame liên tục
    const timer = scene.time.addEvent({
        delay: 120, // ms mỗi frame
        loop: true,
        callback: () => {
            currentFrame = (currentFrame + 1) % frames.length;
            imgObj.setTexture(frames[currentFrame]);
        }
    });

    return {
        imgObj,
        destroy: function() {
            if (timer) timer.remove();
            if (imgObj && imgObj.destroy) imgObj.destroy();
        }
    };
};
window.hideLoadingText = function(loadingHelper) {
    if (loadingHelper && loadingHelper.destroy) loadingHelper.destroy();
};

/**
 * Preload các frame loading gif cho scene.
 * @param {Phaser.Scene} scene
 */
window.preloadLoadingGifFrames = function(scene) {
    scene.load.image('loading_1', 'assets/gameicons/loading_1.png');
    scene.load.image('loading_2', 'assets/gameicons/loading_2.png');
    scene.load.image('loading_3', 'assets/gameicons/loading_3.png');
    scene.load.image('loading_4', 'assets/gameicons/loading_4.png');
};