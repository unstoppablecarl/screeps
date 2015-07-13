'use strict';


RoomPosition.prototype.findClosestIdleFlag = function(creep){
    var role = creep.role();
    var room = Game.rooms[this.roomName];
    var flags = room.getIdleFlags();

    flags = _.sortBy(flags, function(flag){

        var priority = flag.idlePriority();
        if(flag.idleCreepRole()){
            priority += 100;
        }
        return priority;
    }).reverse();

    var roleFlags = flags.filter(function(flag){
        return flag.idleCreepValid(creep);
    });

    if(roleFlags.length){
        return this.findClosest(roleFlags);
    }

    return false;
};

RoomPosition.prototype.findClosestEnergyStore = function(){
    var room = Game.rooms[this.roomName];
    var spawns = room.spawns(function(spawn) {
        return spawn.energy < spawn.energyCapacity;
    });

    var extensions = room.extensions(function(s) {
        return s.structureType === 'extension' && s.energy < s.energyCapacity;
    });
    var targets = spawns.concat(extensions);
    return this.findClosest(targets);
};

var blockedTile = function(list) {
    for(var i = list.length - 1; i >= 0; i--){
        var tile = list[i];
        var type = list[i].type;
        if (
            tile.type === 'terrain' &&
            tile.terrain === 'wall'
        ) {
            return true;
        }

        if(tile.type ==='structure'){

            // road
            if(tile.structure.structureType === STRUCTURE_ROAD){
                continue;
            }
            // enemy rampart
            else if(
                tile.structure.structureType === STRUCTURE_RAMPART &&
                !tile.structure.my
            ){
                return true;
            }
            // any other structure
            else {

                return true;
            }
        }
    }

    return false;
};

// counts tiles adjacent to position that are not blocked by terrain or structures
RoomPosition.prototype.adjacentEmptyTileCount = function(blockedTileFunc) {
    if(blockedTileFunc === undefined){
        blockedTileFunc = blockedTile;
    }

    var x = this.x;
    var y = this.y;
    var room = Game.rooms[this.roomName];
    var tiles = room.lookAtArea(y - 1, x - 1, y + 1, x + 1);
    var spaces = 0;

    // top left
    if (!blockedTileFunc(tiles[y - 1][x - 1])) spaces++;
    // top'
    if (!blockedTileFunc(tiles[y - 1][x]))     spaces++;
    // top right'
    if (!blockedTileFunc(tiles[y - 1][x + 1])) spaces++;
    // left
    if (!blockedTileFunc(tiles[y][x - 1]))     spaces++;
    // right'
    if (!blockedTileFunc(tiles[y][x + 1]))     spaces++;
    // bottom left'
    if (!blockedTileFunc(tiles[y + 1][x - 1])) spaces++;
    // bottom'
    if (!blockedTileFunc(tiles[y + 1][x]))     spaces++;
    // bottom right'
    if (!blockedTileFunc(tiles[y + 1][x + 1])) spaces++;

    return spaces;
};

RoomPosition.prototype.findHostileTarget = function(range){
    // ranged attack distance
    range = range || 3;

    var targets = this.findInRange(FIND_HOSTILE_CREEPS, range);

    if(targets.length){
        targets = _.sortBy(targets, function(target){
            return target.hits;
        });

        return targets[0];
    }

    return false;
};
