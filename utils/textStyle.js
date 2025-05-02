// Hàm quản lý style text toàn cục cho game
// options: { fontSize, color, bold, align, shadow, stroke, strokeThickness, scale, maxCharsPerLine }
window.getGameTextStyle = function(options, scene) {
    options = options || {};
    // Lấy kích thước canvas thực tế từ Phaser
    var w = scene && scene.sys && scene.sys.game && scene.sys.game.canvas ? scene.sys.game.canvas.clientWidth : (window.innerWidth || 800);
    var h = scene && scene.sys && scene.sys.game && scene.sys.game.canvas ? scene.sys.game.canvas.clientHeight : (window.innerHeight || 600);

    var minDim = Math.min(w, h);
    var scale = options.scale || 1;
    // Số ký tự tối đa trên 1 dòng (mặc định 8)
    var maxCharsPerLine = options.maxCharsPerLine || 40;
    // Tính toán padding trái/phải (nếu có)
    var paddingLeft = (options.padding && options.padding.left) ? options.padding.left : 0;
    var paddingRight = (options.padding && options.padding.right) ? options.padding.right : 0;
    // Tính font-size sao cho mỗi dòng vừa đủ maxCharsPerLine ký tự (trừ padding)
    var availableWidth = w - paddingLeft - paddingRight;
    var minFontSize = 16;
    var fontSize = options.fontSize || Math.max(minFontSize, Math.floor(availableWidth / maxCharsPerLine));
    // console.log('getGameTextStyle', options.fontSize);
    revalue = {
        fontFamily: "'Baloo 2', 'Fredoka', Arial, sans-serif",
        fontSize: fontSize + 'px',
        color: options.color || '#fff',
        fontStyle: options.bold ? 'bold' : 'normal',
        align: options.align || 'left',
        padding: options.padding || { left: 0, right: 0, top: 0, bottom: 0 }
    }
    console.log('getGameTextStyle', revalue);
    return revalue;
};
