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
                    domContainer : document.getElementById('game'),
                    frameAttrs : {
                        height : 400,
                        width  : 640
                    }
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