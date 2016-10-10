function CurrentWeatherWidgetManager(app, key)
{
    function Args(value, error)
    {
        this.value = value;
        this.error = error;
    }

    var iconsHash, path = 'widgets/current-weather/';

    function init(instance, config, complete)
    {
        var defaultArgs = new Args('lat=40.71&lon=-74');

        if (!config || !instance.key) return complete(defaultArgs);
        
        var set = config[instance.key]; if (!set) return complete(defaultArgs);

        if (set.city) return complete(new Args('q=' + set.city));
        
        if (set.latlon) return complete(new Args('lat=' + set.latlon[0] + '&lon=' + set.latlon[1]));
       
        if (set.gps) gps(complete); 
    }

    function gps(complete)
    {
        navigator.geolocation.getCurrentPosition(function (location)
        {
            complete(new Args('lat=' + location.coords.latitude + '&lon=' + location.coords.longitude));

        }, function (error)
        {
            complete(new Args('GPS location is required', true));

            console.error(error.message);
        });
    }

    function refresh(scope, http, args, success, error)
    {
        function icon(codes)
        {
            return codes.map(function (code)
            {
                return iconsHash[code] || [];
            });
        }

        request(http, 'http://api.openweathermap.org/data/2.5/weather?' + args + '&appid=' + key, function (response)
        {
            var updated = new Date(response.data.dt * 1000);

            scope.stats.icon = icon(response.data.weather.map(function (item) { return item.icon; }));
            scope.stats.forecast = response.data.weather.map(function (item) { return item.description; }).join(' / ');
            scope.stats.temp = (response.data.main.temp - 273.15).toFixed(1);
            scope.stats.city = response.data.name;
            scope.stats.lastUpdated = time(updated);
            scope.stats.humidity = response.data.main.humidity;
            scope.stats.wind = response.data.wind;

            scope.stats.wind.deg = parseInt(scope.stats.wind.deg);

            if (success) success(response);

        }, error);
    }

    function request(http, url, success, error)
    {
        if (!success) return console.error('you must provide at least 1 callback');

        http({ mode: 'GET', url: url }).then(success, error || function (response)
        {
            console.error(response.statusText + '(' + response.status + ') ' + response.config.url);
        });
    }

    function time(date, accurate)
    {
        function format(value)
        {
            return value < 10 ? '0' + value : value;
        }

        var value = [format(date.getHours()), format(date.getMinutes())];

        if (accurate) value.push(format(date.getSeconds()));

        return value.join(':');
    }

    this.apply = function (config)
    {
        app.component('currentWeather',
        {
            bindings: 
            {
                key: '@'
            },
            
            controller: function ($scope, $http)
            {
                var ctx = this;

                $scope.load = function (force)
                {
                    $scope.error = '';
                    $scope.stats = {};
                    $scope.valid = false;

                    init(ctx, config, function (args)
                    {
                        if (args.error)
                        {
                            if (force) return window.location.reload();

                            $scope.error = args.value;
                            $scope.$apply();
                        }
                        else
                        {
                            if (iconsHash) $scope.refresh(args.value);
                            else request($http, path + 'icons.json', function (response)
                            {
                                iconsHash = response.data;

                                $scope.refresh(args.value);
                            });
                        }
                    });
                };

                $scope.refresh = function (args)
                {
                    if (!args) return console.error('must provide valid arguments according to OpeanWeatherMap documentation');

                    refresh($scope, $http, args, function (response)
                    {
                        $scope.valid = true;

                        console.log((ctx.key ? '[' + ctx.key + '] ' : '') + 'current weather widget updated at ' + time(new Date(), true));
                    });
                };

                $scope.load();
            },

            templateUrl: path + 'view.html'
        });
    };
}
