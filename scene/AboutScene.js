/**
 * About scene.
 * Hiển thị thông tin tác giả và nút quay về trang chủ.
 */
class AboutScene extends Phaser.Scene {
    constructor() { super('AboutScene'); }
    create() {
        const w = this.sys.game.config.width, h = this.sys.game.config.height;
        this.add.text(w/2, 40, LANG.about, {
            fontSize: getResponsiveFont(this, 10),
            color: '#1976d2',
            fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif"
        }).setOrigin(0.5);

        this.add.text(w/2, h/2, LANG.aboutAuthor, {
            fontSize: getResponsiveFont(this, 16),
            color: '#333',
            fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif"
        }).setOrigin(0.5);

        // Đặt homeBtn sát đáy canvas, cách 40px
        const homeBtn = this.add.text(w/2, h - 40, LANG.aboutHomeBtn, {
            fontSize: getResponsiveFont(this, 20),
            color: '#1976d2',
            backgroundColor: '#fff',
            fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif"
        }).setOrigin(0.5).setInteractive();

        homeBtn.on('pointerdown', () => this.scene.start('IntroScene'));
    }
}
window.AboutScene = AboutScene;
