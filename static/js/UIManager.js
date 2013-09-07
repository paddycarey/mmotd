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

            events          : [],
            domTileToolbar  : document.getElementById('toolPopup'),
            canvas          : document.createElement('canvas'),
            interactiveObjs : { // ADD ANY INTERACTIVE OBJECTS TO THIS
                'click'     : [],
                'mousedown' : [],
                'mouseup'   : [],
                'mousemove' : []
            },

            initialize : function( Game ) {

                var defaults = {
                    
                };
                this.settings = _.extend(defaults, Game.settings);
                
                this.Game = Game;
                
                this.assignTileToolbarButtonActions();

                this.loadEvents();

            },

            assignTileToolbarButtonActions : function () {
                var self = this;
                // TEST BTN A
                document.getElementById('btn_a').onclick = function () {
                    console.log('clicked a');
                    self.closeTileToolbar();
                };
                // TEST BTN B
                document.getElementById('btn_b').onclick = function () {
                    console.log('clicked b');
                    self.closeTileToolbar();
                };
            },

            openTileToolbar : function ( x, y ) {
                this.domTileToolbar.style.display = 'block';
                this.domTileToolbar.style.left = x + 'px';
                this.domTileToolbar.style.top = y + 'px';
            },

            closeTileToolbar : function () {
                this.domTileToolbar.style.display = 'none';
            },

            add : function( events ) {
                /**/
            },

            loadEvents : function () {
                var parent = this;

                // CLICK
                this.interactiveObjs.click.reverse();
                this.canvas.addEventListener('click', function(e) {
                    var x = e.pageX - parent.settings.canvasOffsetLeft,
                        y = e.pageY - parent.settings.canvasOffsetTop,
                        collisions = parent.collisionDetection(parent.interactiveObjs.click, x, y);
                    if (collisions) {
                        for (obj in collisions) {
                            collisions[obj].click();
                            if (collisions[obj].stopClickBubble) break;
                        }
                    }
                });
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
        }
    }
);