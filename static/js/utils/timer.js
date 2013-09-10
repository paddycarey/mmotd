/**
  * timer.js
  *
  * Simple timed event management - skips the need for countless untrackable setIntervals and setTimeouts
  **/
define(
    'timer',
    [],
    function(){
        var Timer = function(){
            var me = this;
            me._events = [];
            me._dirty = false;
        };

        Timer.prototype.add = function(action, elapsed, repeat){
            var me = this;
            var timestamp = me._lastStamp ? me._lastStamp + elapsed : new Date().getTime() + elapsed;
            var evt = {
                action: action,
                elapsed: elapsed,
                timestamp: timestamp,
                repeat: repeat
            };
            me._events.push(evt);
            me._dirty = true;
            return evt;
        };

        Timer.prototype.remove = function(target){
            var me = this;
            for (var idx = 0; idx < me._events.length; idx++){
                if (target == me._events[idx] || target == me._events[idx].action){
                    me._events.splice(idx, 1)
                }
            }
        };


        Timer.prototype.start = function(){
            var me = this;
            me._startStamp = new Date().getTime();
            me._lastStamp = me._startStamp;
            me._controlInterval = setInterval(_.bind(me._update, me), 10);
        };

        Timer.prototype.pause = function(){
            var me = this;
            clearInterval(me._controlInterval);
        };

        Timer.prototype.stop = function(){
            var me = this;
            clearInterval(me._controlInterval);
            me._events = [];
        };




        Timer.prototype._sortEvents = function(){
            var me = this;
            me._events.sort(me._comparator);
        };

        Timer.prototype._comparator = function(a, b){
            if(a.timestamp < b.timestamp)
                return -1;
            if(a.timestamp > b.timestamp)
                return 1;
            return 0;
        };

        Timer.prototype._update = function(){
            var me = this;

            if(me._dirty) {
                me._sortEvents();
                me._dirty = false;
            }

            me._lastStamp = new Date().getTime();
            var evt = me._events.shift();
            while (evt){
                if(evt.timestamp < me._lastStamp){
                    evt.action();
                    if(evt.repeat > 0 || evt.repeat == -1){
                        if(evt.repeat > 0){
                            evt.repeat--;
                        }
                        evt.timestamp += evt.elapsed;
                        me._events.push(evt);
                        me._dirty = true;
                    }
                    evt = me._events.shift();
                } else {
                    me._events.unshift(evt);
                    break;
                }

            }
        }

        return new Timer();
    }
);