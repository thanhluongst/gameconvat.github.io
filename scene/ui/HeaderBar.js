/**
 * Tạo/cập nhật header bar cho MainScene.
 * Nhận vào scene, trả về object chứa các text element.
 */
window.createHeaderBar = function(scene) {
    const headerBar = {};
    // 7% của chiều cao canvas
    var headerHeight = Math.round(scene.sys.game.config.height * 0.07);
    var w = scene.sys.game.config.width;
    var h = scene.sys.game.config.height;
    // Điều chỉnh fontSize theo tỉ lệ width/height
    var fontSize;
    if (w > h) {
        fontSize = Math.round(headerHeight * 0.6);
    } else {
        fontSize = Math.round(w * 0.045);
    }

    headerBar.bg = scene.add.rectangle(0, 0, w, headerHeight, 0x1976d2, 0.95).setOrigin(0, 0).setDepth(100);

    // Tính toán vị trí các icon sát lề phải
    const iconY = headerHeight / 2;
    var iconSize, iconMargin;
    if (w > h) {
        iconSize = Math.round(headerHeight * 0.7);
        iconMargin = Math.round(headerHeight * 0.2);
    } else {
        iconSize = fontSize;
        iconMargin = Math.round(fontSize * 0.3);
    }
    const totalIcons = 4;
    const totalIconsWidth = totalIcons * iconSize + (totalIcons - 1) * iconMargin;
    let iconX = w - totalIconsWidth; // bắt đầu sát lề phải

    // Pause/Resume icon
    headerBar.pauseIcon = scene.add.image(iconX + iconSize / 2, iconY, 'pause_icon').setOrigin(0.5).setDisplaySize(iconSize, iconSize).setDepth(102).setInteractive();
    headerBar.pauseIcon.isPaused = false;
    iconX += iconSize + iconMargin;

    // Reload icon
    headerBar.reloadIcon = scene.add.image(iconX + iconSize / 2, iconY, 'reload_icon').setOrigin(0.5).setDisplaySize(iconSize, iconSize).setDepth(102).setInteractive();
    iconX += iconSize + iconMargin;

    // Home icon
    headerBar.homeIcon = scene.add.image(iconX + iconSize / 2, iconY, 'home_icon').setOrigin(0.5).setDisplaySize(iconSize, iconSize).setDepth(102).setInteractive();
    iconX += iconSize + iconMargin;

    // Back icon
    headerBar.backIcon = scene.add.image(iconX + iconSize / 2, iconY, 'back_icon').setOrigin(0.5).setDisplaySize(iconSize, iconSize).setDepth(102).setInteractive();

    // Các text: remainText -> correctText -> incorrectText (theo chiều ngang, sát nhau bên trái)
    var textY = headerHeight / 2;
    var margin = 16; // khoảng cách giữa các text

    var textStyleRemain = Object.assign({}, window.getGameTextStyle({bold: true}, scene), {
        fontSize: fontSize + 'px',
        align: 'center'
    });
    var textStyle = Object.assign({}, window.getGameTextStyle({}, scene), {
        fontSize: fontSize + 'px',
        align: 'center'
    });

    // remainText ở sát lề trái
    headerBar.remainText = scene.add.text(
        margin, textY, LANG.remain + ': 0/0', textStyleRemain
    ).setOrigin(0, 0.5).setDepth(101);

    // correctText sát bên phải remainText
    headerBar.correctText = scene.add.text(
        margin + headerBar.remainText.width + margin, textY, '✔️ 0 ' + LANG.correct, textStyle
    ).setOrigin(0, 0.5).setDepth(101);

    // incorrectText sát bên phải correctText
    headerBar.incorrectText = scene.add.text(
        margin + headerBar.remainText.width + margin + headerBar.correctText.width + margin, textY, '❌ 0 ' + LANG.incorrect, textStyle
    ).setOrigin(0, 0.5).setDepth(101);

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
        // Confirm trước khi về IntroScene
        if (window.confirm(LANG.confirmHome )) {
            if (scene.sound && scene.sound.stopAll) scene.sound.stopAll();
            scene.scene.start('IntroScene');
        }
    });

    // Back handler
    headerBar.backIcon.on('pointerdown', function() {
        // Confirm trước khi về StageScene
        if (window.confirm(LANG.confirmBack)) {
            if (scene.sound && scene.sound.stopAll) scene.sound.stopAll();
            scene.scene.start('StageScene', { mode: scene.mode });
        }
    });

    return headerBar;
};