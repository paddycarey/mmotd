/**
  * ui.js
  * 
  * This file is pretty shitty at the moment - need to merge methods & add params etc
  **/
define(
    // Name
    'UIManager', 
    // Dependencies
    ['emitter'], 
    // Object
    function ( Notifcation ) {

        return {

            clickedItems      : [],
            mousedown         : false,
            domActorToolbar   : document.getElementById('actorPopup'),
            domBuilderToolbar : document.getElementById('builderPopup'),
            canvas            : document.createElement('canvas'),
            interactiveObjs   : { // ADD ANY INTERACTIVE OBJECTS TO THIS
                'click'       : [],
                'mousedown'   : [],
                'mouseup'     : [],
                'mousemove'   : []
            },

            initialize : function( Game ) {

                var defaults = {
                    
                };
                this.settings = _.extend(defaults, Game.settings);
                
                this.Game = Game;
                
                this.assignTileToolbarButtonActions();

                this.loadEvents();

            },

            lastClickedItem : function () {
                return this.clickedItems[this.clickedItems.length - 1];
            },

            assignTileToolbarButtonActions : function () {
                var self = this;
                
                // ALL TEST BUTTONS AT THE MOMENT
                
                // ACTOR OPTS
                // MOVE
                document.getElementById('btn_a').onclick = function () {
                    self.Game.grid.showActorMoveOptions( self.lastClickedItem().gridPoint.x, self.lastClickedItem().gridPoint.y, 1 );
                    self.closeActorToolbar();
                };
                // ACTION
                document.getElementById('btn_b').onclick = function () {
                    console.log('clicked b');
                    self.openActorToolbar();
                };
                
                // BUILDER OPTS
                document.getElementById('btn_c').onclick = function () {
                    console.log('clicked c');
                    document.getElementById('builderPopupOpts').style.display = 'block';
                };
                // ADD DEFENDER
                document.getElementById('btn_d').onclick = function () {
                    var actors = [  [   self.lastClickedItem().gridPoint.x,
                                        self.lastClickedItem().gridPoint.y,
                                        'defender']];
                    
                    // REVIEW HOW THIS IS DONE! NOT EFFICIENT (for bubbling)
                    self.interactiveObjs.click.reverse();
                    self.Game.grid.placeActors( actors );
                    self.closeBuilderToolbar();
                    self.interactiveObjs.click.reverse();
                };

                // ADD ATTACKER
                document.getElementById('btn_e').onclick = function () {
                    var actors = [  [   self.lastClickedItem().gridPoint.x,
                                        self.lastClickedItem().gridPoint.y,
                                        'attacker']];
                    
                    // REVIEW HOW THIS IS DONE! NOT EFFICIENT (for bubbling)
                    self.interactiveObjs.click.reverse();
                    self.Game.grid.placeActors( actors );
                    self.closeBuilderToolbar();
                    self.interactiveObjs.click.reverse();
                };
            },

            openActorToolbar : function ( x, y ) {
                this.domActorToolbar.style.display = 'block';
                this.domActorToolbar.style.left = x + 'px';
                this.domActorToolbar.style.top = y + 'px';
            },

            closeActorToolbar : function () {
                this.domActorToolbar.style.display = 'none';
            },

            openBuilderToolbar : function ( x, y ) {
                this.domBuilderToolbar.style.display = 'block';
                this.domBuilderToolbar.style.left = x + 'px';
                this.domBuilderToolbar.style.top = y + 'px';
            },

            closeBuilderToolbar : function () {
                this.domBuilderToolbar.style.display = 'none';
            },

            makeInteractive : function (data) {
                var defaults = {
                    mousedown : false,
                    mouseup   : false,
                    mousemove : false,
                    click     : false
                };
                for (var type in defaults) {
                    if (typeof(data[type]) !== 'undefined') {
                        this.interactiveObjs[type].push(data);
                    }
                }
            },

            collisionDetection : function ( collection, x, y ) {
                // COLLISION DETECTION
                var hit = [];
                for (var i = 0, l = collection.length; i < l; i++) {
                    if (y > collection[i].top && y < collection[i].top + collection[i].height 
                        && x > collection[i].left && x < collection[i].left + collection[i].width) {
                            hit.push(collection[i]);
                    }
                }
                return (hit.length === 0) ? false : hit;
            },

            loadEvents : function () {

                var self = this;

                // CLICK
                this.interactiveObjs.click.reverse();
                this.canvas.addEventListener('click', function(e) {
                    self.clickedItems = []; // Reset
                    var x = e.pageX - self.settings.canvasOffsetLeft,
                        y = e.pageY - self.settings.canvasOffsetTop,
                        collisions = self.collisionDetection(self.interactiveObjs.click, x, y);
                    if (collisions) {
                        for (obj in collisions) {
                            self.clickedItems.push(collisions[obj]);
                            collisions[obj].click();
                            if (collisions[obj].stopClickBubble) break;
                        }
                    }
                }, false);
                this.canvas.addEventListener('mousedown', function(e) {
                    self.mousedown = true;
                });
                document.addEventListener('mouseup', function(e) {
                    self.mousedown = false;
                });
                this.canvas.addEventListener('mousemove', function(e) {
                    if (self.mousedown) {
                        // DRAG

                    }
                });
            },
        }
    }
);