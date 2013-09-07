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
            interactiveObjs : { // ADD ANY INTERACTIVE OBJECTS TO THIS
                'click'     : [],
                'mousedown' : [],
                'mouseup'   : [],
                'mousemove' : []
            },

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
                //this.placeActorPoints();
                this.addMouseListeners();
            },

            initFrame : function() {
                
                // CREATE CANVAS ELEMENT
                this.canvas = document.createElement('canvas');
                this.canvas.height = this.settings.frameAttrs.height;
                this.canvas.width = this.settings.frameAttrs.width;

                // SET CANVAS STYLES
                this.canvas.style.backgroundImage = this.settings.canvasBackground;

                // ASSIGN CANVAS TO DOM
                this.settings.domContainer.appendChild(this.canvas);

                // FIGURE OUT OFFSETS
                this.canvasOffsetLeft = this.settings.domContainer.offsetLeft;
                this.canvasOffsetTop = this.settings.domContainer.offsetTop;

                return false;
            },

            addMouseListeners : function () {
                var parent = this;

                // CLICK
                this.canvas.addEventListener('click', function(e) {
                    var x = e.pageX - parent.canvasOffsetLeft,
                        y = e.pageY - parent.canvasOffsetTop,
                        collisions = parent.collisionDetection(parent.interactiveObjs.click, x, y);
                    if (collisions) {
                        for (obj in collisions) {
                            collisions[obj].click();
                        }
                    }
                });
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
                    this.gridPoint[x][y] = {
                        sq         : this.placeGridRect ( x, y ),
                        buildPoint : false,
                        actor      : false,
                        x          : x,
                        y          : y
                    }
                }

            },

            placeGridRect : function ( x, y, settings ) {
                var defaults = {
                    fillStyle : "rgba(100, 100, 255, 0.2)"
                };
                settings = _.extend(defaults,settings);
                x *= this.settings.gridAttrs.width;
                y *= this.settings.gridAttrs.width;
                var sq = this.canvas.getContext('2d');
                sq.beginPath();
                sq.rect(x, y, this.settings.gridAttrs.width, this.settings.gridAttrs.height);
                sq.fillStyle = settings.fillStyle;
                sq.fill();
                return sq;
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

            /**
              * placeBuildPoints
              * Areas of the map which a user can build on
              **/
            placeBuildPoints : function () {
                // CONFIG
                var buildSettings = {
                    fillStyle : "rgba(100, 255, 100, 0.5)"
                };
                // STATIC DATA FOR NOW
                var data = [    [3,1],
                                [4,4],
                                [5,6],
                                [8,8]];
                for (var i = 0, t = data.length; i < t; i++) {
                    this.gridPoint[data[i][0]][data[i][1]].buildPoint = {
                        sq   : this.placeGridRect(data[i][0], data[i][1], buildSettings),
                        role : 'builder'
                    };
                    this.assignBuilderRole(data[i][0], data[i][1]);

                    this.makeInteractive({
                        top        : data[i][1] * this.settings.gridAttrs.height,
                        left       : data[i][0] * this.settings.gridAttrs.width,
                        width      : this.settings.gridAttrs.width,
                        height     : this.settings.gridAttrs.height,
                        canvasElem : this.gridPoint[data[i][0]][data[i][1]].buildPoint.sq,
                        click      : (function(){
                            var a = 7;
                            var b = 4;
                            console.log(a*b);
                        })
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
                // STATIC DATA FOR NOW
                var data = [    [3,1,'defender'],
                                [4,4,'defender'],
                                [5,6,'attacker'],
                                [8,8,'defender']];
                for (var i = 0, t = data.length; i < t; i++) {
                    if (this.gridPoint[data[i][0]][data[i][1]].buildPoint !== false) {
                        this.gridPoint[data[i][0]][data[i][1]].actor = {
                            sq   : this.placeGridRect(data[i][0], data[i][1], actorSettings),
                            role : data[i][2]
                        };
                        this.assignActorRoles(data[i][0], data[i][1], data[i][2]);
                    }
                }
            },

            /**
              * assignBuilderRole
              * If a tile can be built upon, this method will be called for it
              **/
            assignBuilderRole : function ( x, y ) {
                if (this.gridPoint[x][y].buildPoint !== false) {
                    //this.gridPoint[x][y].sq.style.display = 'none';
                    //console.log(this.gridPoint[x][y].sq);
                }
            },

            /**
              * assignActorRoles
              **/
            assignActorRoles : function ( x, y, role ) {
                //this.gridPoint[x][y].actor;
            }
        };
        return function( settings ) {
            _.extend(this,this);
            GridmanagerContext.initialize(settings);
            return GridmanagerContext;
        }
    }
);