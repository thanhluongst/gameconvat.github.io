/**
 * End screen scene.
 * Hiển thị số sao đạt được, nút về trang chủ và sang màn tiếp theo.
 * Nhận vào: stars (số sao), mode (animal/fruit), stage (chỉ số stage hiện tại).
 */
class EndScene extends Phaser.Scene {
    constructor() { super('EndScene'); }
    init(data) {
        this.stars = data.stars || 0;
        this.mode = data.mode || 'animal';
        this.stage = typeof data.stage === 'number' ? data.stage : 0;
    }
    create() {
        const w = this.sys.game.config.width, h = this.sys.game.config.height;
        this.add.text(w/2, h/3, '⭐'.repeat(this.stars) + '☆'.repeat(5 - this.stars), {
            fontSize: getResponsiveFont(this, 8), color: '#fbc02d', fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif"
        }).setOrigin(0.5);
        this.add.text(w/2, h/2, LANG.completed, { fontSize: getResponsiveFont(this, 16), color: '#333', fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif" }).setOrigin(0.5);
        const homeBtn = this.add.text(w/2, h/2 + 80, '🏠 ' + LANG.home, { fontSize: getResponsiveFont(this, 20), color: '#1976d2', backgroundColor: '#fff', fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif" })
            .setOrigin(0.5).setInteractive();
        homeBtn.on('pointerdown', () => this.scene.start('IntroScene'));
        const nextBtn = this.add.text(w/2, h/2 + 140, '⏭️ ' + LANG.nextStage, { fontSize: getResponsiveFont(this, 20), color: '#388e3c', backgroundColor: '#fff', fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif" })
            .setOrigin(0.5).setInteractive();
        nextBtn.on('pointerdown', () => this.scene.start('StageScene', { mode: this.mode, stage: this.stage + 1 }));
    }
}