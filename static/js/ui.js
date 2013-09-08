/**
  * ui.js
  * 
  * 
  **/
define(
    // Name
    'ui', 
    // Dependencies
    [], 
    // Object
    function ( Game ) {

        var UIContext = {

            canvas            : document.createElement('canvas'),
            clickedItems      : [],
            interactiveObjs   : {},

            initialize : function( Game ) {
                var defaults = {
                    backgroundColor : "#333333"
                };
                this.settings = _.extend(defaults,Game.settings,Game.Grid.settings);

                this.Game = Game;

                this.setDefaultInteractiveObjs();

                this.createCanvas();
            },

            setDefaultInteractiveObjs : function () {
                this.interactiveObjs = { // ADD ANY INTERACTIVE OBJECTS TO THIS
                    'click'       : [],
                    'mousedown'   : [],
                    'mouseup'     : [],
                    'mousemove'   : []
                };
            },

            createCanvas : function () {
                this.canvas = document.createElement('canvas');
                this.canvas2dContext = this.canvas.getContext('2d');
                this.canvas.height = this.settings.frameAttrs.height;
                this.canvas.width = this.settings.frameAttrs.width;
                this.canvas.style.backgroundColor = this.settings.backgroundColor;
                this.settings.domContainer.appendChild(this.canvas);
                this.settings.canvasOffsetLeft = this.settings.domContainer.offsetLeft;
                this.settings.canvasOffsetTop = this.settings.domContainer.offsetTop;
            },

            /**
              * makeInteractive
              * Add click / mousedown / mouseup / mousemove interactivity to tiles
              **/
            makeInteractive : function (data) {
                var types = {
                    mousedown : false,
                    mouseup   : false,
                    mousemove : false,
                    click     : false
                };
                for (var type in types) {
                    if (typeof(data[type]) !== 'undefined') {
                        if (typeof(this.interactiveObjs[type][data.x]) == 'undefined') {
                            this.interactiveObjs[type][data.x] = [];
                        }
                        this.interactiveObjs[type][data.x][data.y] = data;
                    }
                }
            },

            /**
              * displayPlot
              * Render a square onto the scene
              **/
            displayPlot : function ( plot ) {
                var conf = {
                        x      : plot.x,
                        y      : plot.y,
                        height : this.settings.gridAttrs.height,
                        width  : this.settings.gridAttrs.width,
                        left   : plot.x * this.settings.gridAttrs.width,
                        top    : plot.y * this.settings.gridAttrs.height
                    },
                sq = this.canvas2dContext;

                conf = this.assignPlotFunctionality( plot, conf );

                sq.beginPath();
                sq.rect(conf.left, conf.top, conf.width, conf.height);
                sq.fillStyle = conf.fillStyle;
                sq.fill();

                // HIGHLIGHT TILE
                if( (typeof(plot.attrs.highlight) != 'undefined') && (plot.attrs.highlight == true)) {
                    sq.beginPath();
                    sq.rect(conf.left, conf.top, conf.width, conf.height);
                    sq.fillStyle = "rgba(100, 155, 155, 0.2)";
                    sq.fill();
                }

                return sq;
            },

            /**
              * showMoveOptions
              **/
            showMoveOptions : function (self, range) {
                this.Game.Grid.clearTmpHighlights();
                var sx = self.x - range,
                    ex = self.x + range,
                    sy = self.y - range,
                    ey = self.y + range;
                if (sx < 0) sx = 0;
                if (sy < 0) sy = 0;
                for (var x = sx; x <= ex; x++) {
                    for (var y = sy; y <= ey; y++) {
                        if (    !(x == self.x && y == self.y) && 
                                (typeof(this.Game.Grid.plot[x]) != 'undefined') && 
                                (typeof(this.Game.Grid.plot[x][y]) != 'undefined')) {
                            // HIGHLIGHT TILE
                            this.Game.Grid.plot[x][y].attrs.highlight = true;
                            this.Game.Grid.tmpHighlights.push([parseInt(x),parseInt(y)]);
                            // ADD TO UPDATE STACK
                            this.Game.Grid.updatePlots.push([parseInt(x),parseInt(y)]);
                        }
                    }
                }
            },

            /**
              * assignPlotFunctionality
              **/
            assignPlotFunctionality : function ( plot, conf ) {
                conf.fillStyle = "rgba(204, 255, 102, 1)";
                if (typeof(plot.attrs.role) != 'undefined') {
                    var self = this;
                    // MAKE INTERACTIVE
                    conf.x     = plot.x;
                    conf.y     = plot.y;
                    switch (plot.attrs.role) {
                        case 'defender':
                            conf.click = (function(){
                                self.showMoveOptions(this, 1);
                                console.log('defend');
                            });
                            this.makeInteractive(conf);
                            conf.fillStyle = "rgba(0, 100, 255, 1)";
                        break;
                        case 'attacker':
                            conf.click = (function(){
                                self.showMoveOptions(this, 2);
                                console.log('attack');
                            });
                            this.makeInteractive(conf);
                            conf.fillStyle = "rgba(255, 100, 255, 1)";
                        break;
                        default:
                            // 
                            conf.click = (function(){
                                console.log('builder');
                            });
                            this.makeInteractive(conf);
                            conf.fillStyle = "rgba(255, 100, 0, 1)";
                    }
                }
                return conf;
            },

            /**
              * updatePlots
              * Called from render
              **/
            bUpdatePlotsActive : false,
            updatePlots : function () {
                if (this.bUpdatePlotsActive === false) {
                    this.bUpdatePlotsActive = true;
                    if (this.Game.Grid.updatePlots.length != 0) {
                        for (var i in this.Game.Grid.updatePlots) {
                            this.displayPlot(this.Game.Grid.plot[this.Game.Grid.updatePlots[i][0]][this.Game.Grid.updatePlots[i][1]]);
                        }
                    }
                    this.Game.Grid.updatePlots = [];
                    this.bUpdatePlotsActive = false;
                }
            },

            /**
              * collisionDetection
              * Takes an x and y co-ord (from cursor) and checks to see what items it collides with
              **/
            collisionDetection : function ( collection, left, top ) {
                // COLLISION DETECTION
                var hit = [];
                for (var x in collection) {
                    for (var y in collection[x]) {
                        if (top > collection[x][y].top && top < collection[x][y].top + collection[x][y].height 
                            && left > collection[x][y].left && left < collection[x][y].left + collection[x][y].width) {
                                hit.push(collection[x][y]);
                        }
                    }
                }
                return (hit.length === 0) ? false : hit;
            },

            /**
              * loadEvents
              * Adds scene event listeners
              **/
            loadEvents : function () {
                var self = this;
                // CLICK
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
                // MOUSEDOWN
                this.canvas.addEventListener('mousedown', function(e) {
                    self.mousedown = true;
                });
                // MOUSEUP
                document.addEventListener('mouseup', function(e) {
                    self.mousedown = false;
                });
                // MOUSEMOVE
                this.canvas.addEventListener('mousemove', function(e) {
                    if (self.mousedown) {
                        // DRAG

                    }
                });
            },
        };

        return function( Game ) {
            _.extend(this,this);
            UIContext.initialize( Game );
            return UIContext;
        }
    }
);