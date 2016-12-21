var CustomTw = null;
var GetBrowser = null;
var GlobalData = null;
var EventDispatcher = null;
var Events = null;

require(["contents/Plugin",
    "contents/GlobalData",
    "contents/EventDispatch",
    "contents/EventDispatchString",
    "contents/motion/PageChange",
    "contents/motion/Circle",
    "contents/motion/Sequence",
    "contents/DotMenu",
    "contents/Swipe"
], function(_plugin, _globalData, _eventDispatch, _eventDispatchString, _pageChange, _circleMotion, _sequenceMotion, _dotMenu, _swipe){
    CustomTw = _plugin.CustomTw;
    GetBrowser = _plugin.GetBrowser();
    GlobalData = _globalData;
    EventDispatcher = _eventDispatch;
    Events = _eventDispatchString;

    var ScrollWheel = _plugin.ScrollWheel,
        PageChange = _pageChange,
        CircleMotion = _circleMotion,
        SequenceMotion = _sequenceMotion;

    var prevCount = 1;
    var nextCount = 1;
    var sectionLen = 5;

    var enterMotionTimeline;
    var enterCountObj = {count:0};

    var isOneScrollTracking = false;

    function init(){
        initAddEvent();
        initPosition();
        initContents();
        initSetBtns();
        TweenMax.delayedCall(1, contentsStart);
    }

    function initPosition(){
        CircleMotion.initPosition();
        PageChange["section1"].initPosition();
    }

    function initContents(){
        _dotMenu.init();
        SequenceMotion.init();

        if(is_tablet) {
            _swipe.init();
            $("body").css("position", "fixed");
        }
    }

    function initAddEvent(){
        ScrollWheel.bind($(window), onWheelEvent);
        EventDispatcher.addEvent(this, Events.MAIN_GO_PAGE_MOVE, onDirectPageChangeMotion);
        if(is_tablet) EventDispatcher.addEvent(this, Events.MAIN_TOUCH_SWIPE, onTouchPageMove);
        resize();
        $(window).resize(resize);
    }

    function initSetBtns(){
        var outlinkBtns = $(".outLink>a");
        var enterBtns = $(".outLink>a");
        var subMenuBtns = $(".subMenu>a");

        outlinkBtns.click(function(){
            var link = $(this).attr("href");
            parent.location.href = link;
            return false;
        })

        subMenuBtns.click(function(){
            var idx = $(this).parent().index()+1;
            EventDispatcher.dispatchEvent(Events.MAIN_GO_PAGE_MOVE, idx);
            EventDispatcher.dispatchEvent(Events.MAIN_ACTIVE_MENU, idx);

            var trackingStrArr = ["Explosive", "Defense", "Trade", "Machinery"];
            Tracker.tracking("btn", "Main", "Move", trackingStrArr[idx-1]);
        })

        enterBtns.mouseover(function(){
            TweenMax.to(enterCountObj, 1, {count:100, onUpdate:enterBtnMotion});
        }).mouseout(function(){
            TweenMax.to(enterCountObj, 1, {count:0, onUpdate:enterBtnMotion});
        })

        enterBtnMotionSet();
    }

    function enterBtnMotionSet(){
        enterMotionTimeline = new TimelineMax();
        enterMotionTimeline.add(new TweenMax($(".outLink>a>.dLine"), 0.2, {width:170, ease:Cubic.easeInOut}), 0);
        enterMotionTimeline.add(new TweenMax($(".outLink>a>.txt_box"), 0.3, {x:16, ease:Cubic.easeInOut}), 0.1);
        enterMotionTimeline.add(new TweenMax($(".outLink>a>.dLine"), 0.3, {x:170, width:0, ease:Cubic.easeInOut}), 0.2);
        enterMotionTimeline.add(new TweenMax($(".outLink>a>.aLine"), 0.3, {width:50, ease:Cubic.easeInOut}), 0.3);
        enterMotionTimeline.add(new TweenMax($(".outLink>a>.arrow"), 0, {delay:0.1, alpha:1, ease:Cubic.easeInOut}), 0.3);
        enterMotionTimeline.add(new TweenMax($(".outLink>a>.arrow"), 0.3, {x:50, ease:Cubic.easeInOut}), 0.3);
        enterMotionTimeline.pause();
    }

    function enterBtnMotion(){
        enterMotionTimeline.progress(Math.floor(enterCountObj.count)/100);
    }

    function resize(){
        var headerH = 75;
        var footerH = 43;
        var wh = $(parent.window).height();
        var dh = 0;
        var minH = 650+headerH+footerH;

        if(wh < minH) $(".main_contents").addClass("small");
        else $(".main_contents").removeClass("small");

        if(wh < minH) wh = minH;
        dh = wh-headerH-footerH;

        $("#main").height(dh);
        $(".bg_group li").height(dh);

        var len = sectionLen - prevCount;
        for(var i = 0; i < len; ++i){
            var idx = prevCount+i;
            CustomTw.to($(".section"+(idx+1)), 0, {y:GlobalData.contentsH});
        }

        GlobalData.contentsH = dh;

        if(parent.window != window){
            $("#wrap", parent.document).height(wh);
            $("#iframecontents", parent.document).height(wh);
        }
    }

    function onWheelEvent(event){
        var delta = 0;

        if (!event) event = window.event;
        if (event.wheelDelta) {
            delta = event.wheelDelta/120;
            if (window.opera) delta = -delta;
        }else if (event.detail) delta = -event.detail/3;

        var isUp = (delta > 0);

        pageChangeMotion(isUp);
        return ScrollWheel.cancel(event);
    }

    function contentsStart(){
        inMotion();
    }

    function inMotion(){
        PageChange["section1"].inMotion(false);
        TweenMax.delayedCall(0.5, CircleMotion.inMotion);
        TweenMax.delayedCall(2, function(){
            GlobalData.isMotionPlaying = false;
            CircleMotion.loopStart();
        });
        CustomTw.to($(".bg_group>li:eq(0)"), 0, {scale:1});
        CustomTw.to($(".bg_group>li:eq(0)"), 1, {scale:1.1, alpha:1});

        CustomTw.to($("#intro_dimmed"), 1, {alpha:0});
        TweenMax.delayedCall(1, function(){ $("#intro_dimmed").hide(); })
    }

    function pageChangeMotion(isUp){
        if(GlobalData.isMotionPlaying) return;
        GlobalData.isMotionPlaying = true;

        if(isUp) {
            if(nextCount == 1) {
                GlobalData.isMotionPlaying = false;
                return;
            }else nextCount--;
        }else {
            if(nextCount == sectionLen) {
                GlobalData.isMotionPlaying = false;
                return;
            }else nextCount++;
        }

        PageChange["section"+prevCount].outMotion(isUp);
        PageChange["section"+nextCount].inMotion(isUp);

        if(nextCount == 1 || nextCount == 5) TweenMax.to($("#next_scroll_info"), 1, {alpha:0});
        else TweenMax.to($("#next_scroll_info"), 1, {delay:((prevCount == 1)?1:0),alpha:1});

        var seqPlayDelay = (is_tablet)?2.5:1;
        TweenMax.killDelayedCallsTo(seqDelayChange);
        TweenMax.delayedCall(seqPlayDelay, seqDelayChange, [prevCount, nextCount]);

        var plus = (prevCount == 1)?1:0;
        if(nextCount == 1) $(".section1 .text_box").show();
        TweenMax.delayedCall(1.5+plus, function(){
            GlobalData.isMotionPlaying = false;
            if(nextCount != 1){
                $(".text_box").hide();
                $(".section"+nextCount+" .text_box").show();
            }else{
                $(".section2 .text_box").hide();
            }
        });
        EventDispatcher.dispatchEvent(Events.MAIN_ACTIVE_MENU, nextCount-1);
        prevCount = nextCount;
        GlobalData.currentPage = prevCount;

        if(!isOneScrollTracking){
            isOneScrollTracking = true;
            Tracker.tracking("btn", "Main", "Scroll");
        }
    }

    function seqDelayChange(pPrevCount, pNextCount){
        SequenceMotion.stop(pPrevCount);
        SequenceMotion.play(pNextCount);
    }

    function onDirectPageChangeMotion(idx){
        if(GlobalData.isMotionPlaying) return;
        GlobalData.isMotionPlaying = true;

        idx = idx+1;
        var isUp = false;
        if(prevCount == idx) return;
        if(prevCount > idx) isUp = true;

        var gap = (isUp)?nextCount-idx:idx-nextCount;
        var setPrevCount = prevCount;

        var obj = {data:0};
        for(var i = 0; i < gap; ++i){
            var plus = 0;
            if(!isUp && setPrevCount == 1 && i != 0) plus = 1;

            TweenMax.to(obj, 0, {data:0, delay:i*0, onComplete:function(idx, isUp, gap){
                if(isUp){
                    if(idx == gap-1) PageChange["section"+(nextCount-1)].inMotion(isUp);
                    PageChange.directMoveUp(nextCount);
                    nextCount--;
                }else{
                    nextCount++;

                    if(gap == 1){
                        PageChange["section"+prevCount].outMotion(isUp);
                        PageChange["section"+nextCount].inMotion(isUp);
                    }else{
                        if(prevCount == 1) PageChange.page1AllStop();
                        if(idx == gap-1) PageChange["section"+nextCount].inMotion(isUp);
                        else PageChange.directMoveDown(nextCount);
                    }
                }

                if(nextCount == 1 || nextCount == 5) TweenMax.to($("#next_scroll_info"), 1, {alpha:0});
                else TweenMax.to($("#next_scroll_info"), 1, {delay:((prevCount == 1)?1:0),alpha:1});

                if(idx == gap-1) {
                    var delay = (gap == 1)?1:1.5;
                    if(nextCount == 1) $(".section1 .text_box").show();
                    TweenMax.delayedCall(delay, function(){
                        GlobalData.isMotionPlaying = false;
                        if(nextCount != 1){
                            $(".text_box").hide();
                            $(".section"+nextCount+" .text_box").show();
                        }else{
                            $(".section2 .text_box").hide();
                        }
                    });
                }

                SequenceMotion.stop(prevCount);
                TweenMax.killDelayedCallsTo(seqDelayChange);
                TweenMax.delayedCall(1, seqDelayChange, [prevCount, nextCount]);

                prevCount = nextCount;
                GlobalData.currentPage = prevCount;
            }, onCompleteParams:[i, isUp, gap]})
        }
    }

    /*
     * ipad
     * */
    function onTouchPageMove(isUp){
        pageChangeMotion(isUp);
        //EventDispatcher.dispatchEvent(Events.MAIN_GO_PAGE_MOVE, 1);
    }

    init();
})


