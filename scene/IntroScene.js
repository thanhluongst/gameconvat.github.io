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

        // Thêm menu chọn ngôn ngữ, căn phải/trái để không bị chồng lấp
        const langBtnVi = this.add.text(w/2 - 20, 40, LANG.langVi, {
            fontSize: getResponsiveFont(this, 18),
            color: window.CURRENT_LANG === 'vi' ? '#1976d2' : '#555',
            backgroundColor: window.CURRENT_LANG === 'vi' ? '#fffbe7' : '#e3e3e3',
            padding: { left: 18, right: 18, top: 8, bottom: 8 },
            fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif",
            borderRadius: 12
        }).setOrigin(1, 0.5).setInteractive();
        const langBtnEn = this.add.text(w/2 + 20, 40, LANG.langEn, {
            fontSize: getResponsiveFont(this, 18),
            color: window.CURRENT_LANG === 'en' ? '#1976d2' : '#555',
            backgroundColor: window.CURRENT_LANG === 'en' ? '#fffbe7' : '#e3e3e3',
            padding: { left: 18, right: 18, top: 8, bottom: 8 },
            fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif",
            borderRadius: 12
        }).setOrigin(0, 0.5).setInteractive();
        langBtnVi.on('pointerdown', () => { window.setLang('vi'); this.scene.restart(); });
        langBtnEn.on('pointerdown', () => { window.setLang('en'); this.scene.restart(); });

        this.add.text(w/2, h/4, LANG.introTitle, { fontSize: getResponsiveFont(this, 14), color: '#333', fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif" }).setOrigin(0.5);
        this.add.text(w/2, h/4+50, LANG.introSubtitle, { fontSize: getResponsiveFont(this, 20), color: '#555', fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif" }).setOrigin(0.5);

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
        const aboutBtn = this.add.text(w/2, h - 60, LANG.aboutBtn, {
            fontSize: getResponsiveFont(this, 20),
            color: '#1976d2',
            backgroundColor: '#fff',
            fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif"
        }).setOrigin(0.5).setInteractive();
        aboutBtn.on('pointerdown', () => this.scene.start('AboutScene'));

        // Sau khi UI đã hiển thị, preload asset MainScene chạy nền (không ảnh hưởng UI)
        preloadMainSceneAssets(this);
        this.load.start();
    }
}

/**
 * Preload các asset cần cho MainScene (chạy nền).
 * @param {Phaser.Scene} scene
 */
function preloadMainSceneAssets(scene) {
    animalList.forEach(function (a) {
        if (!scene.textures.exists(a.key)) {
            scene.load.image(a.key, a.img);
        }
        if (!scene.cache.audio.exists(a.key + '_vi')) {
            scene.load.audio(a.key + '_vi', a.soundVi);
        }
        if (!scene.cache.audio.exists(a.key + '_en')) {
            scene.load.audio(a.key + '_en', a.soundEn);
        }
    });
    if (!scene.cache.audio.exists('bravo')) {
        scene.load.audio('bravo', 'assets/gamesound/bravo.mp3');
    }
    if (!scene.cache.audio.exists('wrong')) {
        scene.load.audio('wrong', 'assets/gamesound/wrong.mp3');
    }
    if (!scene.textures.exists('wrong_icon')) {
        scene.load.image('wrong_icon', 'assets/gameicons/wrong.png');
    }
    if (!scene.textures.exists('pause_icon')) {
        scene.load.image('pause_icon', 'assets/gameicons/pause.png');
    }
    if (!scene.textures.exists('resume_icon')) {
        scene.load.image('resume_icon', 'assets/gameicons/resume.png');
    }
    if (!scene.textures.exists('reload_icon')) {
        scene.load.image('reload_icon', 'assets/gameicons/reload.png');
    }
    if (!scene.textures.exists('home_icon')) {
        scene.load.image('home_icon', 'assets/gameicons/home.png');
    }
    if (!scene.textures.exists('back_icon')) {
        scene.load.image('back_icon', 'assets/gameicons/back.png');
    }
    // Nếu bạn cần preload thêm các asset khác cho MainScene, thêm ở đây
}