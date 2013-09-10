/**
  * main.js
  *
  *
  **/
define(
    // Dependencies
    ['game','runtime'],
    // Object
    function( Game, Runtime) {
        var App = {

            initialize : function() {

                this.Game = new Game({
                    domContainer : document.getElementById('game'),
                    frameAttrs : {
                        height : 800,
                        width  : 800
                    }
                });

                if (this.Game.ready()) {
                    this.beginSession();
                }

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