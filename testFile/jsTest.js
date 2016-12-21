

var Duck = function(weight){
    this.weight = weight;
};

Duck.prototype = {
    swim: function(){
        console.log('swim!!');
    }
};



var RedDuck = function(){
    Duck.apply(this, arguments);
};

RedDuck.prototype = new Duck();
// RedDuck.prototype.constructor = RedDuck;
console.dir(RedDuck);

var MallardDuck = function(){
    Duck.apply(this, arguments);
};

MallardDuck.prototype = new Duck();
MallardDuck.prototype.constructor = MallardDuck;

MallardDuck.prototype.swim();
RedDuck.prototype.swim();





(function(exports){
    var moduleName = 'Slide';

    var MyModule = function(options){
        this.container = options.selector;
        if(this.container.length < 1) return;

        this.config = $.extend({
            'start': 0,
            'move': 1,
            'func': 'cubic-bezier(0.1, 0.54, 0.4, 1)',
            'speed': 500,
            'fluid': false
        }, options);

        this.detect = {
            style: {},
            isInTransition: false,
            transform: '',
            position: null,
            node: {con: null, item: null, scrollArea: null, btnPrev: null, btnNext: null},
            index: {min: 0, max: 0, current: 0},
            value: {scrollArea: 0, enableScroll: 0, x: 0},
            edge: {start: true, end: false}
        };

        this._init();
    };

    MyModule.prototype = {
        _helper: {
            hasProperty: function(style){
                var upper = style.charAt(0).toUpperCase() + style.substr(1);
                var props = [style, 'webkit' + upper, 'Moz' + upper, 'O' + upper, 'ms' + upper];
                for(var i = 0; i < 5; i++){
                    if(props[i] in $('body')[0].style){
                        return props[i];
                    }
                }
                return false;
            },

            addEvent: function(element, type, fn, scope){
                element.on(type, function(e){
                    fn.call(scope, e);
                });
            },
        },

        _init: function(){
            this.detect.transform = this.detect.style['transform'] = this._helper.hasProperty('transform');
            this.detect.style['transitionTimingFunction'] = this._helper.hasProperty('transitionTimingFunction');
            this.detect.style['transitionDuration'] = this._helper.hasProperty('transitionDuration');

            this.container.find('>ul').wrap('<div class="scroll-area"></div>');
            this.container.find('.scroll-area').before(
                '<div class="controller">' +
                '<a href="#" class="btn-prev" role="button">이전</a>' +
                '<a href="#" class="btn-next" role="button">다음</a>' +
                '</div>'
            );

            this.detect.node.scrollArea = this.container.find('.scroll-area');
            this.detect.node.con = this.detect.node.scrollArea.find('>ul');
            this.detect.node.btnPrev = this.detect.node.scrollArea.find('btn-prev');
            this.detect.node.btnNext = this.detect.node.scrollArea.find('btn-next');

            this.detect.node.scrollArea.css({
                'position': 'relative',
                'overflow': 'hidden',
                'height': this.detect.node.con.height()
            });

            this.reset();

            this._helper.addEvent(this.container.find('.btn-prev'), 'click', this.prev, this);
            this._helper.addEvent(this.container.find('.btn-next'), 'click', this.next, this);
            this._helper.addEvent(this.detect.node.con, 'transitionend', this._slideEnd, this);
            this._helper.addEvent(this.detect.node.con, 'refresh', this.reset, this);

            if(this.config.start > 0){
                this.slideTo(this.config.start, 0);
            }

            this._checkEdge();
            this._setButton();
        },

        _slideEnd: function(){
            this._checkEdge();
            this._setButton();

            if(this.config.callback && typeof this.config.callback == "function"){
                this.config.callback();
            }
        },

        _checkEdge: function(){
            this.detect.edge.start = this.detect.value.x == 0;
            this.detect.edge.end = this.detect.value.x == this.detect.value.enableScroll;
        },

        _setButton: function(){
            if(this.detect.edge.end){
                this.container.find('.btn-next').addClass('disabled');
            } else {
                this.container.find('.btn-next').removeClass('disabled');
            }

            if(this.detect.edge.start){
                this.container.find('.btn-prev').addClass('disabled');

            } else {
                this.container.find('.btn-prev').removeClass('disabled');
            }
        },

        _moveValue: function(index){
            var left, idx;

            if(this.detect.position.current == this.detect.value.enableScroll){
                return false;
            }

            if(this.detect.position[index].left > this.detect.value.enableScroll){
                left = this.detect.value.x = this.detect.value.enableScroll;
                idx = this.getIndex();
            } else {
                left = this.detect.value.x = this.detect.position[index].left;
                idx = this.getIndex();
            }

            return {
                left: left,
                index: idx
            }
        },

        reset: function(){
            this.detect.position = [];
            this.detect.node.item = this.detect.node.con.find('>li');
            this.detect.index.max = this.detect.node.item.length - 1;

            for(var i = 0; i <= this.detect.node.item.length - 1; i++){
                this.detect.position.push({
                    left: this.detect.node.item.eq(i).position().left,
                    right: this.detect.node.item.eq(i).position().left + this.detect.node.item.eq(i).outerWidth()
                });
            }

            this.detect.value.scrollArea = this.detect.node.scrollArea.width();
            this.detect.value.enableScroll = this.detect.position[this.detect.position.length - 1].right - this.detect.value.scrollArea
        },

        next: function(e){
            e.preventDefault();
            this.slideTo(this.detect.index.current + this.config.move > this.detect.index.max ? this.detect.index.max : this.detect.index.current + this.config.move);
        },

        prev: function(e){
            e.preventDefault();
            this.slideTo(this.detect.index.current - this.config.move <= this.detect.index.min ? this.detect.index.min : this.detect.index.current - this.config.move);
        },

        slideTo: function(to, speed){
            if(this.detect.isInTransition || this.detect.node.scrollArea.is(':animated')){
                return;
            }

            var moveValue = this._moveValue(to);

            if(!!!moveValue){
                return;
            }

            if(this.detect.transform){
                this.detect.isInTransition = true;
                this.detect.node.con.css(this.detect.style.transitionDuration, speed === 0 ? 0 : this.config.speed + "ms");
                this.detect.node.con.css(this.detect.style.transitionTimingFunction, this.config.func);
                this.detect.node.con.css(this.detect.style.transform, 'translate3d(' + -moveValue.left + 'px, 0, 0)');
                this.detect.isInTransition = false;
            } else {
                var scope = this;
                this.detect.node.con.animate({'left': -moveValue.left + 'px'}, speed === 0 ? 0 : this.config.speed, function(){
                    scope.detect.node.con.trigger('transitionend');
                });
            }

            this.detect.index.current = moveValue.index;
        },

        getIndex: function(){
            var index, i;

            for(i = 0; i <= this.detect.index.max; i++){
                if(this.detect.value.x == this.detect.position[i].left){
                    index = i;
                    break;
                }
            }

            if(index !== undefined){
                return index;
            }

            for(i = 0; i <= this.detect.index.max; i++){
                if(this.detect.value.x < this.detect.position[i].left){
                    index = i;
                    break;
                }
            }

            return index;
        }
    };

    MyModule.constructor = MyModule;

    if(exports === window){
        exports.ui = exports.ui || {};
        exports.ui[moduleName] = MyModule;
    } else {
        module.exports = MyModule;
    }

}(typeof exports === "undefined" ? window : exports));