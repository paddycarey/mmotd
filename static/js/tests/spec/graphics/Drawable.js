define(
    [],
    function(){
        return function(DrawableObject){
            describe(
                "behaving like Drawable", 
                function(){
                    var drawableObject = new DrawableObject();
                    it("should have a callable Render() function", function(){
                        expect(drawableObject.render).toBeDefined();
                        expect(drawableObject.render instanceof Function).toBeTruthy();
                    });
                    it("should return a drawable object when Render() is called", function(){
                        spyOn(drawableObject, 'render').andCallThrough();
                        var returnValue = drawableObject.render();
                        expect(drawableObject.render).toHaveBeenCalled();
                        var isImage = returnValue instanceof Image;
                        var isCanvas = returnValue instanceof HTMLElement && returnValue.nodeName.toLowerCase() === "canvas";
                        expect(isImage || isCanvas).toBeTruthy();
                    });
                }
            ); 
        }
    }
);