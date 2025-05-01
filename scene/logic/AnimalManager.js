/**
 * Quản lý logic động vật: random, kiểm tra đáp án, chuyển animal, v.v.
 */
window.AnimalManager = {
    getStageAnimals: function(sourceList, stage, perStage) {
        var startIdx = stage * perStage;
        var endIdx = startIdx + perStage;
        return sourceList.slice(startIdx, endIdx);
    },
    getRandomAnimal: function(animals) {
        return animals[Math.floor(Math.random() * animals.length)];
    },
    removeAnimalByKey: function(animals, key) {
        var idx = animals.findIndex(function(a) { return a.key === key; });
        if (idx !== -1) animals.splice(idx, 1);
    }
    // ...bổ sung các hàm logic khác nếu cần...
};