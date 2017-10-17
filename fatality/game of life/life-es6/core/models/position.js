'use strict';

export class PositionModel
{
    constructor(x, y)
    {
        Object.defineProperty(this, 'x', { get: () => x });
        Object.defineProperty(this, 'y', { get: () => y });
    }
}