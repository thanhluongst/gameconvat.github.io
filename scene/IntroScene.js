/**
 * Intro scene.
 * Cho phép người chơi chọn chủ đề (animal/fruit), chuyển sang StageScene.
 */
class IntroScene extends Phaser.Scene {
    constructor() { super('IntroScene'); }
    preload() {
        this.load.image('animal_icon', animalList[0].img);
        this.load.image('fruit_icon', 'assets/fruit.png'); // Thêm ảnh placeholder nếu có
        // Preload các frame loading qua hàm tiện ích
        if (window.preloadLoadingGifFrames) {
            window.preloadLoadingGifFrames(this);
        }
    }
    create() {
        const w = this.sys.game.config.width, h = this.sys.game.config.height;
        this.add.text(w/2, h/4, LANG.introTitle, { fontSize: getResponsiveFont(this, 12), color: '#333', fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif" }).setOrigin(0.5);
        this.add.text(w/2, h/4+50, LANG.introSubtitle, { fontSize: getResponsiveFont(this, 18), color: '#555', fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif" }).setOrigin(0.5);

        // Tạo nút animal và fruit, sau đó căn text dựa vào chiều cao thực tế của ảnh
        const animalBtn = this.add.image(w/2 - 120, h/2, 'animal_icon').setInteractive().setScale(0.5);
        const fruitBtn = this.add.image(w/2 + 120, h/2, 'fruit_icon').setInteractive().setScale(0.5);

        // Sau khi ảnh đã load xong, mới vẽ text bên dưới
        animalBtn.once('texturekeychange', placeTexts, this);
        fruitBtn.once('texturekeychange', placeTexts, this);

        // Nếu texture đã sẵn sàng (do cache), gọi luôn
        if (animalBtn.texture && animalBtn.texture.key !== '__MISSING') placeTexts.call(this);

        function placeTexts() {
            // Lấy chiều cao thực tế của ảnh đã scale
            const animalImgHeight = animalBtn.displayHeight;
            const fruitImgHeight = fruitBtn.displayHeight;
            // Đặt text cách đáy ảnh 20px
            this.add.text(w/2 - 120, h/2 + animalImgHeight/2 + 20, LANG.animal, {
                fontSize: getResponsiveFont(this, 24),
                color: '#222',
                fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif"
            }).setOrigin(0.5);
            this.add.text(w/2 + 120, h/2 + fruitImgHeight/2 + 20, LANG.fruit, {
                fontSize: getResponsiveFont(this, 24),
                color: '#222',
                fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif"
            }).setOrigin(0.5);
        }

        animalBtn.on('pointerdown', () => this.scene.start('StageScene', { mode: 'animal' }));
        fruitBtn.on('pointerdown', () => this.scene.start('StageScene', { mode: 'fruit' }));

        // Thêm nút "Giới thiệu" ở dưới cùng màn hình
        const aboutBtn = this.add.text(w/2, h - 60, 'ℹ️ Giới thiệu', {
            fontSize: getResponsiveFont(this, 20),
            color: '#1976d2',
            backgroundColor: '#fff',
            fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif"
        }).setOrigin(0.5).setInteractive();
        aboutBtn.on('pointerdown', () => this.scene.start('AboutScene'));
    }
}