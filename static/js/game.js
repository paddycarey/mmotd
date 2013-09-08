/**
  * game.js
  * 
  * 
  **/
define(
    // Name
    'game', 
    // Dependencies
    ['emitter','UIManager', 'gridManager','gameUtils'], 
    // Object
    function( Notification, UIManager, GridManager, GameUtils ) {
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

                    // CALL LIBS REQUIRED TO START GAME
                    this.uiManager = new UIManager(this.settings);
                    this.grid = new GridManager(this.settings, this.uiManager);
                    this.uiManager.setGrid(this.grid);
                    this.uiManager.assignControls(this.grid);


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