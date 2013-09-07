/**
  * main.js
  * 
  * 
  **/
require(
    // Dependencies
    ['game','runtime'],
    function( Game, Runtime) {
        // Object
        var App = {
            initialize : function() {
                this.Game = new Game({
                    seed : 'creed',
                    ratios : {
                        map : 8,
                        invert : 'random'
                    },
                    user : { /**/ }
                });

                if (this.Game.load() ) {
                    this.beginSession();
                };
            }, 
            beginSession : function() {
                this.session = new Runtime( this.Game );
            },
            endSession : function() {
                this.session.end();
            }
        };
        App.initialize();
    }
);