const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight, // Trừ chiều cao header bar cố định 50px
    backgroundColor: '#e0f7fa',
    parent: 'game-container', // Render canvas vào div riêng
    scene: [IntroScene, StageScene, MainScene, EndScene, AboutScene, TopWrongClicksScene],
    physics: { default: 'arcade' },
    scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH }
};

const game = new Phaser.Game(config);
window.addEventListener('resize', () => game.scale.resize(window.innerWidth, window.innerHeight));