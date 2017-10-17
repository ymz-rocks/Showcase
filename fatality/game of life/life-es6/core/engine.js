'use strict';

/*
    Game Of Life rules should be here
    reflect new game rules in this class only!
*/
export class RulesEngine
{
    /*
        for a given world:
        1. scan the wolrd board
        2. select all cells that require a flip
        3. flip selected cells
    */
    apply(world)
    {
        var flips = [];

        world.eachBoardCell((cell) =>
        {
            var alive = cell.mates.filter(RulesEngine.isAlive).length;

            if (RulesEngine.isUnchanged(cell, alive)) return;

            if (RulesEngine.isExposure(cell, alive) || 
                RulesEngine.isOvercrowding(cell, alive) ||
                RulesEngine.isReproduction(cell, alive)) flips.push(cell);
        });

        flips.forEach((cell) =>
        {
            cell.alive = !cell.alive;
        });
    };

    static isAlive(cell)
    {
        return cell.alive === true;
    }

    static isExposure(cell, aliveMates)
    {
        return RulesEngine.isAlive(cell) && aliveMates < 2;
    }

    static isOvercrowding(cell, aliveMates)
    {
        return RulesEngine.isAlive(cell) && aliveMates > 3;
    }

    static isReproduction(cell, aliveMates)
    {
        return !RulesEngine.isAlive(cell) && aliveMates === 3;
    }

    static isUnchanged(cell, aliveMates)
    {
        return RulesEngine.isAlive(cell) && aliveMates > 1 && aliveMates < 4;
    }

}