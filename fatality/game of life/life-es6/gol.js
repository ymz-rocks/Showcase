'use strict'; // gol = Game Of Life

import { RulesEngine } from './core/engine.js';
import { World } from './core/world.js';

var scope = {};

export class GameOfLife
{
    constructor(renderer)
    {
        scope.renderer = renderer;
    }

    start()
    {
        var ctx = this,

            world = new World(scope.renderer).refresh(),

            rules = new RulesEngine(),
                
            tick = () => // every generation tick
            {
                // use renderer to refresh world state (previous generation)
                scope.renderer.render(ctx.generation, world);
                
                // use rules engine to calculate next generation values
                rules.apply(world);
                
                // inc generation for next tick
                ctx.generation++; 
            };

        this.generation = 0; 
        
        scope.intervalId = setInterval(tick, scope.renderer.interval);
    }

    stop()
    {
        clearInterval(scope.intervalId);
    }
}