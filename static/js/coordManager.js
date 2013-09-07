/**
  * coords.js
  * 
  * 
  **/
define(
    // Name
    'coordsManager',
    // Dependencies
    ['emitter'],
    function( Notification ) {
        var Manager = function() {
            var _checkPoints = function( x, y ) {
                // hook to Worker
            };
            /* Public API for system to use */
            return {
                reviewPoints : function( x, y ) {
                    if( _checkPoints(x,y) ) {
                        /***/
                    };
                }
            };
        };
        return new Manager;
    }
);