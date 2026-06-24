/**
 * Stage selection scene.
 * Hiển thị danh sách các stage (mỗi stage là một card với hình đại diện và tên stage).
 * Hình đại diện là ảnh chính giữa của chuỗi animal/fruit trong stage đó.
 * Responsive: tự động tính số card trên mỗi hàng và căn giữa.
 */
class StageScene extends Phaser.Scene {
    constructor() { super('StageScene'); }
    init(data) {
        this.mode = data && data.mode ? data.mode : 'animal';
    }
    preload() {
        // Hiển thị loading gif khi đang load
        this.loadingHelper = window.showLoadingText(this);

        // Load all possible animal/fruit images for stage cards
        const sourceList = this.mode === 'animal' ? animalList : (window.fruitList || []);
        sourceList.forEach(a => {
            if (!this.textures.exists(a.key)) {
                this.load.image(a.key, a.img);
            }
        });

        // Nếu muốn preload thêm mp3 cho stage, có thể thêm ở đây
        // (Không cần thiết cho StageScene, chỉ MainScene mới cần preload mp3)
    }
    create() {
        // Xóa loading text nếu có
        if (this.loadingHelper) {
            this.loadingHelper.destroy();
            this.loadingHelper = null;
        }

        const sourceList = this.mode === 'animal' ? animalList : (window.fruitList || []);
        const total = sourceList.length;
        const perStage = ANIMAL_MAX_RANDOM;
        const totalStage = Math.ceil(total / perStage);
        const w = this.sys.game.config.width;
        const h = this.sys.game.config.height;
        const cardWidth = Math.min(140, Math.max(90, Math.floor(w / 7)));
        const cardHeight = Math.floor(cardWidth * 1.25);
        const margin = Math.max(16, Math.floor(cardWidth * 0.15));
        const cardsPerRow = Math.max(1, Math.floor((w - margin) / (cardWidth + margin)));
        const totalRows = Math.ceil(totalStage / cardsPerRow);
        // Đặt text chọn stage lên cao hơn và setDepth lớn để không bị che
        const selectStageText = this.add.text(w/2, 30, LANG.selectStage, {
            fontSize: getResponsiveFont(this, 18),
            color: '#333',
            fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif"
        }).setOrigin(0.5).setScrollFactor(0);
        selectStageText.setDepth(1000);
        for (let i = 0; i < totalStage; i++) {
            const row = Math.floor(i / cardsPerRow);
            const col = i % cardsPerRow;
            // Căn giữa các card trên mỗi hàng
            const cardsInThisRow = (row === totalRows - 1 && totalStage % cardsPerRow !== 0) ? totalStage % cardsPerRow : cardsPerRow;
            const rowOffset = (w - (cardsInThisRow * cardWidth + (cardsInThisRow - 1) * margin)) / 2;
            const x = rowOffset + cardWidth/2 + col * (cardWidth + margin);
            // Đặt các card thấp xuống để tránh che text
            const y = 200 + row * (cardHeight + margin);
            // Lấy chuỗi animal/fruit cho stage này
            const startIdx = i * perStage;
            const endIdx = Math.min(startIdx + perStage, total);
            const chunk = sourceList.slice(startIdx, endIdx);
            // Lấy ảnh chính giữa chuỗi
            let midIdx = 0;
            if (chunk.length > 0) {
                midIdx = Math.floor((chunk.length - 1) / 2);
            }
            const midImgKey = chunk[midIdx] ? chunk[midIdx].key : null;
            // Card background bo tròn góc
            const borderRadius = 18;
            const cardGraphics = this.add.graphics();
            cardGraphics.fillStyle(0xffffff, 0.95);
            cardGraphics.lineStyle(2, 0x1976d2, 1);
            cardGraphics.strokeRoundedRect(x - cardWidth/2, y - cardHeight/2, cardWidth, cardHeight, borderRadius);
            cardGraphics.fillRoundedRect(x - cardWidth/2, y - cardHeight/2, cardWidth, cardHeight, borderRadius);
            // Ảnh đại diện
            let img = null;
            if (midImgKey) {
                img = this.add.image(x, y - cardHeight/6, midImgKey);
                img.setDisplaySize(cardWidth - 24, cardWidth - 24);
            }
            // Tên stage
            const stageNum = (i+1).toString().padStart(2, '0');
            const label = this.add.text(
                x,
                y + cardHeight/2 - 32,
                LANG.stageLabel.replace('{num}', stageNum),
                {
                    fontSize: '20px',
                    color: '#1976d2',
                    fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif"
                }
            ).setOrigin(0.5);
            // Hiển thị số sao đã đạt được ở dưới cùng card
            let savedStars = 0;
            if (window.GameStorage && typeof window.GameStorage.loadStageStars === 'function') {
                savedStars = window.GameStorage.loadStageStars(this.mode, i);
            }
            const starsToShow = (typeof savedStars === 'number' && savedStars >= 1 && savedStars <= 5) ? savedStars : 0;
            if (starsToShow > 0) {
                this.add.text(
                    x,
                    y + cardHeight/2 - 8, // sát đáy card
                    '★'.repeat(starsToShow) + '☆'.repeat(5 - starsToShow),
                    {
                        fontSize: '18px',
                        color: '#fbc02d',
                        fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif"
                    }
                ).setOrigin(0.5);
            }
            // Tạo vùng tương tác
            const hitZone = this.add.zone(x, y, cardWidth, cardHeight).setRectangleDropZone(cardWidth, cardHeight).setInteractive();

            // Mouse over/out effect cho toàn bộ card
            hitZone.on('pointerover', () => {
                // Đổi màu nền card
                cardGraphics.clear();
                cardGraphics.strokeRoundedRect(x - cardWidth/2, y - cardHeight/2, cardWidth, cardHeight, borderRadius);
                cardGraphics.fillRoundedRect(x - cardWidth/2, y - cardHeight/2, cardWidth, cardHeight, borderRadius);
                // Đổi màu text
                // Scale img và text lên 180%
                let scaletoset = 1.8
                if (img) img.setScale(scaletoset * (cardWidth - 24) / img.width);
                if (img) img.setDepth(999);
            });
            hitZone.on('pointerout', () => {
                // Trả về màu nền ban đầu
                cardGraphics.clear();
                cardGraphics.strokeRoundedRect(x - cardWidth/2, y - cardHeight/2, cardWidth, cardHeight, borderRadius);
                cardGraphics.fillRoundedRect(x - cardWidth/2, y - cardHeight/2, cardWidth, cardHeight, borderRadius);
                // Trả về màu text ban đầu
                // Scale img và text về 100%
                if (img) img.setScale((cardWidth - 24) / img.width);
            });

            hitZone.on('pointerdown', () => {
                this.scene.start('MainScene', { mode: this.mode, stage: i });
            });
        }
        // Bật cuộn dọc nếu nội dung vượt chiều cao màn hình
        const contentBottom = 200 + totalRows * (cardHeight + margin) + 80;
        if (contentBottom > h) {
            this.cameras.main.setBounds(0, 0, w, contentBottom);
            this.add.text(w / 2, 58, '↕ Vuốt lên/xuống để xem thêm stage', {
                fontSize: getResponsiveFont(this, 36), color: '#999',
                fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif"
            }).setOrigin(0.5).setScrollFactor(0).setDepth(999);

            let startY = 0, didDrag = false;
            this.input.on('pointerdown', p => { startY = p.y; didDrag = false; });
            this.input.on('pointermove', p => {
                if (!p.isDown) return;
                if (Math.abs(p.y - startY) > 8) didDrag = true;
                if (!didDrag) return;
                const cam = this.cameras.main;
                cam.scrollY = Phaser.Math.Clamp(cam.scrollY - (p.velocity.y * 0.4), 0, contentBottom - h);
            });
        }

        // Thêm nút Top Wrong (Sai nhiều nhất) ở cạnh dưới màn hình, trên aboutHomeBtn
        const topWrongBtn = this.add.text(
            w / 2,
            h - 60,
            window.LANG && window.LANG.topWrongBtn ? window.LANG.topWrongBtn : '🔝 Top Sai Nhiều',
            {
                fontSize: getResponsiveFont(this, 20),
                color: '#d32f2f',
                backgroundColor: '#fff',
                fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif"
            }
        ).setOrigin(0.5).setInteractive();
        topWrongBtn.on('pointerdown', () => this.scene.start('TopWrongClicksScene'));
        topWrongBtn.setScrollFactor(0);

        // Thêm nút "aboutHomeBtn" ở cạnh dưới màn hình
        const aboutHomeBtn = this.add.text(
            w / 2,
            h - 20,
            window.LANG.aboutHomeBtn,
            {
                fontSize: getResponsiveFont(this, 20),
                color: '#1976d2',
                backgroundColor: '#fff',
                fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif"
            }
        ).setOrigin(0.5).setInteractive();
        aboutHomeBtn.on('pointerdown', () => this.scene.start('IntroScene'));
        aboutHomeBtn.setScrollFactor(0);
    }
}