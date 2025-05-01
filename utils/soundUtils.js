/**
 * Tiện ích phát chuỗi âm thanh nối tiếp trong Phaser.
 * @param {Phaser.Scene} scene - Scene hiện tại.
 * @param {string[]} soundKeys - Danh sách key âm thanh.
 * @param {function} onComplete - Callback khi phát xong.
 */
// Hàm tiện ích phát âm thanh nối tiếp (chuỗi)
function playSoundSequence(scene, soundKeys, onComplete) {
    if (!soundKeys.length) return onComplete && onComplete();
    const key = soundKeys[0];
    const sound = scene.sound.add(key);
    sound.once('complete', () => playSoundSequence(scene, soundKeys.slice(1), onComplete));
    sound.play();
}

/**
 * Trả về fontSize responsive tối ưu cho cả PC và mobile.
 * @param {Phaser.Scene} scene - Scene hiện tại.
 * @param {number} ratio - Tỉ lệ chia, ví dụ 18 cho tiêu đề lớn, 24 cho label, 32 cho text nhỏ.
 * @param {number} [min=12] - Kích thước nhỏ nhất (px).
 * @param {number} [max=36] - Kích thước lớn nhất (px).
 * @returns {string} fontSize (px)
 */
function getResponsiveFont(scene, ratio = 24, min = 12, max = 36) {
    const w = scene.sys.game.config.width;
    const h = scene.sys.game.config.height;
    // Lấy min giữa width và height để tránh chữ quá to trên mobile hoặc màn hình dọc
    const base = Math.min(w, h);
    const size = Math.round(base / ratio);
    return Math.max(min, Math.min(size, max)) + 'px';
}