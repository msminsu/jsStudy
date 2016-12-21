define(function(){
    var $self = {
        /*
         * 익스 9이하 버젼에서 트위너 사용시 jquery.transit 과 TweenMax 자동 분기 처리
         * jquery.transit 을 사용할 경우에만 사용한다
         * */
        CustomTw:{
            to:function(el, duration, paraObj){
                var ease = "";
                var underIE = ($self.GetBrowser() < 10 && $self.GetBrowser() != -1);
                switch(paraObj.ease){
                    case Expo.easeOut : ease = "easeOutExpo"; break;
                    case Cubic.easeIn : ease = "easeInCubic"; break;
                    case Cubic.easeOut : ease = "easeOutCubic"; break;
                    case Cubic.easeInOut : ease = "easeInOutCubic"; break;
                }

                if(underIE){
                    TweenMax.to($(el), duration, paraObj);
                }else{
                    if(typeof paraObj.alpha == "number"){
                        var opacity = paraObj.alpha;
                        delete paraObj.alpha;
                        paraObj.opacity = opacity;
                    }
                    if(paraObj.ease){ delete paraObj.ease; }
                    if(paraObj.delay) { paraObj.delay = parseInt(paraObj.delay * 1000); }

                    $(el).transition(paraObj, duration*1000, ease);
                }
            }
        },
        /*
         * mouse wheel event (ie8 처리)
         * */
        ScrollWheel:{
            bind:function(element, callback){
                if(window.addEventListener) window.addEventListener('DOMMouseScroll', callback, false);
                window.onmousewheel = document.onmousewheel = callback;
            },
            unbind:function(element, eventName, callback){

            },
            /*
             * 마우스 휠 이벤트 발생시 시스템 스크롤바의 제어를 막는다
             * */
            cancel:function(e){
                e = e ? e : window.event;
                if(e.stopPropagation) e.stopPropagation();
                if(e.preventDefault) e.preventDefault();
                e.cancelBubble = true;
                e.cancel = true;
                e.returnValue = false;
                return false;
            }
        },
        /*
         * ie브라우저 버젼 체크
         * */
        GetBrowser:function(){
            var rv = -1; // Return value assumes failure.
            if (navigator.appName == 'Microsoft Internet Explorer') {
                var ua = navigator.userAgent;
                var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                if (re.exec(ua) != null)
                    rv = parseFloat(RegExp.$1);
            }
            return rv;
        }
    };

    return $self;
});
