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
        var keys = [animal.key + '_en', animal.key + '_vi'];
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