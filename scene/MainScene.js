/**
 * Main game scene for animal/fruit selection and gameplay.
 * Handles game logic, UI, user interaction, scoring, and stage/chunk logic.
 * - Each stage is a chunk of ANIMAL_MAX_RANDOM images from the full list.
 * - Supports pause/resume, header bar, bottom bar, and end screen transition.
 * - See cau truc game.prompt.md for overall game design.
 */

function MainScene() {
    Phaser.Scene.call(this, { key: 'MainScene' });
    this.animalSprites = [];
}

MainScene.prototype = Object.create(Phaser.Scene.prototype);
MainScene.prototype.constructor = MainScene;

MainScene.prototype.init = function (data) {
    this.mode = data && data.mode ? data.mode : 'animal';
    this.stage = data && typeof data.stage === 'number' ? data.stage : 0;
};

MainScene.prototype.preload = function () {
    animalList.forEach(function (a) {
        this.load.image(a.key, a.img);
        this.load.audio(a.key + '_vi', a.soundVi);
        this.load.audio(a.key + '_en', a.soundEn);
    }, this);
    this.load.audio('bravo', 'assets/gamesound/bravo.mp3');
    this.load.audio('wrong', 'assets/gamesound/wrong.mp3');
    // Preload wrong icon image
    this.load.image('wrong_icon', 'assets/gameicons/wrong.png');
    
    this.load.image('pause_icon', 'assets/gameicons/pause.png');
    this.load.image('resume_icon', 'assets/gameicons/resume.png');
    this.load.image('reload_icon', 'assets/gameicons/reload.png');
    this.load.image('home_icon', 'assets/gameicons/home.png');
    this.load.image('back_icon', 'assets/gameicons/back.png');
};

MainScene.prototype.create = function () {
    var sourceList = this.mode === 'animal' ? animalList : (window.fruitList || []);
    this.playingAnimals = window.AnimalManager.getStageAnimals(sourceList, this.stage, ANIMAL_MAX_RANDOM);
    this.repeatSoundTimer = null;
    this.collisionDisabledSpriteKey = null;
    this.correctCount = 0;
    this.incorrectCount = 0;
    this.isPaused = false;
    this.turnTries = 2;
    this.turnIncorrectCounted = false;
    this.headerBar = window.createHeaderBar(this);
    this.bottomBar = window.createBottomBar(this);
    window.AnimalSprites.createSprites(this, this.playingAnimals);
    this.scale.on('resize', this.handleResize, this);
    this.askAnimal();
};

MainScene.prototype.getStarString = function () {
    var total = this.correctCount + this.incorrectCount;
    var percent = total === 0 ? 100 : (this.correctCount / total) * 100;
    var stars = 0;
    if (percent >= 90) stars = 5;
    else if (percent >= 70) stars = 4;
    else if (percent >= 50) stars = 3;
    else if (percent >= 30) stars = 2;
    else if (percent >= 10) stars = 1;
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
};

MainScene.prototype.updateHeaderBar = function () {
    if (!this.headerBar) return;
    // Cập nhật các text element của header bar nếu có
    if (this.headerBar.remainText) {
        var remain = this.playingAnimals.length - 1;
        var total = ANIMAL_MAX_RANDOM;
        this.headerBar.remainText.setText(LANG.remain + ': ' + remain + '/' + total);
    }
    if (this.headerBar.correctText) {
        this.headerBar.correctText.setText('✔️ ' + this.correctCount + ' ' + LANG.correct);
    }
    if (this.headerBar.incorrectText) {
        this.headerBar.incorrectText.setText('❌ ' + this.incorrectCount + ' ' + LANG.incorrect);
    }
};

MainScene.prototype.updateBottomBar = function () {
    if (!this.bottomBar) return;
    if (this.bottomBar.turnText) {
        this.bottomBar.turnText.setText(LANG.turnsLeft + ': ' + this.turnTries);
    }
    if (this.bottomBar.starText) {
        this.bottomBar.starText.setText(this.getStarString());
    }
};

