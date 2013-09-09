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
                    backgroundColor : 0x333333
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
                this.canvas = new PIXI.Stage(this.settings.backgroundColor);
                this.renderer = PIXI.autoDetectRenderer(this.settings.frameAttrs.height, this.settings.frameAttrs.width);
                this.settings.domContainer.appendChild(this.renderer.view);
                this.settings.canvasOffsetLeft = this.settings.domContainer.offsetLeft;
                this.settings.canvasOffsetTop = this.settings.domContainer.offsetTop;
                // TEXTURES
                this.textures = {
                    grid : PIXI.Texture.fromImage("/static/imgs/grid_sq_40x40.jpg")
                };
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
                /*
                var conf = {
                        x      : plot.x,
                        y      : plot.y,
                        height : this.settings.gridAttrs.height,
                        width  : this.settings.gridAttrs.width,
                        left   : plot.x * this.settings.gridAttrs.width,
                        top    : plot.y * this.settings.gridAttrs.height
                    },
                sq = new PIXI.Sprite(this.textures.grid);
                sq.anchor.x = 0.5;
                sq.anchor.y = 0.5;
                
                conf = this.assignPlotFunctionality( plot, conf, sq );
                
                //sq.lineStyle(1, 0xFF0000);    // STROKE = RED
                //sq.beginFill(conf.fillStyle); // FILL
                
                //sq.drawRect(conf.left, conf.top, conf.width, conf.height);
                
                this.canvas.addChild(sq);

                // HIGHLIGHT TILE
                if( (typeof(plot.attrs.highlight) != 'undefined') && (plot.attrs.highlight == true)) {
                    sq.rect(conf.left, conf.top, conf.width, conf.height);
                    sq.fillStyle = 0xFFCC00;
                    this.canvas.addChild(sq);
                }

            
                sq.click = sq.touchstart = function(data){
                    data.originalEvent.preventDefault();
                    console.log('down');
                };

                return sq;
                */
               console.log('x');
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
                            // ENSURE THIS DOESNT COLLIDE WITH AN ACTOR
                            if (    (typeof(this.Game.Grid.plot[x][y].attrs.role) == 'undefined') || 
                                    (this.Game.Grid.plot[x][y].attrs.role == '')) {
                                // HIGHLIGHT TILE
                                this.Game.Grid.plot[x][y].attrs.highlight = true;
                                this.Game.Grid.tmpHighlights.push([parseInt(x),parseInt(y)]);
                                // ADD TO UPDATE STACK
                                this.Game.Grid.updatePlots.push([parseInt(x),parseInt(y)]);
                            } else {
                                // COLLIDED WITH ACTOR
                                if (this.settings.myTeam != this.Game.Grid.plot[x][y].attrs.team) {
                                    // OTHER TEAMS ACTOR
                                    console.log('Highlight collided with other teams ' + this.Game.Grid.plot[x][y].attrs.role + ' at ' + x + ', ' + y);
                                }
                            }
                        }
                    }
                }
            },

            /**
              * assignPlotFunctionality
              **/
            assignPlotFunctionality : function ( plot, conf, sq ) {
                conf.fillStyle  = 0x00FF00;
                conf.x          = plot.x;
                conf.y          = plot.y;
                var interactive = true;
                if (plot.attrs.team != this.settings.myTeam) {
                    interactive = false;
                }

                if (typeof(plot.attrs.role) != 'undefined') {
                    var self = this;
                    // MAKE INTERACTIVE

                    switch (plot.attrs.role) {
                        case 'defender':
                            if (interactive) {
                                sq.click = sq.touchstart = function(data){
                                    self.showMoveOptions(this, 1);
                                    console.log('defend');
                                };
                                this.makeInteractive(conf);
                            }
                            conf.fillStyle = 0xFF0000;
                        break;
                        case 'attacker':
                            if (interactive) {
                                sq.click = sq.touchstart = function(data){
                                    self.showMoveOptions(this, 2);
                                    console.log('attack');
                                };
                                this.makeInteractive(conf);
                            }
                            conf.fillStyle = 0xCCFF66;
                        break;
						default:
                            if (interactive) {
    							sq.click = sq.touchstart = function(data){
    								console.log('builder');
    							};
    							this.makeInteractive(conf);
							}
							conf.fillStyle = 0x00FF99;
							break;

                    }
                } else {

                	switch (plot.attrs.terrain) {
						case 1:
							//console.log('found terrain at', conf.x, conf.y);
							conf.fillStyle = 0x33FF00;
							break;
						default:
							break;
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
        };

        return function( Game ) {
            UIContext.initialize( Game );
            return UIContext;
        }
    }
);