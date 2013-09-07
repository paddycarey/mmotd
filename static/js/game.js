/**
  * game.js
  * 
  * 
  **/
define(
    // Name
    'game', 
    // Dependencies
    ['emitter','gridManager','gameUtils'], 
    // Object
    function( Notification, GridManager, GameUtils ) {
        var GameContext = {

            initialize : function( settings ) {
                var defaults = {};
                this.settings = _.extend(defaults,settings);
            },
            utils : GameUtils,
            load : function() {
                if (this.settings.domContainer) {

                    // WORK OUT OFFSETS
                    this.settings.canvasOffsetLeft = this.settings.domContainer.offsetLeft;
                    this.settings.canvasOffsetTop = this.settings.domContainer.offsetTop;

                    // CREATE CANVAS ELEM
                    this.grid = new GridManager(this.settings);


                    return true;
                }
                return false;
            }
        };
        return function( settings ) {
            _.extend(this,this);
            GameContext.initialize(settings);
            return GameContext;
        }
    }
);