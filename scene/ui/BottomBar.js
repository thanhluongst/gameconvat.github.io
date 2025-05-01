/**
 * Tạo/cập nhật bottom bar cho MainScene.
 * Nhận vào scene, trả về object chứa các text element.
 */
window.createBottomBar = function(scene) {
    const bottomBar = {};
    var bottomHeight = 50;
    bottomBar.bg = scene.add.rectangle(0, scene.sys.game.config.height-bottomHeight, scene.sys.game.config.width, bottomHeight, 0x1976d2, 0.95).setOrigin(0, 0).setDepth(100);
    console.log(window.getGameTextStyle({}, scene))
    bottomBar.turnText = scene.add.text(20, scene.sys.game.config.height-bottomHeight+4, LANG.turnsLeft + ': 2', window.getGameTextStyle({}, scene)).setDepth(101);
    bottomBar.starText = scene.add.text(Math.round(scene.sys.game.config.width * 0.32), scene.sys.game.config.height-bottomHeight+4, '☆☆☆☆☆', window.getGameTextStyle({}, scene)).setDepth(101);
    return bottomBar;
};