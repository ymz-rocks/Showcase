'use strict';

import { Utils } from '../utils.js';

var scope = {},
    utils = new Utils();

/*
    handle a state matrix with this class
*/
export class State
{
    constructor()
    {
        scope.state = {};
    }

    /*
        create or override cell value
    */
    append(x, y, value)
    {
        if (!utils.isObject(scope.state[y])) scope.state[y] = {};
        
        scope.state[y][x] = value;
    };

    /*
        create or override cell value
    */
    fetch(x, y)
    {
        return scope.state[y][x];
    };

    /*
        update cell value property
    */
    update(x, y, name, value)
    {
        scope.state[y][x][name] = value;
    };
}
