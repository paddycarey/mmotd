/**
  * grid.js
  * 
  * 
  **/
define(
    // Name
    'grid', 
    // Dependencies
    [], 
    // Object
    function () {
        var GridContext = {
            
            plot          : [], // CONTAINS ALL DATA RELATED TO A SQUARE
            tmpHighlights : [], // LIST OF HIGHLIGHTED PLOTS
            updatePlots   : [], // ANY PLOTS THAT NEED TO BE UPDATED BY THE RENDER

            initialize : function( settings ) {
                var defaults = {
                    gridAttrs : {
                        height : 40,
                        width  : 40
                    }
                };
                this.settings = _.extend(defaults, settings);
            },

            initiateGrid : function () {
                this.cols = Math.ceil(this.settings.frameAttrs.width / this.settings.gridAttrs.width),
                this.rows = Math.ceil(this.settings.frameAttrs.height / this.settings.gridAttrs.height);
                this.total = this.cols * this.rows;
                for (var x = 0; x < this.cols; x++) {
                    this.plot[x] = [];
                    for(var y = 0; y < this.rows; y++) {
                        // CREATE PLOT OBJ
                        this.plot[x][y] = {
                            x      : x,
                            y      : y,
                            attrs  : {}
                        };
                        // TELL RENDERER THAT IT NEEDS DISPLAYED
                        this.updatePlots.push([x,y]);
                    }
                }
            },

            clearTmpHighlights : function () {
                for (var i in this.tmpHighlights) {
                    this.plot[this.tmpHighlights[i][0]][this.tmpHighlights[i][1]].attrs.highlight = false;
                    this.updatePlots.push([this.tmpHighlights[i][0],this.tmpHighlights[i][1]]);
                }
            },
        };

        return function( settings ) {
            _.extend(this,this);
            GridContext.initialize(settings);
            return GridContext;
        }
    }
);