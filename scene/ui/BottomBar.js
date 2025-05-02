/**
 * Tạo/cập nhật bottom bar cho MainScene.
 * Nhận vào scene, trả về object chứa các text element.
 */
window.createBottomBar = function(scene) {
    const bottomBar = {};
    // 7% của chiều cao canvas
    var bottomHeight = Math.round(scene.sys.game.config.height * 0.07);
    var w = scene.sys.game.config.width;
    var h = scene.sys.game.config.height;

    var fontSize;
    if (w > h) {
        fontSize = Math.round(bottomHeight * 0.6);
    } else {
        fontSize = Math.round(w * 0.045);
    }
    bottomBar.bg = scene.add.rectangle(
        0,
        scene.sys.game.config.height - bottomHeight,
        scene.sys.game.config.width,
        bottomHeight,
        0x1976d2,
        0.95
    ).setOrigin(0, 0).setDepth(100);

    // Tính vị trí y để text nằm giữa bottom bar
    var textY = scene.sys.game.config.height - bottomHeight / 2;

    // Style text
    var textStyle = Object.assign({}, window.getGameTextStyle({}, scene), {
        fontSize: fontSize + 'px',
        align: 'right'
    });

    bottomBar.turnText = scene.add.text(
        40, // x
        textY,
        LANG.turnsLeft + ': 2',
        textStyle
    ).setOrigin(0, 0.5).setDepth(101);

    bottomBar.starText = scene.add.text(
        scene.sys.game.config.width - 40, // x: căn phải, cách lề phải 40px
        textY,
        '☆☆☆☆☆',
        textStyle
    ).setOrigin(1, 0.5).setDepth(101);

    return bottomBar;
};