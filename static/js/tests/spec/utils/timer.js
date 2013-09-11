define(
    ['utils/timer'],
    function(Timer){
        describe(
            "The Timer utility", 
            function(){
                var scope;

                var setup = function(){
                    it('should start timer', function(){
                        scope = {};
                        Timer.start();
                    });
                };

                var teardown = function(){
                    it('should stop timer', function(){
                        Timer.stop();
                    });
                };

                describe(
                    "when firing one-off timeout events",
                    function(){

                        setup();

                        it('should add a new event: set triggered to true after 100ms', function(){
                            runs(function(){
                                scope.eventTriggered = false;

                                scope.timerEvent = Timer.add(function(elapsed){
                                    scope.eventTriggered = true;
                                }, 100);
                            });
                        });

                        it('should not be triggered after 50ms', function(){
                            waits(50);
                            runs(function(){
                                expect(scope.eventTriggered).toBe(false);
                            });
                        });

                        it('should be triggered after 100ms', function(){
                            waits(50);
                            runs(function(){
                                expect(scope.eventTriggered).toBe(true);
                            });
                        });

                        teardown();
                    }
                );

                describe(
                    "when firing repeating events a specified number of times",
                    function(){

                        setup();

                        it('should add a new event: increment counter after 100ms, loop 3 times', function(){
                            runs(function(){
                                Timer.add(function(){
                                    scope.triggerCount++;
                                }, 100, 3);
                            });
                        });

                        it('should set counter to 0', function(){
                            scope.triggerCount = 0;
                            waits(10); // ensure comparing value AFTER firing
                        });

                        it('should increment counter to 1 after 100ms', function(){
                            waits(100);
                            runs(function(){
                                expect(scope.triggerCount).toEqual(1);
                            });
                        });

                        it('should increment counter to 2 after 200ms', function(){
                            waits(100);
                            runs(function(){
                                expect(scope.triggerCount).toEqual(2);
                            });
                        });

                        it('should increment counter to 3 after 300ms', function(){
                            waits(100);
                            runs(function(){
                                expect(scope.triggerCount).toEqual(3);
                            });
                        });

                        it('should not increment counter after 500ms', function(){
                            waits(200);
                            runs(function(){
                                expect(scope.triggerCount).toEqual(3);
                            });
                        });

                        teardown();
                    }
                );

                describe(
                    "when firing repeating events forever (sanity check, forever is untestable :)",
                    function(){

                        setup();

                        it('should add a new event: increment counter after 100ms, loop forever', function(){
                            runs(function(){
                                Timer.add(function(){
                                    scope.triggerCount++;
                                }, 100, 10);
                            });
                        });

                        it('should increment counter to 0', function(){
                            scope.triggerCount = 0;
                            waits(10); // ensure comparing value AFTER firing
                        });

                        it('should increment counter to 1 after 100ms', function(){
                            waits(100);
                            runs(function(){
                                expect(scope.triggerCount).toEqual(1);
                            });
                        });

                        it('should increment counter to 2 after 200ms', function(){
                            waits(100);
                            runs(function(){
                                expect(scope.triggerCount).toEqual(2);
                            });
                        });

                        it('should increment counter to 3 after 300ms', function(){
                            waits(100);
                            runs(function(){
                                expect(scope.triggerCount).toEqual(3);
                            });
                        });

                        it('should increment counter to 4 after 400ms', function(){
                            waits(100);
                            runs(function(){
                                expect(scope.triggerCount).toEqual(4);
                            });
                        });

                        it('should increment counter to 5 after 500ms', function(){
                            waits(100);
                            runs(function(){
                                expect(scope.triggerCount).toEqual(5);
                            });
                        });

                        teardown();
                    }
                );

                describe(
                    "when removing events",
                    function(){

                        setup();

                        it('should add a new event', function(){
                            runs(function(){
                                scope.eventTriggered = false;
                                scope.timerEvent = Timer.add(function(elapsed){
                                    scope.eventTriggered = true;
                                }, 50);
                            });
                        });

                        it('should remove event', function(){
                            runs(function(){
                                Timer.remove(scope.timerEvent);
                            });
                        });

                        it('should not have triggered event', function(){
                            waits(100);
                            runs(function(){
                                expect(scope.eventTriggered).toBe(false);
                            });
                        });

                        teardown();
                    }
                );

                describe(
                    "when removing timeout events",
                    function(){

                        setup();

                        it('should add a new event: set triggered to true after 100ms', function(){
                            runs(function(){
                                scope.eventTriggered = false;

                                scope.timerEvent = Timer.add(function(elapsed){
                                    scope.eventTriggered = true;
                                }, 100);
                            });
                        });

                        it('should remove event', function(){
                            runs(function(){
                                Timer.remove(scope.timerEvent);
                            });
                        });

                        it('should not have triggered after 100ms', function(){
                            waits(100);
                            runs(function(){
                                expect(scope.eventTriggered).toBe(false);
                                Timer.stop();
                            });
                        });

                        teardown();
                    }
                );

                describe(
                    "when removing repeating events",
                    function(){

                        setup();

                        var eventFunction = function(){ scope.triggerCount++; };

                        it('should add a new event: increment counter after 100ms, loop forever', function(){
                            runs(function(){
                                scope.timerEvent = Timer.add(eventFunction, 100, -1);
                            });
                        });

                        it('should increment counter to 0', function(){
                            scope.triggerCount = 0;
                            waits(10); // ensure comparing value AFTER firing
                        });

                        it('should increment counter to 1 after 100ms', function(){
                            waits(100);
                            runs(function(){
                                expect(scope.triggerCount).toEqual(1);
                            });
                        });

                        it('should increment counter to 2 after 200ms', function(){
                            waits(100);
                            runs(function(){
                                expect(scope.triggerCount).toEqual(2);
                            });
                        });

                        it('should increment counter to 3 after 300ms', function(){
                            waits(100);
                            runs(function(){
                                expect(scope.triggerCount).toEqual(3);
                            });
                        });

                        it('should remove event', function(){
                            runs(function(){
                                Timer.remove(scope.timerEvent);
                            });
                        });

                        it('should not increment counter after 500ms', function(){
                            waits(200);
                            runs(function(){
                                expect(scope.triggerCount).toEqual(3);
                            });
                        });

                        teardown();
                    }
                );
            }
        );
    }
);