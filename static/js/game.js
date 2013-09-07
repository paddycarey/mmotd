/**
  * game.js
  * 
  * 
  **/
define(
    // Name
    'game', 
    // Dependencies
    ['emitter','coordManager','gameUtils'], 
    function( Notification, CoordManager, GameUtils ) {
        var GameContext = {
            initialize : function( settings ) {
                var defaults = {};
                this.settings = _.extend(defaults,settings);
                /*
                Notification.on('switch', function() {
                    this.utils.Pixi.render();
                }, this);
                Notification.on('endGame',function( state ) {
                    this.teardown(state);
                }, this);
                */
            },
            utils : GameUtils,
            Coords : CoordManager,
            load : function() {
                return true;
            }
        };
        return function( settings ) {
            _.extend(this,this);
            GameContext.initialize(settings);
            return GameContext;
        }
    }
);