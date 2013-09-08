/**
  * runtime.js
  * 
  * 
  **/
define(
    // Name
    'runtime', 
    // Dependencies
    ['emitter'], 
    // Object
    function ( Notifcation ) {
        var RuntimeContext = {
            initialize : function( Game ) {
                //this.Game = Game;
            }
        };

        return function( Game ) {
            _.extend(this,this);
            RuntimeContext.initialize( Game );
            return RuntimeContext;
        }
    }
);