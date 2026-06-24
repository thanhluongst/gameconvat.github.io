// Animal image settings — responsive: 30% of shorter screen edge, capped 100–220px
const ANIMAL_MAX_SIZE = Math.min(220, Math.max(100, Math.min(window.innerWidth, window.innerHeight) * 0.3));
// Animal moving speed settings (pixels per second)
const ANIMAL_MIN_SPEED = 80;
const ANIMAL_MAX_SPEED = 110;

// Max number of images to show per game round
const ANIMAL_MAX_RANDOM = 8;


// Độ lắc tối đa cho animal sprite (đơn vị: độ)
const ANIMAL_SHAKE_DEGREE = 8;

// Allowable overlap ratio for sprites and bars (e.g. 0.1 = 10%)
const ANIMAL_OVERLAP_RATIO = 0.02;

/**
 * Default app settings (can be changed in SettingsScene)
 *
 * DEFAULT_LANG: 'vi' (Vietnamese) or 'en' (English)
 * SOUND_MODE: 'both' (en then vi), 'en' (English only), 'vi' (Vietnamese only)
 */
const DEFAULT_LANG = 'vi'; // Ngôn ngữ mặc định
const SOUND_MODE = 'both'; // 'both', 'en', 'vi
const DEFAULT_SOUND_DELAY = 2500; // Thời gian delay giữa các âm thanh (ms) nếu chỉ có 1 âm thanh

// Thời gian lặp lại phát âm thanh (ms) DEFAULT_SOUND_DELAY_BOTH
const REPEAT_SOUND_DELAY = 4300;

