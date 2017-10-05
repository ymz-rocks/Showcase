function GameOfLifeCanvasRenderer(canvas, context)
{
    function State()
    {
        var alive = {};

        this.fetch = function(x, y)
        {
            return alive[y][x];
        };

        this.update = function(x, y, value)
        {
            if (!(alive[y] instanceof Object)) alive[y] = {};
            
            alive[y][x] = value;
        };
    }

    /* ********************************************************* */

    function magnify(name, factor)
    {
        canvas.style[name] = (canvas[name] * factor) + 'px';
    }

    function refresh(action, draw)
    {
        if (!(action instanceof Function)) return;

        var index = 0,
            pixelArray = context.getImageData(0, 0, canvas.width, canvas.height);

        for (var y = 0; y < canvas.height; y++)
        {
            for (var x = 0; x < canvas.width; x++) 
            {
                action(pixelArray.data, x, y, index * 4);

                index++;
            }
        }

        if (draw) context.putImageData(pixelArray, 0, 0);
    };

    /* ********************************************************* */

    var ctx = this,
        context = context || canvas.getContext('2d'),
        originalState, 
        tickHandler;

    this.init = function(interval, tick)
    {
        if (!Number.isInteger(interval) || interval < 1) return console.error('interval must be a valid integer');

        originalState = new State();

        ctx.interval = interval;

        ctx.width = canvas.width;
        ctx.height = canvas.height;

        tickHandler = tick instanceof Function ? tick : function(){ return true; };

        refresh(function(ctx, x, y, index)
        {
            var color = [];

            for (var i = 0; i < 4; i++)
            {
                color.push(ctx[index + i]); // 0 - red, 1 - green, 2 - blue, 3 - alpha
            }

            originalState.update(x, y, color);
        });

        return ctx;
    };

    this.initialState = function(x, y)
    {
        return originalState.fetch(x, y)[3] > 0;
    };

    this.magnify = function(factor)
    {
        magnify('width', factor);
        magnify('height', factor);

        return ctx;
    };

    this.render = function(generation, world, next)
    {
        var state = new State();

        world(function(cell)
        {
            state.update(cell.position.x, cell.position.y, cell.alive);
        });

        refresh(function(ctx, x, y, index)
        {
            if (state.fetch(x, y))
            {
                var original = originalState.fetch(x, y);

                for (var i = 0; i < 4; i++)
                {
                    ctx[index + i] = original[i];
                }
            }
            else ctx[index + 3] = 0;

        }, true);

        next(tickHandler(generation));
    };

}