'use strict';

var task = {
    name: 'repair',
    start: false,
    act: function(creep){
        var target = creep.taskTarget();
        if(target){
            creep.moveTo(target);
            creep.repair(target);
            if(target.hits === target.hitsMax){
                creep.endTask();
            }
        } else {
            creep.cancelTask();
        }
    },
    cancel: false,
    end: false,
};

module.exports = task;
