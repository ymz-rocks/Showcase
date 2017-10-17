'use strict';

import { CellModel } from './models/cell.js';
import { PositionModel } from './models/position.js';
import { Utils } from '../utils.js';

var scope = {},
    utils = new Utils();

export class World
{
    constructor(renderer)
    {
        scope.ctx = this;
        scope.width = renderer.width;
        scope.height = renderer.height;
        scope.boardState = renderer.boardState;
    }

    eachBoardCell(action)
    {
        if (utils.isFunction(action) && utils.isObject(scope.ctx.board))
        {
            utils.eachTuple(scope.height, scope.width, (x, y) =>
            {
                action(scope.ctx.board[y][x]);
            });
        }
    };

    initBoard()
    {
        this.board = new Array(scope.height);
        
        utils.eachTuple(scope.height, scope.width, (x, y) =>
        {
            // for each cell => initiate cell position and alive status

            scope.ctx.board[y][x] = new CellModel
            (
                new PositionModel(x, y), 
                scope.boardState.fetch(x, y).alive
            );

        }, (y) =>
        {
            // for each row => create a new array to hold cell values

            scope.ctx.board[y] = new Array(scope.width);
        });
    }

    initMates()
    {
        utils.eachTuple(scope.height, scope.width, (x, y) =>
        {
            var start =
            {
                x: x > 0 ? x - 1 : x,
                y: y > 0 ? y - 1 : y

            }, end = 
            {
                x: x < scope.width - 1 ? x + 2 : x,
                y: y < scope.height - 1 ? y + 2 : y,
            };

            for (let i = start.y; i < end.y; i++)
            {
                for (let j = start.x; j < end.x; j++)
                {
                    if (i === y && j === x) continue;

                    let cell = scope.ctx.board[i][j];

                    scope.ctx.board[y][x].mates.push(cell);
                }
            }
        });
    }

    refresh()
    {
        if (!this.validate()) return;

        this.initBoard();

        this.initMates();

        return this;
    }

    validate()
    {
        var validateDimension = (value) =>
        {
            return Number.isInteger(value) && value > 9;

        }, sizeError = (name) =>
        {
            return name + 'must be valid integer with a minimal size of 10';
        };

        if (!validateDimension(scope.width))
        {
            return console.error(sizeError('width'));
        }

        if (!validateDimension(scope.height))
        {
            return console.error(sizeError('height'));
        }

        if (!utils.isObject(scope.boardState))
        {
            return console.error('board state must be from type `State`');
        }

        return true;
    }
}