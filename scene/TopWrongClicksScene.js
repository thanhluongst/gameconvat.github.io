// TopWrongClicksScene: Hiển thị top 10 con vật bị click sai nhiều nhất
class TopWrongClicksScene extends Phaser.Scene {
    constructor() { super('TopWrongClicksScene'); }
    create() {
        const w = this.sys.game.config.width, h = this.sys.game.config.height;
        this.add.text(w/2, 40, (window.LANG && window.LANG.topWrongTitle) ? window.LANG.topWrongTitle : 'Top 10 Sai Nhiều Nhất', {
            fontSize: getResponsiveFont(this, 10),
            color: '#d32f2f',
            fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif"
        }).setOrigin(0.5);
        const topList = window.GameStorage ? window.GameStorage.getTopWrongClicks(10) : [];
        // Tìm số stage và mapping animal key -> stage(s)
        let animalStageMap = {};
        const sourceList = animalList;
        const perStage = typeof ANIMAL_MAX_RANDOM !== 'undefined' ? ANIMAL_MAX_RANDOM : 8;
        const totalStage = Math.ceil(sourceList.length / perStage);
        for (let s = 0; s < totalStage; s++) {
            const chunk = sourceList.slice(s * perStage, (s + 1) * perStage);
            chunk.forEach(a => {
                if (!animalStageMap[a.key]) animalStageMap[a.key] = [];
                animalStageMap[a.key].push(s + 1); // stage is 1-based
            });
        }
        for (let i = 0; i < topList.length; i++) {
            const item = topList[i];
            let nameVi = item.key, nameEn = '';
            let found = animalList.find(a => a.key === item.key);
            if (found) { nameVi = found.nameVi; nameEn = found.nameEn; }
            // Lấy stage(s) chứa animal này
            let stages = animalStageMap[item.key] || [];
            let stageStr = stages.length ? ` [${stages.map(s => (window.LANG && window.LANG.stageLabel ? window.LANG.stageLabel.replace('{num}', s.toString().padStart(2, '0')) : 'Stage ' + s)).join(', ')}]` : '';
            this.add.text(
                40, // align left, margin 40px
                100 + i*48,
                `${i+1}. ${nameEn} / ${nameVi}  -  ${item.count} ${(window.LANG && window.LANG.incorrect) ? window.LANG.incorrect.toLowerCase() : 'lần sai'}${stageStr}`,
                {
                    fontSize: getResponsiveFont(this, 18),
                    color: '#333',
                    fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif",
                    align: 'left',
                    wordWrap: { width: w - 80 }
                }
            ).setOrigin(0, 0);
        }
        // Nút quay về (localization)
        const backBtnText = (window.LANG && window.LANG.aboutHomeBtn) ? window.LANG.aboutHomeBtn : '🔙 Quay lại';
        const backBtn = this.add.text(w/2, h-40, backBtnText, {
            fontSize: getResponsiveFont(this, 20),
            color: '#1976d2',
            backgroundColor: '#fff',
            fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif"
        }).setOrigin(0.5).setInteractive();
        backBtn.on('pointerdown', () => this.scene.start('StageScene', { mode: 'animal' }));
    }
}
window.TopWrongClicksScene = TopWrongClicksScene;
