// SettingsScene: Scene for changing app settings (language, sound mode)
// Allows user to select language and sound mode, saves to GameStorage
class SettingsScene extends Phaser.Scene {
    constructor() { super('SettingsScene'); }
    create() {
        const w = this.sys.game.config.width, h = this.sys.game.config.height;
        const settings = window.GameStorage ? window.GameStorage.loadAppSettings() : { lang: 'vi', soundMode: 'both' };
        let currentLang = settings.lang || 'vi';
        let currentSound = settings.soundMode || 'both';
        this.buttons = [];
        // Title
        this.add.text(w/2, 50, '⚙️ ' + (window.LANG && window.LANG.settingsTitle ? window.LANG.settingsTitle : 'Cài đặt / Settings'), {
            fontSize: getResponsiveFont(this, 12),
            color: '#1976d2',
            fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif"
        }).setOrigin(0.5);
        // Language select
        const langViBtn = this.add.text(w/2, 120, (window.LANG && window.LANG.langVi ? window.LANG.langVi : '🇻🇳 Tiếng Việt'), {
            fontSize: getResponsiveFont(this, 18),
            color: currentLang === 'vi' ? '#1976d2' : '#555',
            backgroundColor: currentLang === 'vi' ? '#fffbe7' : '#e3e3e3',
            padding: { left: 18, right: 18, top: 8, bottom: 8 },
            fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif"
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        langViBtn.on('pointerdown', () => { this.setLang('vi'); });
        this.buttons.push(langViBtn);
        const langEnBtn = this.add.text(w/2, 170, (window.LANG && window.LANG.langEn ? window.LANG.langEn : '🇺🇸 English'), {
            fontSize: getResponsiveFont(this, 18),
            color: currentLang === 'en' ? '#1976d2' : '#555',
            backgroundColor: currentLang === 'en' ? '#fffbe7' : '#e3e3e3',
            padding: { left: 18, right: 18, top: 8, bottom: 8 },
            fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif"
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        langEnBtn.on('pointerdown', () => { this.setLang('en'); });
        this.buttons.push(langEnBtn);
        // Sound mode select
        this.add.text(w/2, 240, (window.LANG && window.LANG.soundModeTitle ? window.LANG.soundModeTitle : 'Chế độ âm thanh / Sound mode'), {
            fontSize: getResponsiveFont(this, 16),
            color: '#333',
            fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif"
        }).setOrigin(0.5);
        const soundModes = [
            { key: 'both', label: (window.LANG && window.LANG.soundBoth) ? window.LANG.soundBoth : '🇬🇧+🇻🇳 Anh + Việt' },
            { key: 'en', label: (window.LANG && window.LANG.soundEn) ? window.LANG.soundEn : '🇬🇧 Chỉ Anh' },
            { key: 'vi', label: (window.LANG && window.LANG.soundVi) ? window.LANG.soundVi : '🇻🇳 Chỉ Việt' }
        ];
        soundModes.forEach((mode, idx) => {
            const btn = this.add.text(w/2, 290 + idx*50, mode.label, {
                fontSize: getResponsiveFont(this, 18),
                color: currentSound === mode.key ? '#1976d2' : '#555',
                backgroundColor: currentSound === mode.key ? '#fffbe7' : '#e3e3e3',
                padding: { left: 18, right: 18, top: 8, bottom: 8 },
                fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif"
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            btn.on('pointerdown', () => { this.setSoundMode(mode.key); });
            this.buttons.push(btn);
        });
        // Back button
        const backBtn = this.add.text(w/2, h-40, (window.LANG && window.LANG.aboutHomeBtn ? window.LANG.aboutHomeBtn : '🔙 Trang chủ'), {
            fontSize: getResponsiveFont(this, 20),
            color: '#1976d2',
            backgroundColor: '#fff',
            fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif"
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        backBtn.on('pointerdown', () => this.scene.start('IntroScene'));
        this.buttons.push(backBtn);
        // Enable input for all buttons
        this.input.topOnly = true;
        this.input.enabled = true;
        this.buttons.forEach(btn => btn.setInteractive({ useHandCursor: true }));
    }
    setLang(lang) {
        this._lang = lang;
        if (window.GameStorage) window.GameStorage.saveAppSettings({ lang: lang, soundMode: this._soundMode || (window.GameStorage ? window.GameStorage.loadAppSettings().soundMode : 'both') });
        if (window.setLang) window.setLang(lang);
        this.scene.restart();
    }
    setSoundMode(mode) {
        this._soundMode = mode;
        if (window.GameStorage) window.GameStorage.saveAppSettings({ lang: this._lang || (window.GameStorage ? window.GameStorage.loadAppSettings().lang : 'vi'), soundMode: mode });
        this.scene.restart();
    }
}
window.SettingsScene = SettingsScene;