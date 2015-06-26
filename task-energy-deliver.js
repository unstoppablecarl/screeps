'use strict';

// bring energy to creep
var task = {
    name: 'energy_deliver',
    start: false,
    act: function(creep) {
        var target = creep.taskTarget();

        if(!target){
            creep.cancelTask();
        }

        if (target) {
            if (target.energy === target.energyCapacity) {
                creep.endTask();
            }
            creep.moveTo(target);
            var result = creep.transferEnergy(target);
            if (result === OK) {
                creep.endTask();
            }
        }
    },
    cancel: false,
    end: false,
};

module.exports = task;