MainScene.prototype.handleResize = function (gameSize) {
    // Responsive header bar
    if (this.headerBar && this.headerBar.bg) {
        this.headerBar.bg.width = gameSize.width;
    }
    // Responsive font size theo width và height màn hình
    var minDim = Math.min(gameSize.width, gameSize.height);
    var headerFont = Math.max(14, Math.round(minDim / 28));
    if (this.headerBar && this.headerBar.remainText) {
        this.headerBar.remainText.x = 20;
        this.headerBar.remainText.y = 10;
        this.headerBar.remainText.setFontSize(headerFont);
    }
    if (this.headerBar && this.headerBar.correctText) {
        this.headerBar.correctText.x = Math.round(gameSize.width * 0.32);
        this.headerBar.correctText.y = 10;
        this.headerBar.correctText.setFontSize(headerFont);
    }
    if (this.headerBar && this.headerBar.incorrectText) {
        this.headerBar.incorrectText.x = Math.round(gameSize.width * 0.6);
        this.headerBar.incorrectText.y = 10;
        this.headerBar.incorrectText.setFontSize(headerFont);
    }


    // Responsive animal sprites
    window.AnimalSprites.updateSprites(this);
};

MainScene.prototype.update = function (time, delta) {
    if (this.isPaused) return;
    window.AnimalSprites.updateSprites(this);
    var sprites = this.animalSprites.filter(function (s) {
        return s.getData('animalKey') !== this.collisionDisabledSpriteKey;
    }, this);
    window.CollisionManager.handleSpriteCollisions(sprites);
};

MainScene.prototype.askAnimal = function () {
    var animal = window.AnimalManager.getRandomAnimal(this.playingAnimals);
    this.currentAnswer = animal.key;
    var self = this;
    function playSounds() {
        window.SoundManager.playAnimalSounds(self, animal);
    }
    playSounds();
    if (this.repeatSoundTimer) this.repeatSoundTimer.remove(false);
    this.repeatSoundTimer = this.time.addEvent({
        delay: REPEAT_SOUND_DELAY, loop: true,
        callback: function () { if (self.currentAnswer === animal.key) playSounds(); }
    });
    this.turnTries = 2;
    this.turnIncorrectCounted = false;
    this.updateBottomBar();
};

