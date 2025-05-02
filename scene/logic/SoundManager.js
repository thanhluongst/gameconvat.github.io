/**
 * Quản lý phát âm thanh, lặp lại, hiệu ứng âm thanh.
 */
window.SoundManager = {
    playBravo: function(scene) {
        scene.sound.play('bravo');
    },
    playWrong: function(scene) {
        scene.sound.play('wrong');
    },
    playAnimalSounds: function(scene, animal) {
        // Lấy soundMode từ appSettings (localStorage), mặc định 'both'
        var soundMode = 'both';
        if (window.GameStorage && typeof window.GameStorage.loadAppSettings === 'function') {
            var settings = window.GameStorage.loadAppSettings();
            if (settings && settings.soundMode) soundMode = settings.soundMode;
        }
        var keys = [];
        if (soundMode === 'both') {
            keys = [animal.key + '_en', animal.key + '_vi'];
        } else if (soundMode === 'en') {
            keys = [animal.key + '_en'];
        } else if (soundMode === 'vi') {
            keys = [animal.key + '_vi'];
        } else {
            keys = [animal.key + '_en', animal.key + '_vi']; // fallback
        }
        playSoundSequence(scene, keys);
    }
};

function playSoundSequence(scene, soundKeys) {
    if (!soundKeys.length) return;
    var soundKey = soundKeys.shift();
    var sound = scene.sound.add(soundKey);
    sound.once('complete', function() {
        playSoundSequence(scene, soundKeys);
    });
    sound.play();
}