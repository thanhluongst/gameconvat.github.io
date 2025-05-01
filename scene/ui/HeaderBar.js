/**
 * Tạo/cập nhật header bar cho MainScene.
 * Nhận vào scene, trả về object chứa các text element.
 */
window.createHeaderBar = function(scene) {
    const headerBar = {};
    var headerHeight = 50;
    headerBar.bg = scene.add.rectangle(0, 0, scene.sys.game.config.width, headerHeight, 0x1976d2, 0.95).setOrigin(0, 0).setDepth(100);

    // Thêm các icon bên trái tận cùng (sát lề trái)
    const iconY = headerHeight / 2;
    const iconSize = 32;
    let iconX = 0; // bắt đầu sát lề trái

    // Pause/Resume icon
    headerBar.pauseIcon = scene.add.image(iconX + iconSize / 2, iconY, 'pause_icon').setOrigin(0.5).setDisplaySize(iconSize, iconSize).setDepth(102).setInteractive();
    headerBar.pauseIcon.isPaused = false;
    iconX += iconSize;

    // Reload icon
    headerBar.reloadIcon = scene.add.image(iconX + iconSize / 2, iconY, 'reload_icon').setOrigin(0.5).setDisplaySize(iconSize, iconSize).setDepth(102).setInteractive();
    iconX += iconSize;

    // Home icon
    headerBar.homeIcon = scene.add.image(iconX + iconSize / 2, iconY, 'home_icon').setOrigin(0.5).setDisplaySize(iconSize, iconSize).setDepth(102).setInteractive();
    iconX += iconSize;

    // Back icon
    headerBar.backIcon = scene.add.image(iconX + iconSize / 2, iconY, 'back_icon').setOrigin(0.5).setDisplaySize(iconSize, iconSize).setDepth(102).setInteractive();
    iconX += iconSize;

    // Các text (dịch sang phải sau các icon)
    const textStartX = iconX + 12;
    headerBar.remainText = scene.add.text(textStartX, Math.round(headerHeight * 0.18), LANG.remain + ': 0/0', window.getGameTextStyle({bold: true}, scene)).setDepth(101);
    headerBar.correctText = scene.add.text(Math.round(scene.sys.game.config.width * 0.32), Math.round(headerHeight * 0.18), '✔️ 0 ' + LANG.correct, window.getGameTextStyle({}, scene)).setDepth(101);
    headerBar.incorrectText = scene.add.text(Math.round(scene.sys.game.config.width * 0.6), Math.round(headerHeight * 0.18), '❌ 0 ' + LANG.incorrect, window.getGameTextStyle({}, scene)).setDepth(101);

    // Pause/Resume handler
    headerBar.pauseIcon.on('pointerdown', function() {
        headerBar.pauseIcon.isPaused = !headerBar.pauseIcon.isPaused;
        if (headerBar.pauseIcon.isPaused) {
            headerBar.pauseIcon.setTexture('resume_icon');
            scene.isPaused = true;
            // Pause all sounds
            if (scene.sound && scene.sound.pauseAll) scene.sound.pauseAll();
        } else {
            headerBar.pauseIcon.setTexture('pause_icon');
            scene.isPaused = false;
            // Resume all sounds
            if (scene.sound && scene.sound.resumeAll) scene.sound.resumeAll();
        }
    });

    // Reload handler
    headerBar.reloadIcon.on('pointerdown', function() {
        // Hiện confirm, dùng window.confirm đơn giản
        if (window.confirm(LANG.confirmReset || 'Bạn có muốn chơi lại màn này không?')) {
            scene.scene.restart();
        }
    });

    // Home handler
    headerBar.homeIcon.on('pointerdown', function() {
        scene.scene.start('IntroScene');
    });

    // Back handler
    headerBar.backIcon.on('pointerdown', function() {
        scene.scene.start('StageScene', { mode: scene.mode });
    });

    return headerBar;
};