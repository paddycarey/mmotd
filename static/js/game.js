/**
  * game.js
  *
  *
  **/
define(
    // Name
    'game',
    // Dependencies
    ['grid'],
    // Object
    function( GridManager ) {

        var GameContext = {

            dataTimestamp : 0,

            initialize : function ( settings ) {

                var defaults = {
                    frameAttrs : {
                        height : 800,
                        width  : 800
                    },
                    myTeam     : 0, // ID OF CLIENTS TEAM
                };
                this.settings = _.extend(defaults,settings);

                this.Grid = new GridManager(this.settings);
                this.Grid.initiateGrid();

            },

            setData : function (data) {
                if (this.dataTimestamp !== data.tstamp) {
                    this.Grid.updatePlots = [];
                    this.dataTimestamp = data.tstamp;
                    this.Grid.plot = data.plots;
                    for(var x in this.Grid.plot) {
                        for(var y in this.Grid.plot[x]) {
                            this.Grid.updatePlots.push([parseInt(x),parseInt(y)]);
                        }
                    }
                }
            },

            /**
              * ready
              * Called by main - starts runtime
              **/
            ready : function () {
                return true;
            }

        };

        return function( settings ) {
            _.extend(this,this);
            GameContext.initialize(settings);
            return GameContext;
        }
    }
);