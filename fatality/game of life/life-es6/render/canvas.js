'use strict';

import { State } from '../core/state.js';
import { StateModel } from '../core/models/state.js';
import { Utils } from '../utils.js';

var scope = {},
    utils = new Utils();

/*
    sample implementation of canvas renderer
    different renderers should implement inner functions... differently
    (so... don't copy and paste everything when writing a new renderer)
*/
export class GameOfLifeCanvasRenderer
{
    constructor(canvas, context)
    {
        scope.ctx = this;
        scope.canvas = canvas;
        scope.context = context || canvas.getContext('2d');
    }

    /*
        this function update the view for every generation tick
    */
    draw()
    {
        this.refresh((canvasContext, x, y, offset) =>
        {
            let state = scope.ctx.boardState.fetch(x, y);

            if (state)
            {
                for (let i = 0; i < 3; i++)
                {
                    canvasContext[offset + i] = state.color[i];
                }
            }

            canvasContext[offset + 3] = state.alive ? state.color[3] : 0;

        }, true);
    }

    /*
        initialize:
        1. inner configuration variables
        2. generations tick interval
        3. tick handler
        4. state of entire board
    */
    init(interval, onGenerationTick)
    {
        if (!Number.isInteger(interval) || interval < 1)
        {
            return console.error('interval must be a valid integer');
        }

        this.boardState = new State();
        this.interval = interval;
        this.width = scope.canvas.width;
        this.height = scope.canvas.height;
   
        scope.onGenerationTick = utils.isFunction(onGenerationTick) ? 
                                 onGenerationTick : 
                                 utils.emptyDelegate(true);

        this.refresh((canvasContext, x, y, offset) =>
        {
            var alive = canvasContext[offset + 3] > 0,
                color = [];

            for (let i = 0; i < 4; i++)
            {
                // i => 0 - red, 1 - green, 2 - blue, 3 - alpha
                color.push(canvasContext[offset + i]);
            }

            scope.ctx.boardState.append(x, y, new StateModel(color, alive));
        });

        return this;
    };

    /*
        use this if you wish to zoom the view in or out (optional)
    */
    magnify(factor)
    {
        var magnify = (prop) =>
        {
            scope.canvas.style[prop] = (scope.canvas[prop] * factor) + 'px';
        };

        magnify('width');
        magnify('height');

        return this;
    };

    /*
        scan the canvas (pixel by pixel) then
        perform an action on every pixel
    */
    refresh(action, draw)
    {
        if (!utils.isFunction(action)) return;

        var index = 0,
            pixelArray = scope.context.getImageData
                         (
                             0, 
                             0, 
                             scope.canvas.width, 
                             scope.canvas.height
                         );

        for (let y = 0; y < scope.canvas.height; y++)
        {
            for (let x = 0; x < scope.canvas.width; x++) 
            {
                action(pixelArray.data, x, y, index * 4);

                index++;
            }
        }

        if (draw) scope.context.putImageData(pixelArray, 0, 0);
    };

    /*
        1. scan world board
        2. update the board state
        3. re-draw to reflect changes
    */
    render(generation, world)
    {
        var ctx = this;

        world.eachBoardCell((cell) =>
        {
            scope.ctx.boardState.update
            (
                cell.position.x, 
                cell.position.y, 
                'alive', 
                cell.alive
            );
        });

        this.draw();

        scope.onGenerationTick(generation);
    };
}