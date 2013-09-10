/**
  * runtime.js
  *
  *
  **/
define(
    // Dependencies
    ['ui', 'mapgen', 'utils/timer'],
    // Object
    function ( UIManager, MapGen, Timer ) {
        var RuntimeContext = {

            initialize : function( Game ) {

                this.Game = Game;
                this.UIManager = new UIManager (this.Game);
                this.MapGen = new MapGen(200, 'testseed');

                this.render();
                this.UIManager.loadEvents();
                Timer.start();
                Timer.add(_.bind(this.update, this), 50, -1); // Logic loop
            },

            loadData : function () {

                var data = {
                    tstamp : 1378668434795,
                    plots  :    []
                };

                data.plots = this.MapGen.getPlotData();

                data.plots[4][4].attrs = {
                    role : 'defender',
                    team : 0
                };
                data.plots[5][6].attrs = {
                    role : 'defender',
                    team : 0
                };
                data.plots[5][7].attrs = {
                    role : 'attacker',
                    team : 0
                };
                data.plots[7][8].attrs = {
                    role : 'attacker',
                    team : 1
                };

                return data;
            },

            render : function () {
                var self  = this,
                    frame = 0;

                    self.Game.setData(self.loadData());

					(function animloop(){
						requestAnimFrame(animloop);

						//self.Game.setData(self.loadData());

						if (frame%2==0) {
							// UPDATE PLOTS
						}

						frame++;
					})();
            },

            update : function(elapsed){
                var me = this;
                me.UIManager.updatePlots();

            }
        };

        return function( Game ) {
            _.extend(this,this);
            RuntimeContext.initialize( Game );
            return RuntimeContext;
        }
    }
);