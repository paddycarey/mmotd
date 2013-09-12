define(
    [
        'graphics/Spritemap',
        'tests/spec/graphics/Drawable'
    ],
    function(Spritemap, DrawableTests){
        describe('The Spritesheet class', function(){
            DrawableTests(Spritemap);

            var scope = {};

            it('should be instantiable with an image and tile dimensions', function(){
                scope.instance = new Spritemap('test_assets/imgs/spritesheet', 60, 60);
                expect(scope.instance).toBeDefined();
            });
        })
    }
);