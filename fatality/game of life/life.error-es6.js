'use strict';

import { GameOfLife } from '/life-es6/gol.js';
import { GameOfLifeCanvasRenderer } from '/life-es6/render/canvas.js';

/*
    this is the main function of this project
    every call will result in a hole new simulation of `Game Of Life`
*/
window.gameOfLife = (canvasElement, onGenerationTick) =>
{
    // modify this function if canvas configuration is required
    function canvasConfig()
    {
        var ctx = canvasElement.getContext('2d');
        
        ctx.font = '220pt "Black Ops One"';
        ctx.fillStyle = '#72FFCD';
        ctx.fillText(canvasElement.innerHTML, 0, 200);

        return ctx;
    }

    // modify this function if renderer configuration is required
    function rendererConfig(interval, zoom)
    {
        return renderer.init(interval, onGenerationTick).magnify(zoom);
    }

    var canvasContext = canvasConfig(),
        renderer = new GameOfLifeCanvasRenderer(canvasElement, canvasContext);

    return new GameOfLife(rendererConfig(700, 1.2)); 
};