MainScene.prototype.checkAnswer = function (key) {
    if (key !== this.currentAnswer) {
        // Hiển thị backdrop và icon sai ở giữa màn hình, flash 1s
        var w = this.sys.game.config.width, h = this.sys.game.config.height;
        // màu backdrop: lần cuối (turnTries==0) thì đen, còn lại thì vàng nhạt
        var isLastTry = !(this.turnTries > 0);
        var backdropColor = isLastTry ? 0x000000 : 0x0fff;
        var backdropAlpha = isLastTry ? 0.45 : 0.8;
        var backdrop = this.add.rectangle(w / 2, h / 2, w, h, backdropColor, backdropAlpha).setDepth(1999);
        var wrongIcon = this.add.image(w / 2, h / 2, 'wrong_icon').setDepth(2000);
        wrongIcon.setScale(Math.min(w, h) / 300);
        this.tweens.add({
            targets: [backdrop, wrongIcon],
            alpha: { from: 1, to: 0 },
            duration: 1000,
            onComplete: function () {
                backdrop.destroy();
                wrongIcon.destroy();
            }
        });

        if (this.turnTries > 0) {
            this.turnTries--;
            this.updateBottomBar();
            if (this.turnTries === 0 && !this.turnIncorrectCounted) {
                this.incorrectCount++;
                this.turnIncorrectCounted = true;
                this.updateHeaderBar();
            }
            window.SoundManager.playWrong(this);
            return;
        } else {
            window.SoundManager.playWrong(this);
            return;
        }
    }
    if (!this.turnIncorrectCounted) {
        this.correctCount++;
    }
    this.updateHeaderBar();
    this.turnTries = 2;
    this.turnIncorrectCounted = false;
    this.updateBottomBar();
    var animalIdx = this.playingAnimals.findIndex(function (a) { return a.key === key; });
    var spriteIdx = this.animalSprites.findIndex(function (s) { return s.getData('animalKey') === key; });
    if (animalIdx === -1 || spriteIdx === -1) return;
    var animal = this.playingAnimals[animalIdx], sprite = this.animalSprites[spriteIdx];
    this.animalSprites.forEach(function (s) { s.disableInteractive(); });
    if (this.repeatSoundTimer) { this.repeatSoundTimer.remove(false); this.repeatSoundTimer = null; }
    var w = this.sys.game.config.width, h = this.sys.game.config.height;
    var backdrop = this.add.rectangle(w / 2, h / 2, w, h, 0x11fdaa, 0.9).setDepth(998);
    this.children.bringToTop(sprite);
    sprite.setDepth(999);
    this.collisionDisabledSpriteKey = key;
    window.SoundManager.playBravo(this);
    var minSide = Math.min(w, h);
    var targetScale = (minSide * 0.8) / Math.max(sprite.width, sprite.height);
    sprite.setData('vx', 0); sprite.setData('vy', 0);
    this.tweens.add({
        targets: sprite, x: w / 2, y: h / 2, scale: targetScale, duration: 600, ease: 'Cubic.easeInOut',
        onComplete: function () {
            var nameText = this.add.text(w / 2, h / 2 + targetScale * sprite.height / 2 + 40,
                animal.nameEn + ' / ' + animal.nameVi,
                { fontSize: '40px', color: '#1976d2', fontStyle: 'bold', backgroundColor: '#fff', padding: { left: 16, right: 16, top: 8, bottom: 8 } }
            ).setOrigin(0.5);
            nameText.setDepth(1001);
            sprite.setDepth(1000);
            window.SoundManager.playAnimalSounds(this, animal);
            var self = this;
            setTimeout(function () {
                sprite.destroy();
                backdrop.destroy();
                nameText.destroy();
                self.animalSprites.splice(spriteIdx, 1);
                self.playingAnimals.splice(animalIdx, 1);
                self.animalSprites.forEach(function (s) { s.setInteractive(); });
                self.collisionDisabledSpriteKey = null;
                if (self.playingAnimals.length > 0) {
                    self.askAnimal();
                } else {
                    var total = self.correctCount + self.incorrectCount;
                    var percent = total === 0 ? 100 : (self.correctCount / total) * 100;
                    var stars = 0;
                    if (percent >= 90) stars = 5;
                    else if (percent >= 70) stars = 4;
                    else if (percent >= 50) stars = 3;
                    else if (percent >= 30) stars = 2;
                    else if (percent >= 10) stars = 1;
                    self.scene.start('EndScene', { stars: stars, mode: self.mode, stage: self.stage });
                }
            }, 2000);
        },
        callbackScope: this
    });
};

MainScene.prototype.nextAnimalAfterWrong = function () {
    var animalIdx = this.playingAnimals.findIndex(function (a) { return a.key === this.currentAnswer; }, this);
    var spriteIdx = this.animalSprites.findIndex(function (s) { return s.getData('animalKey') === this.currentAnswer; }, this);
    if (animalIdx === -1 || spriteIdx === -1) return;
    var sprite = this.animalSprites[spriteIdx];
    sprite.destroy();
    this.animalSprites.splice(spriteIdx, 1);
    this.playingAnimals.splice(animalIdx, 1);
    this.collisionDisabledSpriteKey = null;
    this.animalSprites.forEach(function (s) { s.setInteractive(); });
    if (this.playingAnimals.length > 0) {
        this.askAnimal();
    } else {
        var total = this.correctCount + this.incorrectCount;
        var percent = total === 0 ? 100 : (this.correctCount / total) * 100;
        var stars = 0;
        if (percent >= 90) stars = 5;
        else if (percent >= 70) stars = 4;
        else if (percent >= 50) stars = 3;
        else if (percent >= 30) stars = 2;
        else if (percent >= 10) stars = 1;
        this.scene.start('EndScene', { stars: stars, mode: this.mode, stage: this.stage });
    }
};

window.MainScene = MainScene;