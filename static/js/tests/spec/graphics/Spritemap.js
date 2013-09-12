define(
    [
        'graphics/Spritemap',
        'tests/spec/graphics/Drawable'
    ],
    function(Spritemap, shouldBehaveLikeDrawable){
        describe('The Spritesheet class', function(){

            beforeEach(function(){
                runs(function(){
                    this.env.instance = new Spritemap('test_assets/imgs/spritesheet.png', 60, 60);
                });
            });

            afterEach(function(){
                delete this.env.instance;
            });

            it('should be instantiable', function(){
                runs(function(){
                    expect(this.env.instance).toBeDefined();
                });
            });

            shouldBehaveLikeDrawable();
        })
    }
);