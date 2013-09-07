/**
  * runtime.js
  * 
  * 
  **/
define(
    // Name
    'runtime', 
    // Dependencies
    ['emitter','UIManager'], 
    // Object
    function ( Notifcation, UI ) {
        // Game session is isolated from actual defination logic
        var RuntimeContext = function( Game ) {
            this.Game = Game;
            this.initialize();
        };
        RuntimeContext.prototype.initialize = function() {
            // start the game
            // begin UI
            UI.begin( this.Game );
        };
        RuntimeContext.prototype.end = function() {
            // end game
            Notification.emit('endGame',state);
        }
        return RuntimeContext;
    }
);