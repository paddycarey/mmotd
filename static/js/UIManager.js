/**
  * ui.js
  * 
  * 
  **/
define(
    // Name
    'UIManager', 
    // Dependencies
    ['emitter'], 
    // Object
    function ( Notifcation ) {
        return {
            events : [],
            begin : function( Game ) {
                this.el = Game.canvas;
                this.Game = Game;
                //or hardwire into pixi
                //this.el = Game.utils.Pixi.canvas;
                //_.extend(this.events, Game.util.Pixi.eventManager);
                //end
                this.loadEvents();
            },
            add : function( events ) {
                /**/
            },
            loadEvents : function() {
                this.add({
                    mousedown : function( event ) {
                        this.Game.util.reviewPoints( event.x, event.y );
                    }
                });
            }
        }
    }
);