/**
  * coords.js
  * 
  * 
  **/
define(
    // Name
    'gridManager',
    // Dependencies
    ['emitter'],
    // Object
    function ( Notification ) {

        var GridmanagerContext = {

            gridPoint       : [], // gridPoint.x.y = GRID INFO
            plot            : [], // plot.x.y = EVERYTHING ASSIGNED TO A PLOT

            initialize : function( settings, UIManager ) {

                var defaults = {

                };

                // STATIC DATA FOR NOW
                var actors = [  [4,4,'defender'],
                                [5,6,'attacker']
                                ];

                this.UIManager = UIManager;
                this.settings = _.extend(defaults, settings, UIManager.settings);

                this.createGrid();
                this.placeBuildPoints();
                this.placeActors( actors );
                
            },

            /**
              * createGrid
              * Create the initial set of rows and columns that make up the grid
              **/
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

            /**
              * placeGridRect
              * Create a square at a particular left + top position
              **/
            placeGridRect : function ( left, top, settings ) {

                var defaults = {
                    fillStyle : "rgba(100, 100, 255, 0.2)"
                };
                settings = _.extend(defaults,settings);
                var sq = this.UIManager.canvas.getContext('2d');
                sq.beginPath();
                sq.rect(left, top, this.settings.gridAttrs.width, this.settings.gridAttrs.height);
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

                    this.UIManager.makeInteractive({
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
            placeActors : function ( data ) {
                // CONFIG
                var actorSettings = {
                    fillStyle : "rgba(255, 100, 100, 0.5)"
                };
                var self = this;
                
                for (var i = 0, t = data.length; i < t; i++) {
                    this.gridPoint[data[i][0]][data[i][1]].actor = {
                        sq   : this.placeGridRect(data[i][0] * this.settings.gridAttrs.width, data[i][1] * this.settings.gridAttrs.height, actorSettings),
                        role : data[i][2]
                    };

                    this.UIManager.makeInteractive({
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
              * Clicked on a tile that can have something built on it
              **/
            assignBuilderClick : function ( gridPoint ) {
                if (gridPoint.buildPoint !== false) {
                    var left = gridPoint.left + this.settings.gridAttrs.width + this.settings.canvasOffsetLeft,
                        top  = gridPoint.top + this.settings.gridAttrs.height + this.settings.canvasOffsetTop;
                    this.UIManager.openBuilderToolbar( left, top );
                }
            },

            /**
              * assignActorClick
              * Clicked an actor on the stage (eg. builder / defender)
              **/
            assignActorClick : function ( gridPoint ) {
                var left = gridPoint.left + this.settings.gridAttrs.width + this.settings.canvasOffsetLeft,
                    top  = gridPoint.top + this.settings.gridAttrs.height + this.settings.canvasOffsetTop;
                this.UIManager.openActorToolbar( left, top, gridPoint.actor.role );
            },

            /**
              * showActorMoveOptions
              * Display a selectable perimeter around a plot
              **/
            showActorMoveOptions : function ( x, y, stepSize ) {
                var l = (stepSize*2)+1;
                for (var _x = x-stepSize, t = _x + l; _x < t; _x++) {
                    for (var _y = y-stepSize, yt = _y + l; _y < yt; _y++) {
                        if (!(x == _x && y == _y)) {
                            this.placeGridRect( _x * this.settings.gridAttrs.width, _y * this.settings.gridAttrs.width, { fillStyle : "rgba(100, 200, 0, 0.2)" } );
                            // @notes:
                            // add the above to a tmp[] storage so those tiles can be instantly removed
                        }
                    }
                }
            }
        };
        return function( settings, UIManager ) {
            _.extend(this,this);
            GridmanagerContext.initialize(settings, UIManager);
            return GridmanagerContext;
        }
    }
);