function GameOfLife(renderer)
{
    function RulesEngine(world)
    {
        function isAlive(cell)
        {
            return cell.alive === true;
        }

        function isExposure(cell, aliveMates)
        {
            return isAlive(cell) && aliveMates < 2;
        }

        function isOvercrowding(cell, aliveMates)
        {
            return isAlive(cell) && aliveMates > 3;
        }

        function isReproduction(cell, aliveMates)
        {
            return !isAlive(cell) && aliveMates === 3;
        }

        function isUnchanged(cell, aliveMates)
        {
            return isAlive(cell) && aliveMates > 1 && aliveMates < 4;
        }

        this.apply = function()
        {
            var flips = [];

            world.each(function(cell)
            {
                var alive = cell.mates.filter(isAlive).length;

                if (isUnchanged(cell, alive)) return;

                if (isExposure(cell, alive) || 
                    isOvercrowding(cell, alive) ||
                    isReproduction(cell, alive)) flips.push(cell);
            });

            return flips;
        };
    }

    /* ********************************************************* */

    function Position(x, y)
    {
        Object.defineProperty(this, 'x',
        {
            get: function() { return x; }
        });

        Object.defineProperty(this, 'y',
        {
            get: function() { return y; }
        });
    }

    function Cell(position, alive)
    {
        this.position = position;
        this.mates = [];
        this.alive = alive;
    }

    function World(width, height, state)
    {
        function each(cell, row)
        {
            var nothing = function() {};

            if (!(cell instanceof Function)) cell = nothing;
            if (!(row instanceof Function)) row = nothing;

            for (var y = 0; y < height; y++)
            {
                row(y);
    
                for (var x = 0; x < width; x++)
                {
                    cell(x, y);
                }
            }
        };

        var ctx = this;

        this.each = function(action)
        {
            if (!(action instanceof Function)) return;

            each(function(x, y)
            {
                action(ctx.board[y][x]);
            });
        };

        this.init = function()
        {
            if (!ctx.validate()) return;
            
            ctx.board = new Array(height);

            each(function cell(x, y)
            {
                ctx.board[y][x] = new Cell(new Position(x, y), state(x, y));

            }, function row(y)
            {
                ctx.board[y] = new Array(width);
            });

            each(function(x, y)
            {
                var start =
                {
                    x: x > 0 ? x - 1 : x,
                    y: y > 0 ? y - 1 : y

                }, end = 
                {
                    x: x < width - 1 ? x + 2 : x,
                    y: y < height - 1 ? y + 2 : y,
                };

                for (var i = start.y; i < end.y; i++)
                {
                    for (var j = start.x; j < end.x; j++)
                    {
                        if (i === y && j === x) continue;

                        ctx.board[y][x].mates.push(ctx.board[i][j]);
                    }
                }
            });
        };

        this.validate = function()
        {
            function dimension(value)
            {
                return Number.isInteger(value) && value > 9;
            }

            if (!dimension(width)) return console.error('width must be valid integer with a minimal size of 10');

            if (!dimension(height)) return console.error('height must be valid integer with a minimal size of 10');

            if (!(state instanceof Function)) return console.error('state must be a function! state(x, y)');

            return true;
        }
    }

    /* ********************************************************* */

    (function()
    {
        var generation = 0,
            world = new World(renderer.width, renderer.height, renderer.initialState),
            rules = new RulesEngine(world);

        world.init();

        var intervalId = setInterval(function()
        {
            renderer.render(generation, world.each, function(next)
            {
                if (!next) return clearInterval(intervalId);
            });

            rules.apply().forEach(function(cell)
            {
                cell.alive = !cell.alive;
            });

            generation++;
            
        }, renderer.interval);

    })();
}