(function()
{
    function config(canvas, stats)
    {
        var ctx = canvas.getContext('2d');
        
        ctx.font = '220pt "Black Ops One"';
        ctx.fillStyle = '#72FFCD';
    
        ctx.fillText(canvas.innerHTML, 0, 200);
    
        var renderer = new GameOfLifeCanvasRenderer(canvas, ctx);
        
        new GameOfLife(renderer.init(700, function(generation)
        {
            stats.innerHTML = 'Generation: ' + generation;
        
            return true;
        
        }).magnify(1)); // you can magnify the canvas using values like 1.5, 2, 3, etc.
    }
    
    window.addEventListener('load', function() // wait for complete document load
    {
        var canvas = document.getElementById('life'); // sorry querySelector...I'm trying to support ie :(

        config(canvas, canvas.nextElementSibling);
        
    }, false);

})();


