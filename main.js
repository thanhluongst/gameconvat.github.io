function getViewSize() {
    if (window.visualViewport) {
        return { w: Math.round(window.visualViewport.width), h: Math.round(window.visualViewport.height) };
    }
    return { w: window.innerWidth, h: window.innerHeight };
}

const { w: initW, h: initH } = getViewSize();

const config = {
    type: Phaser.AUTO,
    width: initW,
    height: initH,
    backgroundColor: '#e0f7fa',
    parent: 'game-container',
    scene: [IntroScene, StageScene, MainScene, EndScene, AboutScene, TopWrongClicksScene, SettingsScene],
    physics: { default: 'arcade' },
    scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH }
};

const game = new Phaser.Game(config);

function handleResize() {
    const { w, h } = getViewSize();
    game.scale.resize(w, h);
}

window.addEventListener('resize', handleResize);
window.addEventListener('orientationchange', () => setTimeout(handleResize, 150));
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', handleResize);
}