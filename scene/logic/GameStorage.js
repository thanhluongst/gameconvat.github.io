// Utility for saving/loading game progress and stats in localStorage
// Usage: window.GameStorage.saveStageStars(mode, stage, stars), ...
window.GameStorage = {
    // Save star count for a stage (mode: 'animal' or 'fruit', stage: number, stars: 0-5)
    saveStageStars: function(mode, stage, stars) {
        var key = 'stageStars';
        var data = localStorage.getItem(key);
        var obj = {};
        if (data) {
            try { obj = JSON.parse(data); } catch (e) { obj = {}; }
        }
        var stageKey = mode + '_' + stage;
        obj[stageKey] = stars;
        localStorage.setItem(key, JSON.stringify(obj));
    },
    // Load star count for a stage
    loadStageStars: function(mode, stage) {
        var key = 'stageStars';
        var data = localStorage.getItem(key);
        if (!data) return 0;
        try {
            var obj = JSON.parse(data);
            var stageKey = mode + '_' + stage;
            return obj[stageKey] || 0;
        } catch (e) { return 0; }
    },
    // Save wrong click count for an item (itemKey: sprite key)
    saveWrongClick: function(itemKey) {
        var key = 'wrongClicks';
        var data = localStorage.getItem(key);
        var obj = {};
        if (data) {
            try { obj = JSON.parse(data); } catch (e) { obj = {}; }
        }
        obj[itemKey] = (obj[itemKey] || 0) + 1;
        localStorage.setItem(key, JSON.stringify(obj));
    },
    // Load wrong click count for an item
    loadWrongClick: function(itemKey) {
        var key = 'wrongClicks';
        var data = localStorage.getItem(key);
        if (!data) return 0;
        try {
            var obj = JSON.parse(data);
            return obj[itemKey] || 0;
        } catch (e) { return 0; }
    },
    // Get top N items with most wrong clicks
    getTopWrongClicks: function(n) {
        var key = 'wrongClicks';
        var data = localStorage.getItem(key);
        var obj = {};
        if (data) {
            try { obj = JSON.parse(data); } catch (e) { obj = {}; }
        }
        var arr = Object.keys(obj).map(function(k) { return { key: k, count: obj[k] }; });
        arr.sort(function(a, b) { return b.count - a.count; });
        return arr.slice(0, n);
    },
    /**
     * Save app settings to localStorage
     * @param {Object} settings - { lang: 'vi'|'en', soundMode: 'both'|'en'|'vi' }
     */
    saveAppSettings: function(settings) {
        localStorage.setItem('appSettings', JSON.stringify(settings));
    },
    /**
     * Load app settings from localStorage
     * @returns {Object} settings - { lang, soundMode }
     */
    loadAppSettings: function() {
        var data = localStorage.getItem('appSettings');
        if (!data) return { lang: (typeof DEFAULT_LANG !== 'undefined' ? DEFAULT_LANG : 'vi'), soundMode: (typeof SOUND_MODE !== 'undefined' ? SOUND_MODE : 'both') };
        try {
            var obj = JSON.parse(data);
            return {
                lang: obj.lang || (typeof DEFAULT_LANG !== 'undefined' ? DEFAULT_LANG : 'vi'),
                soundMode: obj.soundMode || (typeof SOUND_MODE !== 'undefined' ? SOUND_MODE : 'both')
            };
        } catch (e) {
            return { lang: (typeof DEFAULT_LANG !== 'undefined' ? DEFAULT_LANG : 'vi'), soundMode: (typeof SOUND_MODE !== 'undefined' ? SOUND_MODE : 'both') };
        }
    }
};
/**
 * Get repeat sound delay based on appSettings.soundMode
 * If soundMode is 'both', return 2000ms, else return 4300ms
 */
window.getRepeatSoundDelay = function() {
    let soundMode = 'both';
    if (window.GameStorage) {
        var settings = window.GameStorage.loadAppSettings();
        console.log('getRepeatSoundDelay', settings, settings.soundMode);
        if (settings && settings.soundMode) soundMode = settings.soundMode;
    }
    if (soundMode == 'both') {
        return REPEAT_SOUND_DELAY;
        
    } else {
        return DEFAULT_SOUND_DELAY;
    }
}