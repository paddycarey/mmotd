define(
    [
        'underscore',
        'graphics/Drawable'
    ],
    function(_, Drawable){
        console.log(_);
        var Spritemap = function(source, tileWidth, tileHeight){
            var me = this;
            Drawable.call(me);
            me.rawImage = new Image();
            me.rawImage.onLoad = _.bind(me.generateMapping, me);
            me.rawImage.src = source;
        };

        Spritemap.prototype = Object.create(Drawable.prototype);

        return Spritemap;
    }
);