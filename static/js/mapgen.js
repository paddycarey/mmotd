/**
  * mapgen.js
  * Seed-based procedural generation using cellular automata passes
  * @author njmcode
  **/
define(
	'mapgen',
    // Dependencies
    ['lib/mersenne-twister'],	// non-AMD script so will be imported as undefined
    // Object
    function( SeedRandom ) {

    	var MAP_SPAWN_RATIO = 45,
		CA_PASSES = 8,
		CA_WALL_ADJ_COUNT = 4,
		CA_EMPTY_ADJ_COUNT = 5;

        var MapGen = {

        	output : {},

        	tiles : {

				empty: 0,
				wall: 1

			},

			initialize : function(size, seed) {

				var self = this;

            	if(typeof seed == undefined) seed = 'creed';

            	self.seed = seed;
            	self.size = size;
            	self.randomizer = new MersenneTwister(self.seed);	// don't use SeedRandom since it's undefined from the non-AMD import

            	self.generate();

            },

			rndInt : function(from, to) {

				var self = this;

				return Math.floor(self.randomizer.random() * (to - from + 1) + from);

			},

			mapKey : function(x, y) {

				return 'x' + x + '_y' + y;

			},

            iterate : function(callback) {

            	var self = this;

				for(var x = 0; x < self.size; x++) {
					for(var y = 0; y < self.size; y++) {
						callback.call(self, x, y);
					}
				}

			},

            generate : function() {

            	var self = this;

            	self.output = {};

            	// randomly fill map with tiles
				self.iterate(function(x, y) {

					self.output[self.mapKey(x, y)] = (self.rndInt(0, 100) < MAP_SPAWN_RATIO) ? self.tiles.wall : self.tiles.empty;

				});

				// cellular automata passing
				// tile becomes a wall if it's already a wall and has 4 adjacent wall tiles,
				// or if it's not a wall and 5 adjacent ones are
				var countAdjacentWalls = function(x, y) {

					var count = 0;
					var series = [
						[x-1, y-1],
						[x, y-1],
						[x+1, y-1],
						[x-1, y],
						[x+1, y],
						[x-1, y+1],
						[x, y+1],
						[x+1, y+1]
					];

					for (var i = 0, ln = series.length; i < ln; i++) {
						var key = self.mapKey(series[i][0], series[i][1]);
						if(self.output[key] !== undefined && self.output[key] == self.tiles.wall) count++;
					};

					return count;

				};

				for(var p = 0; p < CA_PASSES ; p++) {

					self.iterate(function(x, y) {

						var adjs = countAdjacentWalls(x, y);
						var tile = self.output[self.mapKey(x, y)];

						self.output[self.mapKey(x, y)] = ((tile == self.tiles.wall && adjs >= CA_WALL_ADJ_COUNT) || (tile == self.tiles.empty && adjs >= CA_EMPTY_ADJ_COUNT)) ? self.tiles.wall : self.tiles.empty;

					});

				}

            },

            getPlotData : function() {

            	var self = this;
            	var plots = [];
            	self.iterate(function(x, y) {

            		if(typeof plots[x] == 'undefined') plots[x] = [];

            		plots[x][y] = { x: x, y: y, attrs : { terrain: self.output[self.mapKey(x, y)] }};

            	});

            	return plots;

            }

        };

        return function (size, seed) {

        	MapGen.initialize(size,seed);
        	return MapGen;

        }

    }
);