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
    function ( Notifcation, UIManager ) {
        var RuntimeContext = {
            initialize : function( Game ) {
                this.Game = Game;
                UIManager.initialize( this.Game );
            }
        };

        return function( Game ) {
            _.extend(this,this);
            RuntimeContext.initialize( Game );
            return RuntimeContext;
        }
    }
);