/**
  * coords.js
  * 
  * 
  **/
define(
    // Name
    'gridManager',
    // Dependencies
    ['emitter', 'UIManager'],
    // Object
    function ( Notification, UIManager ) {
        var GridmanagerContext = {

            gridPoint       : [], // gridPoint.x.y = GRID INFO

            initialize : function( settings ) {
                var defaults = {
                    gridAttrs : {
                        height : 40,
                        width  : 40
                    },
                    canvasBackground : "url('/static/imgs/grid_40x40.jpg')"
                };

                this.settings = _.extend(defaults,settings);

                this.initFrame();
                this.createGrid();
                this.placeBuildPoints();
                this.placeActors();
                
            },

            initFrame : function() {

                // CREATE CANVAS ELEMENT
                UIManager.canvas = document.createElement('canvas');
                UIManager.canvas.height = this.settings.frameAttrs.height;
                UIManager.canvas.width = this.settings.frameAttrs.width;

                // SET CANVAS STYLES
                UIManager.canvas.style.backgroundImage = this.settings.canvasBackground;

                // ASSIGN CANVAS TO DOM
                this.settings.domContainer.appendChild(UIManager.canvas);

                return false;
            },

            createGrid : function () {

                this.cols = Math.ceil(this.settings.frameAttrs.width / this.settings.gridAttrs.width),
                this.rows = Math.ceil(this.settings.frameAttrs.height / this.settings.gridAttrs.height);
                this.total = this.cols * this.rows;

                var y = 0;
                for (var i = 0; i < this.total; i++) {
                    var x   = i%this.cols;
                    if (i != 0 && (x == 0)) {
                        y++;
                    }
                    if (typeof(this.gridPoint[x]) == 'undefined') {
                        this.gridPoint[x] = [];
                    }

                    var left = (x * this.settings.gridAttrs.width),
                        top  = (y * this.settings.gridAttrs.height);

                    this.gridPoint[x][y] = {
                        sq         : this.placeGridRect ( left, top ),
                        buildPoint : false,
                        actor      : false,
                        x          : x,
                        y          : y,
                        top        : top,
                        left       : left,
                    }
                }

            },

            placeGridRect : function ( x, y, settings ) {

                var defaults = {
                    fillStyle : "rgba(100, 100, 255, 0.2)"
                };
                settings = _.extend(defaults,settings);
                var sq = UIManager.canvas.getContext('2d');
                sq.beginPath();
                sq.rect(x, y, this.settings.gridAttrs.width, this.settings.gridAttrs.height);
                sq.fillStyle = settings.fillStyle;
                sq.fill();
                return sq;
            },

            /**
              * placeBuildPoints
              * Areas of the map which a user can build on
              **/
            placeBuildPoints : function () {
                // CONFIG
                var buildSettings = {
                    fillStyle : "rgba(100, 255, 100, 0.5)"
                };
                var self = this;
                // STATIC DATA FOR NOW
                var data = [    [3,1],
                                [4,4],
                                [5,6],
                                [8,8]];
                for (var i = 0, t = data.length; i < t; i++) {
                    this.gridPoint[data[i][0]][data[i][1]].buildPoint = {
                        sq   : this.placeGridRect(data[i][0] * this.settings.gridAttrs.width, data[i][1] * this.settings.gridAttrs.height, buildSettings),
                        role : 'builder'
                    };

                    UIManager.makeInteractive({
                        top        : data[i][1] * this.settings.gridAttrs.height,
                        left       : data[i][0] * this.settings.gridAttrs.width,
                        width      : this.settings.gridAttrs.width,
                        height     : this.settings.gridAttrs.height,
                        canvasElem : this.gridPoint[data[i][0]][data[i][1]].buildPoint.sq,
                        click      : (function(){
                            self.assignBuilderClick(this.gridPoint);
                        }),
                        gridPoint : this.gridPoint[data[i][0]][data[i][1]]
                    });
                }
            },

            /**
              * placeActors
              * This should place any actor elements onto the grid. Attaches data
              * onto this.gridPoint[x][y].actor
              **/
            placeActors : function () {
                // CONFIG
                var actorSettings = {
                    fillStyle : "rgba(255, 100, 100, 0.5)"
                };
                var self = this;
                // STATIC DATA FOR NOW
                var data = [    //[3,1,'defender'],
                                [4,4,'defender'],
                                [5,6,'attacker'],
                                //[8,8,'defender']
                                ];
                for (var i = 0, t = data.length; i < t; i++) {
                    this.gridPoint[data[i][0]][data[i][1]].actor = {
                        sq   : this.placeGridRect(data[i][0] * this.settings.gridAttrs.width, data[i][1] * this.settings.gridAttrs.height, actorSettings),
                        role : data[i][2]
                    };

                    UIManager.makeInteractive({
                        top        : data[i][1] * this.settings.gridAttrs.height,
                        left       : data[i][0] * this.settings.gridAttrs.width,
                        width      : this.settings.gridAttrs.width,
                        height     : this.settings.gridAttrs.height,
                        canvasElem : this.gridPoint[data[i][0]][data[i][1]].actor.sq,
                        click      : (function(){
                            self.assignActorClick(this.gridPoint);
                        }),
                        stopClickBubble : true,
                        gridPoint : this.gridPoint[data[i][0]][data[i][1]]
                    });
                }
            },

            /**
              * assignBuilderClick
              * If a tile can be built upon, this method will be called for it
              **/
            assignBuilderClick : function ( gridPoint ) {
                if (gridPoint.buildPoint !== false) {
                    var x = gridPoint.left + this.settings.gridAttrs.width + this.settings.canvasOffsetLeft,
                        y = gridPoint.top + this.settings.gridAttrs.height + this.settings.canvasOffsetTop;
                    UIManager.openTileToolbar( x, y );
                }
            },

            /**
              * assignActorClick
              **/
            assignActorClick : function ( gridPoint ) {
                switch (gridPoint.actor.role) {
                    case 'defender':
                        console.log('defend options');
                    break;
                    case 'attacker':
                        console.log('attack options');
                    break;
                }
            }
        };
        return function( settings ) {
            _.extend(this,this);
            GridmanagerContext.initialize(settings);
            return GridmanagerContext;
        }
    }
);