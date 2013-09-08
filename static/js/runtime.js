/**
  * runtime.js
  * 
  * 
  **/
define(
    // Name
    'runtime', 
    // Dependencies
    ['ui'], 
    // Object
    function ( UIManager ) {
        var RuntimeContext = {

            initialize : function( Game ) {

                this.Game = Game;
                this.UIManager = new UIManager (this.Game);

                this.render();
                this.UIManager.loadEvents();

            },

            loadData : function () {
                // STATIC DATA FOR NOW
                var data = {
                    tstamp : 1378668434795,
                    plots  :    []
                };
                for (var x = 2; x < 13; x++) {
                    data.plots[x] = [];
                    for (var y = 2; y < 9; y++) {
                        data.plots[x][y] = { x: x, y: y, attrs : { }};
                    }
                }
                data.plots[1] = [];
                data.plots[1][1] = { x: 1, y: 1, attrs : { }};
                data.plots[1][2] = { x: 1, y: 2, attrs : { }};
                data.plots[1][3] = { x: 1, y: 3, attrs : { }};
                data.plots[4][4] = { x: 4, y: 4, attrs : { role:'defender'}};
                data.plots[5][6] = { x: 5, y: 6, attrs : { role:'attacker'}};
                data.plots[13] = [];
                data.plots[13][2] = { x: 13, y: 2, attrs : { }};
                data.plots[13][3] = { x: 13, y: 3, attrs : { role:'attacker' }};
                data.plots[13][6] = { x: 13, y: 6, attrs : { }};
                
                return data;
            },

            render : function () {
                var self  = this,
                    frame = 0;
                (function animloop(){
                    requestAnimFrame(animloop);

                    self.Game.setData(self.loadData());

                    if (frame%2==0) {
                        // UPDATE PLOTS
                        self.UIManager.updatePlots();
                    }

                    frame++;
                })();
            }
        };

        return function( Game ) {
            _.extend(this,this);
            RuntimeContext.initialize( Game );
            return RuntimeContext;
        }
    }
);