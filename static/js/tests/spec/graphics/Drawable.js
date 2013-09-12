define(
    [],
    function(){
        return function(){
            describe(
                "behaving like Drawable", 
                function(){
                    it("should have a callable Render() function", function(){
                        runs(function(){
                            expect(this.env.instance.render).toBeDefined();
                            expect(this.env.instance.render instanceof Function).toBeTruthy();
                        });
                    });
                    it("should return a drawable object when Render() is called", function(){
                        runs(function(){
                            console.log(this);
                            spyOn(this.env.instance, 'render').andCallThrough();
                            var returnValue = this.env.instance.render();
                            expect(this.env.instance.render).toHaveBeenCalled();
                            var isImage = returnValue instanceof Image;
                            var isCanvas = returnValue instanceof HTMLElement && returnValue.nodeName.toLowerCase() === "canvas";
                            expect(isImage || isCanvas).toBeTruthy();
                        });
                    });
                }
            ); 
        }
    }
);