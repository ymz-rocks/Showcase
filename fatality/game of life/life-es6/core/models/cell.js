'use strict';

export class CellModel
{
    constructor(position, alive)
    {
        this.mates = [];

        this.alive = alive;
        this.position = position;
    }
}

