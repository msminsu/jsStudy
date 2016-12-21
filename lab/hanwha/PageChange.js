define(function(){
    var SUB_MENU_LEN = 4;

    var $self = {
        /*
         * SECTION 1 IN OUT MOTION
         * */
        section1:{
            initPosition:function(){
                CustomTw.to($(".subMenu_area li"), 0, {y:99, alpha:0});
            },
            inMotion:function(isUp){
                if(!isUp){
                    var s1TextBoxLi = $(".section1 .text_box li");
                    var s1TextBoxLiLen = s1TextBoxLi.size();
                    for(var z = 0; z < s1TextBoxLiLen; ++z){
                        var liObj = s1TextBoxLi.eq(z);

                        var gap = 0.2;
                        if(z == 3 || z == 4 || z == 5) CustomTw.to(liObj, 0, {y:50, alpha:0});
                        else CustomTw.to(liObj, 0, {y:0, alpha:0});
                        if(z == 5) gap = 0.5;

                        CustomTw.to(liObj, 1.3, {delay:z*0.1+gap, y:0, alpha:1})
                    }

                    /*
                     * 메인 텍스트 순차적으로 나오는 모션
                     * */
                    /*var spanLen = 6;
                     var spanSeqArr = [0, 3, 5, 2, 4, 1];
                     for(var n = 0; n < spanLen; ++n){
                     var twObj = $(".title_motion>h1>span").eq(spanSeqArr[n]);
                     CustomTw.to(twObj, 0, {alpha:0});
                     CustomTw.to(twObj, 1.5, {delay:n*0.1+0.5, alpha:1});
                     }*/

                    for(var i = 0; i < SUB_MENU_LEN; ++i){
                        CustomTw.to($(".subMenu_area li").eq(i), 0.7, {delay:i*0.1+0.5, y:0, alpha:1, ease:Cubic.easeOut});
                    }

                    TweenMax.delayedCall(1.3, function(){
                        TweenMax.to($("#dot_menu"), 1, {autoAlpha:1});
                    })
                }else{
                    $(".subMenu_area li").show();
                    for(var i = 0; i < SUB_MENU_LEN; ++i){
                        var twObj = $(".subMenu_area li").eq(i);
                        TweenMax.killTweensOf(twObj);
                        TweenMax.to(twObj, 0.5, {delay:i*0.1+1, y:0, alpha:1, ease:Cubic.easeOut});
                    }

                    CustomTw.to($(".text_area"), 1, {delay:0.7, y:0, alpha:1, ease:Cubic.easeOut})
                    CustomTw.to($("#section1"), 1.5, { y:0, ease:Cubic.easeInOut})
                    CustomTw.to($(".circle"), 1.5, {y:0, ease:Cubic.easeInOut})
                    CustomTw.to($(".scroll_info"), 0, {alpha:0});
                    CustomTw.to($(".scroll_info"), 1, {delay:1.5, alpha:1});

                    EventDispatcher.dispatchEvent(Events.MAIN_CIRCLE_LOOP_START);
                }
            },
            outMotion:function(isUp){
                for(var i = 0; i < SUB_MENU_LEN; ++i){
                    var twObj = $(".subMenu_area li").eq(i);
                    TweenMax.killTweensOf(twObj);
                    TweenMax.to(twObj, 0.5, {delay:i*0.1, y:100, alpha:0, ease:Cubic.easeIn});
                }

                CustomTw.to($(".text_area"), 1, {delay:0.6, y:-100, alpha:0, ease:Cubic.easeIn})
                CustomTw.to($("#section1"), 1, {delay:1.2, y:-300, ease:Cubic.easeInOut})
                CustomTw.to($(".circle"), 1, {delay:1.2, y:300, ease:Cubic.easeInOut})

                TweenMax.delayedCall(1.2, function(){ EventDispatcher.dispatchEvent(Events.MAIN_CIRCLE_LOOP_STOP); })
                TweenMax.delayedCall(1, function(){ $(".subMenu_area li").hide(); });
            }
        },
        /*
         * SECTION 2 IN OUT MOTION
         * */
        section2:{
            inMotion:function(isUp){
                if(isUp) $self.upOverlapInMotion($("#section2"), $(".section2 .seq_circle"), $(".section2 .text_box"));
                else TweenMax.delayedCall(0.8, $self.downOverlapInMotion, [$("#section2"), $(".section2 .seq_circle"), $(".section2 .text_box")]);
            },
            outMotion:function(isUp){
                if(isUp) $self.upOverlapOutMotion($("#section2"), $(".section2 .seq_circle"), $(".section2 .text_box"));
                else $self.downOverlapOutMotion($("#section2"), $(".section2 .seq_circle"), $(".section2 .text_box"));
            }
        },
        /*
         * SECTION 3 IN OUT MOTION
         * */
        section3:{
            inMotion:function(isUp){
                if(isUp) $self.upOverlapInMotion($("#section3"), $(".section3 .seq_circle"), $(".section3 .text_box"));
                else $self.downOverlapInMotion($("#section3"), $(".section3 .seq_circle"), $(".section3 .text_box"));
            },
            outMotion:function(isUp){
                if(isUp) $self.upOverlapOutMotion($("#section3"), $(".section3 .seq_circle"), $(".section3 .text_box"));
                else $self.downOverlapOutMotion($("#section3"), $(".section3 .seq_circle"), $(".section3 .text_box"));
            }
        },
        /*
         * SECTION 4 IN OUT MOTION
         * */
        section4:{
            inMotion:function(isUp){
                if(isUp) $self.upOverlapInMotion($("#section4"), $(".section4 .seq_circle"), $(".section4 .text_box"));
                else $self.downOverlapInMotion($("#section4"), $(".section4 .seq_circle"), $(".section4 .text_box"));
            },
            outMotion:function(isUp){
                if(isUp) $self.upOverlapOutMotion($("#section4"), $(".section4 .seq_circle"), $(".section4 .text_box"));
                else $self.downOverlapOutMotion($("#section4"), $(".section4 .seq_circle"), $(".section4 .text_box"));
            }
        },
        /*
         * SECTION 5 IN OUT MOTION
         * */
        section5:{
            inMotion:function(isUp){
                if(isUp) $self.upOverlapInMotion($("#section5"), $(".section5 .seq_circle"), $(".section5 .text_box"));
                else $self.downOverlapInMotion($("#section5"), $(".section5 .seq_circle"), $(".section5 .text_box"));
            },
            outMotion:function(isUp){
                if(isUp) $self.upOverlapOutMotion($("#section5"), $(".section5 .seq_circle"), $(".section5 .text_box"));
                else $self.downOverlapOutMotion($("#section5"), $(".section5 .seq_circle"), $(".section5 .text_box"));
            }
        },
        /*
         * OVERLAP IN OUT MOTION
         * */
        upOverlapInMotion:function(el, circle, textbox){
            var sectionObj = $(el);
            var circleObj = $(circle);
            var textBoxObj = $(textbox);
            var textBoxLiObj = textBoxObj.find("li");
            var th = GlobalData.contentsH;
            var duration = (GetBrowser > 0)?1.45:1.5;

            CustomTw.to(sectionObj, 0, {y:-th});
            CustomTw.to(sectionObj, duration, {y:0, ease:Cubic.easeInOut})
            CustomTw.to(textBoxObj, 0, {y:0, alpha:1})
            CustomTw.to(circleObj, 0, {y:th});
            CustomTw.to(circleObj, duration, {y:0, ease:Cubic.easeInOut})

            var textBoxLiLen = textBoxLiObj.size();
            for(var z = 0; z < textBoxLiLen; ++z){
                var liObj = textBoxLiObj.eq(z);

                TweenMax.to(liObj, 0, {y:80, alpha:0});
                TweenMax.to(liObj, 0.8, {delay:z*0.1+1.5, y:0, alpha:1})
            }
        },
        upOverlapOutMotion:function(el, circle, textbox){
            var th = GlobalData.contentsH;
            CustomTw.to($(textbox), 1.3, {delay:0.6, y:th, alpha:0, ease:Cubic.easeInOut})
            CustomTw.to($(el), 1.5, {y:th, ease:Cubic.easeInOut})
            CustomTw.to($(circle), 1.5, {y:-th, ease:Cubic.easeInOut})
        },
        downOverlapInMotion:function(el, circle, textbox){
            var sectionObj = $(el);
            var circleObj = $(circle);
            var textBoxObj = $(textbox);
            var textBoxLiObj = textBoxObj.find("li");
            var th = GlobalData.contentsH;
            var duration = (GetBrowser > 0)?1.45:1.5;

            sectionObj.show();
            CustomTw.to(sectionObj, 0, {y:th});
            CustomTw.to(sectionObj, duration, {y:0, ease:Cubic.easeInOut});
            CustomTw.to(circleObj, 0, {y:-th});
            CustomTw.to(circleObj, duration, {y:0, ease:Cubic.easeInOut});
            CustomTw.to(textBoxObj, 0, { y:0, alpha:1, ease:Cubic.easeIn})

            var textBoxLiLen = textBoxLiObj.size();
            for(var z = 0; z < textBoxLiLen; ++z){
                var liObj = textBoxLiObj.eq(z);

                TweenMax.to(liObj, 0, {y:80, alpha:0});
                TweenMax.to(liObj, 0.8, {delay:z*0.1+1.5, y:0, alpha:1})
            }
        },
        downOverlapOutMotion:function(el, circle, textbox){
            var th = GlobalData.contentsH;
            CustomTw.to($(textbox), 1.3, {y:-100, alpha:0, ease:Cubic.easeInOut})
            CustomTw.to($(el), 1.5, {y:-th, ease:Cubic.easeInOut})
            CustomTw.to($(circle), 1.5, {y:th, ease:Cubic.easeInOut})
        },


        /*
         * 1개 이상 건너 뛰었을때 동작하는 함수
         * */
        directMoveUp:function(idx){
            var sectionObj = $("#section"+idx);
            var circleObj = $(".section"+idx+" .seq_circle");
            var textBoxObj = $(".section"+idx+" .text_box");
            var th = GlobalData.contentsH;

            CustomTw.to($(textBoxObj), 1.5, {y:-th, alpha:0, ease:Cubic.easeInOut})
            CustomTw.to($(sectionObj), 1.5, {y:th, ease:Cubic.easeInOut})
            CustomTw.to($(circleObj), 1.5, {y:-th, ease:Cubic.easeInOut})
        },
        directMoveDown:function(idx){
            var sectionObj = $("#section"+idx);
            var circleObj = $(".section"+idx+" .seq_circle");
            var textBoxObj = $(".section"+idx+" .text_box");
            var th = GlobalData.contentsH;

            sectionObj.show();
            CustomTw.to(sectionObj, 0, {y:th});
            CustomTw.to(sectionObj, 1.5, {y:0, ease:Cubic.easeInOut});
            CustomTw.to(circleObj, 0, {y:-th});
            CustomTw.to(circleObj, 1.5, {y:0, ease:Cubic.easeInOut});
            CustomTw.to(textBoxObj, 0, { y:0, alpha:0})
        },
        /*
         * 첫번째 메인페이지를 한번에 멈추게 해준다
         * */
        page1AllStop:function(){
            for(var i = 0; i < SUB_MENU_LEN; ++i){
                TweenMax.to($(".subMenu_area li").eq(i), 0, {y:100, alpha:0});
            }

            $(".subMenu_area li").hide();
            CustomTw.to($(".text_area"), 0, {delay:1.5, y:-100, alpha:0})
            CustomTw.to($("#section1"), 0, {delay:1.5, y:-300})
            CustomTw.to($(".circle"), 0, {delay:1.5, y:300})

            EventDispatcher.dispatchEvent(Events.MAIN_CIRCLE_LOOP_STOP);
        }
    };

    return $self;
});