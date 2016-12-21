// http://www.hanwhacorp.co.kr/machinery/customer/notice.do

var navi = (function(){
    var naviIdx;
    var $navigation = $('#navigation');
    var $naviSub = $('#navigation_sub');
    var $naviSubUl = $('.navi_sub_ul');
    var $naviSubUl2 = $('.navi_sub_ul2');
    var $naviDl = $('.navi_dl');
    var $naviSubDl = $('.navi_sub_dl');
    var $naviLine = $('.navi_line');
    var $naviUl = $('.navi_ul');
    var $naviLayer = $('.navi_layer');
    var $naviIco = $('.navi_ico');
    var $selectLang = $('.select_lang');
    var $btnSideMenu = $('.btn_side_menu');
    var $smartInfoBox= $('.smart_info_box');
    var $btnSideNavi = $('.btn_side_navi');
    var $subCursor = $('.sub_cursor');
    var $businessCenter = $('.business_center');
    var $businessCenterBox = $('.business_center_box');


    var winWidth;
    var sideMenuFlag = false;
    var naviFlag = false;
    var btnSideFlag = false;
    var businessFlag = false;
    var businessTimer;
    var topCheck = false;
    var naviTimer;
    var naviSeqIdx = 0;

    var newsTimer;

    var setNaviIdx;
    var setNaviSubIdx;

    var $text = $('#navigation .navi_area .smart_info_side .smart_info .smart_info_news .text');

    var objCount={
        "01":17,"02":17,"03":17,"04":17,"05":17,"06":17,"07":15,"08":17,"09":17
    };

    return {
        init : function(){
            navi.resize();

            $(window).resize(function(){
                navi.resize();
            });

            $(window).load(function(){
                $(".smart_info_side").mCustomScrollbar({
                    theme:"light-thick",
                    scrollbarPosition:"inside",
                    autoHideScrollbar:true
                });
            });

            //navi.newsTextMot();

            /* 휠 스크롤 */
            $(window).scroll(function(){
                var sTop = $(window).scrollTop();
                if($naviSub.length >= 1){
                    if(sTop >= 0 && sTop < 200){
                        $navigation.css({'position':'fixed','top':0});
                        $('.logo_box').removeClass('top');
                        $('.logo_sub_box').removeClass('top');

                        if(sTop == 0){
                            $navigation.css({'position':'absolute','top':0});
                        }
                    }else if(sTop >= 200 && sTop < 270){
                        $navigation.css({'position':'absolute','top':200});
                    }else if(sTop >= 270){
                        if(!naviFlag){
                            $navigation.css({'position':'fixed','top':-75});
                        }else{
                            $navigation.css({'position':'fixed','top':0});
                        }
                    }else{
                        $navigation.css({'position':'absolute','top':0});
                    }

                    /* 서브 메뉴가 화면에 고정될때 */
                    if(sTop >= 270){

                        /* 우측 사이드 메뉴 클릭되었을때 */
                        if(!naviFlag){

                            topCheck = true;

                            $naviSub.css({'position':'fixed','top':0});
                            $('.logo_box').removeClass('top');
                            $('.logo_sub_box').removeClass('top');
                            TweenMax.to($btnSideNavi, 0.5, {right:0,ease:Power2.easeOut});
                            TweenMax.to($('.sub_navi_logo'), 0.5, {left:0,ease:Power2.easeOut});

                            $('.logo_box').addClass('hidden');
                            $('.navi_side_box').addClass('hidden');

                            if($('#main').length >= 1){
                                EventDispatcher.dispatchEvent(Events.MAIN_MOTION_START);
                            }

                            $('.ico_close').removeClass('rotate active');
                            TweenMax.to($('.smart_info_side'), 0.5, {width:0,ease:Power2.easeOut,onComplete:function(){
                                sideMenuFlag = false;
                            }});
                            TweenMax.to($('.smart_info'), 0.5, {left:520,delay:0.5,ease:Power2.easeOut});
                            closeBg();

                        }else{
                            $naviSub.css({'position':'fixed','top':74});
                        }
                    }else{
                        topCheck = false;

                        $naviSub.css({'position':'absolute','top':270});
                        TweenMax.to($btnSideNavi, 0.5, {right:-53,ease:Power2.easeOut});
                        TweenMax.to($('.sub_navi_logo'), 0.5, {left:-180,ease:Power2.easeOut});

                        if(naviFlag){
                            naviFlag = false;
                            $btnSideNavi.find('span').removeClass('active');
                            $naviSub.css({'position':'absolute','top':270});
                            $navigation.css({'position':'absolute','top':200});
                        }
                        $('.logo_box').removeClass('hidden');
                        $('.navi_side_box').removeClass('hidden');

                        if(businessFlag){
                            businessFlag = false;
                            $businessCenter.removeClass('active')
                            $businessCenterBox.slideUp();
                            $popsBg.hide();
                        }
                    }

                }else{
                    if(sTop >= 0){
                        $navigation.css({'position':'fixed','top':0});
                        $('.logo_box').removeClass('top');
                        $('.logo_sub_box').removeClass('top');
                    }else{
                        $navigation.css({'position':'absolute','top':0});
                    }
                }
            });

            /* navi 마우스 오버시 */
            $naviDl.mouseenter(function(){
                naviIdx = $(this).find('dt').find('a').attr('data-idx');
                navi.naviMainSet(naviIdx);
                $naviDl.find('dd').addClass('over');
            });

            $naviDl.focusin(function(){
                naviIdx = $(this).find('dt').find('a').attr('data-idx');
                navi.naviMainSet(naviIdx);
                $naviDl.find('dd').addClass('over');
            });

            //$naviDl.mouseleave(function(){
            //    naviIdx = $(this).find('dt').find('a').attr('data-idx');
            //
            //    if($(this).parent().parent().hasClass('sub')){
            //        navi.naviMainSubReset(naviIdx);
            //    }
            //});

            /* navi 마우스 아웃시 */
            $naviUl.mouseleave(function(){
                $naviDl.find('dd').removeClass('over');
                if($(this).find('li').find('dl').find('dt').find('a').hasClass('active')){
                    navi.naviMainReset();
                    $naviDl.find('dt').find('a').removeClass('active');
                    $naviDl.eq(setNaviIdx).find('dt').find('a').addClass('active');
                    //TweenMax.to($naviLine, 0.5, {left:setNaviIdx * 150,ease:Power2.easeOut});
                }else{
                    navi.naviMainReset();
                }
            });

            /* navi 포커스 들어 올때 */
            $naviDl.focusin(function(){
                if(is_tablet) return;
                var idx = $(this).find('dt').find('a').attr('data-idx');
                navi.naviMainSet(idx);
            });

            //$naviUl.focusout(function(){
            //    console.log('aaaa')
            //});

            $selectLang.find('a').focusin(function(){
                $naviDl.find('dt').find('a').removeClass('active');
                TweenMax.to($naviUl, 0.4, {height:74,ease:Power2.easeOut});
                TweenMax.to($naviLayer, 0.4, {height:0,ease:Power2.easeOut,onComplete:function(){
                    navi.naviIcoRemove();
                }});
            });

            $smartInfoBox.click(function(){
                $(this).removeClass("active");
                $(this).attr("title","CLOSE SMART INFO");
                if(!sideMenuFlag){
                    sideMenuFlag = true;
                    showBg();
                    navi.newsTextMot();
                    if($('#main').length >= 1){
                        EventDispatcher.dispatchEvent(Events.MAIN_MOTION_STOP);

                    }

                    TweenMax.to($('.smart_info_side'), 0.5, {width:500,delay:0.2,ease:Power2.easeOut});
                    TweenMax.to($('.smart_info'), 0.5, {left:0,ease:Power2.easeOut});

                    if(btnSideFlag){
                        $('.ico_close').addClass('rotate');
                    }else{
                        $('.btn_side_menu').addClass('active');
                        $('.ico_close').addClass('active');
                    }
                    $(this).addClass("active");

                    Tracker.tracking('btn', 'Main', 'See', 'Smartinfo');


                }else{
                    TweenMax.killTweensOf($text);
                    if($('#main').length >= 1){
                        EventDispatcher.dispatchEvent(Events.MAIN_MOTION_START);
                    }

                    if(!btnSideFlag){
                        $('.btn_side_menu').removeClass('active');
                    }

                    $('.ico_close').removeClass('rotate active');
                    //TweenMax.killAll();
                    TweenMax.to($('.smart_info_side'), 0.5, {width:0,ease:Power2.easeOut,onComplete:function(){
                        sideMenuFlag = false;
                    }});
                    TweenMax.to($('.smart_info'), 0.5, {left:500,delay:0.5,ease:Power2.easeOut});
                    closeBg();
                    clearInterval(newsTimer);
                    $(this).attr("title",is_en? "OPEN SMART INFO" :"SMART INFO 열기");

                }
            });

            $smartInfoBox.hover(
                function(){
                    $btnSideMenu.find('.ico_close').addClass('rotate');
                },
                function(){
                    $btnSideMenu.find('.ico_close').removeClass('rotate');
                }
            )
            /*if(is_tablet){
             $naviSubDl.find('dt >a').click( function(e){
             e.preventDefault();
             var idx = $(this).attr('data-idx');
             if($(this).parents('.navi_sub_dl').find('dd').length==0){
             window.location.href=$(this).attr("href");
             return;
             }

             if($(this).find('dt').find('a').hasClass('active')){
             navi.naviSubReset(idx,true);
             }else{
             navi.naviSubReset(idx);
             }
             navi.naviSubTabSet(idx);
             });
             }else{
             $naviSubDl.hover(
             function(){
             var idx = $(this).find('a').attr('data-idx');
             navi.naviSubSet(idx);
             },
             function(){
             var idx = $(this).find('a').attr('data-idx');

             if($(this).find('dt').find('a').hasClass('active')){
             navi.naviSubReset(idx,true);
             }else{
             navi.naviSubReset(idx);
             }
             }
             );

             $naviSubDl.find('dt').find('a').focusin(function(){
             var idx = $(this).attr('data-idx');
             navi.naviSubReset(idx);
             navi.naviSubSet(idx);
             });
             }*/

            $naviSubDl.hover(
                function(){
                    var idx = $(this).find('a').attr('data-idx');
                    navi.naviSubSet(idx);
                },
                function(){
                    var idx = $(this).find('a').attr('data-idx');

                    if($(this).find('dt').find('a').hasClass('active')){
                        navi.naviSubReset(idx,true);
                    }else{
                        navi.naviSubReset(idx);
                    }
                }
            );

            /*웹접근성*/
            $naviSubDl.on('focus', 'dt > a', function () {
                $(this).parent().parent().addClass('focused');
            });
            $naviSubDl.on('blur', 'dt > a', function () {
                $(this).parent().parent().removeClass('focused');
            });
            $naviSubDl.on('focus', '.navi_sub_ul2 a', function () {
                $(this).parents('dl').addClass('focused');
            });
            $naviSubDl.on('blur', '.navi_sub_ul2 a', function () {
                $(this).parents('dl').removeClass('focused');
            });
            /*
             $areaList.on('focus', '.text_bottom > a', function () {
             $(this).parent().parent().parent().addClass('focused');
             });
             $areaList.on('blur', '.text_bottom > a', function () {
             $(this).parent().parent().parent().removeClass('focused');
             });*/

            $naviSubDl.find('dt').find('a').focusin(function(){
                var idx = $(this).find('a').attr('data-idx');
                navi.naviSubSet(idx);
            });

            $naviSubDl.find('dt').find('a').focusout(function(){
                var idx = $(this).find('a').attr('data-idx');

                if($(this).find('dt').find('a').hasClass('active')){
                    navi.naviSubReset(idx,true);
                }else{
                    navi.naviSubReset(idx);
                }
            });


            $btnSideNavi.append('<p class="state">메인 메뉴 열기</p>');
            $btnSideNavi.click(function(){
                if(!naviFlag){
                    naviFlag = true;
                    $(this).find('span').addClass('active');
                    TweenMax.to($naviSub, 0.5, {top:74,ease:Power2.easeOut});
                    TweenMax.to($navigation, 0.5, {top:0,ease:Power2.easeOut});

                    $('.logo_box').addClass('top');
                    $('.logo_sub_box').addClass('top');

                    $btnSideNavi.find(".state").html("메인 메뉴 닫기");
                }else{
                    naviFlag = false;
                    $(this).find('span').removeClass('active');
                    TweenMax.to($naviSub, 0.5, {top:0,ease:Power2.easeOut});
                    TweenMax.to($navigation, 0.5, {top:-75,ease:Power2.easeOut});

                    $('.logo_box').removeClass('top');
                    $('.logo_sub_box').removeClass('top');

                    $btnSideNavi.find(".state").html("메인 메뉴 열기");
                }
            });

            $businessCenter.click(function(){
                if(!businessFlag){
                    $(this).addClass('active');
                    //$businessCenterBox.addClass('active');
                    $businessCenterBox.slideDown(function(){
                        businessFlag = true;
                    });
                    $popsBg.show();


                    var domain = location.href;
                    if(domain.indexOf("explosives") > -1) Tracker.tracking("btn", "Explosive", "See", "BusinessCenter");
                    if(domain.indexOf("defense") > -1) Tracker.tracking("btn", "Defense", "See", "BusinessCenter");
                    if(domain.indexOf("trade") > -1) Tracker.tracking("btn", "Trade", "See", "BusinessCenter");
                    if(domain.indexOf("machinery") > -1) Tracker.tracking("btn", "Machinery", "See", "BusinessCenter");
                }else{
                    $(this).removeClass('active');
                    //$businessCenterBox.removeClass('active');
                    businessFlag = false;
                    $businessCenterBox.slideUp();
                    $popsBg.hide();
                }


            });

            $businessCenter.hover(
                function(){
                    var businnesIcoIdx = 0;

                    businessTimer = setInterval(function(){
                        businnesIcoIdx += 1;

                        if(businnesIcoIdx < 10){
                            $businessCenter.find('.ico').find('img').attr('src',resourcePath+'/global_images/ico/navi/navi_0'+businnesIcoIdx+'.png');
                        }else{
                            $businessCenter.find('.ico').find('img').attr('src',resourcePath+'/global_images/ico/navi/navi_'+businnesIcoIdx+'.png');
                        }

                        if(businnesIcoIdx > 28){
                            clearInterval(businessTimer);
                        }
                    }, 1000 / 40);
                },
                function(){
                    $businessCenter.find('.ico').find('img').attr('src',resourcePath+'/global_images/ico/navi/navi_00.png');
                    clearInterval(businessTimer);
                }
            );

            //$naviSubDl.find('dt').find('a').click(function(){
            //    if(topCheck){
            //        navi.setCookie('subNavi',topCheck,24);
            //    }
            //});
            //
            ////
            //
            //var cookiedata = navi.getCookie("subNavi");
            //if(cookiedata){
            //    navi.setCookie("subNavi","",-1);
            //    $('html,body').animate({'scrollTop':300}, 700);
            //}

        },
        resize : function(){
            winWidth = $(window).width();

            if(winWidth < 1400){
                $('.smart_box').addClass('active');
                $btnSideMenu.removeClass('active');
                btnSideFlag = true;
            }else{
                btnSideFlag = false;
                $('.smart_box').removeClass('active');
            }

            $('.smart_info_side').height($(window).height() - 75);
        },
        naviIcoMot : function(num){
            naviSeqIdx=0;
            TweenMax.to($naviIco.eq(num).find('.num'), 0.4, {opacity:0,ease:Power2.easeOut});
            TweenMax.to($naviIco.eq(num).find('.ico'), 0.4, {top:22,ease:Power2.easeOut});

            var idx = $('.ico_box').eq(num).attr('data-seqIdx'), max=17;
            if(idx=="1" || idx=="7") max=15;

            naviTimer = setInterval(function(){
                if(naviSeqIdx >= max){
                    //naviSeqIdx = 1;
                    clearInterval(naviTimer);
                }else{
                    naviSeqIdx += 1;
                }

                if(naviSeqIdx > 9){
                    //$('.ico_box').eq(num).attr('src',resourcePath+'/global_images/ico/gnb_ani/0'+idx+'/icon_ani00'+naviSeqIdx+'.png');
                    $('.ico_box').eq(num).css('background','url("'+resourcePath+'/global_images/ico/gnb_ani/0'+idx+'/icon_ani00'+naviSeqIdx+'.png") no-repeat center center');
                }else{
                    //$('.ico_box').eq(num).attr('src',resourcePath+'/global_images/ico/gnb_ani/0'+idx+'/icon_ani000'+naviSeqIdx+'.png');
                    $('.ico_box').eq(num).css('background','url("'+resourcePath+'/global_images/ico/gnb_ani/0'+idx+'/icon_ani000'+naviSeqIdx+'.png") no-repeat center center');
                }

            },1000 / 30);
        },
        naviImgLoad : function(idx_ary){


            for(var i = 0; i < idx_ary.length; i++){

                var startImg;
                var seqType = idx_ary[i];

                for(var j = 1; j < objCount[seqType]+1; j++){

                    if(j > 9){
                        startImg = '<img src="'+resourcePath+'/global_images/ico/gnb_ani/'+idx_ary[i]+'/icon_ani00'+j+'.png" />';
                    }else{
                        startImg = '<img src="'+resourcePath+'/global_images/ico/gnb_ani/'+idx_ary[i]+'/icon_ani000'+j+'.png" />';
                    }

                    $(startImg).load(function () {
                    });
                }

            }

        },
        naviIcoRemove : function(){
            var len = $('.ico_box').length;
            for(var i=0;i<len;i++){
                var idx =  $('.ico_box').eq(i).attr("data-seqidx");
                $('.ico_box').eq(i).css('background','url("'+resourcePath+'/global_images/ico/gnb_ani/0'+(idx)+'/icon_ani0001.png") no-repeat center center');
            }

            clearInterval(naviTimer);

            TweenMax.to($naviIco.find('.num'), 0.4, {opacity:1,ease:Power2.easeOut});
            TweenMax.to($naviIco.find('.ico'), 0.4, {top:-27,ease:Power2.easeOut});
        },
        naviMainSet: function(num){
            var explosives_navi=260, machinery_navi=280, trade_navi=310, defense_navi=280;
            if(is_en){
                explosives_navi=275, machinery_navi=285, trade_navi=300, defense_navi=270;
            }

            if($naviUl.hasClass('explosives')){
                TweenMax.to($naviUl, 0.6, {height:332,ease:Power2.easeOut});
                TweenMax.to($naviLayer, 0.6, {height:explosives_navi,ease:Power2.easeOut});
            }else if($naviUl.hasClass('machinery')){
                TweenMax.to($naviUl, 0.6, {height:352,ease:Power2.easeOut});
                TweenMax.to($naviLayer, 0.6, {height:machinery_navi,ease:Power2.easeOut});
            }else if($naviUl.hasClass('trade')){
                TweenMax.to($naviUl, 0.6, {height:382,ease:Power2.easeOut});
                TweenMax.to($naviLayer, 0.6, {height:trade_navi,ease:Power2.easeOut});
            }else{
                TweenMax.to($naviUl, 0.6, {height:370,ease:Power2.easeOut});
                TweenMax.to($naviLayer, 0.6, {height:defense_navi,ease:Power2.easeOut});
            }

            //if(naviFlag){
            //    TweenMax.to($naviSub, 0.6, {top:352,ease:Power2.easeOut});
            //}

            $naviDl.find('dt').find('a').removeClass('active');
            $naviDl.eq(num).find('dt').find('a').addClass('active');
            navi.naviIcoRemove();
            navi.naviIcoMot(num);
            var linePosX = (is_tablet)?134:(is_en&&($('#navigation .navi_area .navi_ul > li').length==5))?165:150;
            TweenMax.to($naviLine, 0.5, {left:num * linePosX,ease:Power2.easeOut});
        },
        naviMainReset : function(){
            $naviDl.find('dt').find('a').removeClass('active');
            TweenMax.to($naviUl, 0.4, {height:74,ease:Power2.easeOut});
            TweenMax.to($naviLayer, 0.4, {height:0,ease:Power2.easeOut,onComplete:function(){
                navi.naviIcoRemove();
            }});

            //if(naviFlag){
            //    TweenMax.to($naviSub, 0.4, {top:74,ease:Power2.easeOut});
            //}
        },
        naviSubSet : function(num){
            var hei = $naviSubDl.eq(num).find('dd').height() + 49;
            TweenMax.to($naviSubDl.eq(num).find('dd'), 0.4, {top:0,ease:Power2.easeOut});
            TweenMax.to($naviSubDl.eq(num), 0.4, {height:hei,ease:Power2.easeOut});
            TweenMax.to($subCursor.eq(num), 0.4, {bottom:0,ease:Power2.easeOut});
        },
        naviSubTabSet : function(num){
            var hei = $naviSubDl.eq(num).find('dd').height() + 49;
            TweenMax.to($naviSubDl.eq(num).find('dd'), 0.4, {top:0,ease:Power2.easeOut});
            TweenMax.to($naviSubDl.eq(num), 0.4, {height:hei,ease:Power2.easeOut});
            TweenMax.to($subCursor.eq(num), 0.4, {bottom:-10,ease:Power2.easeOut});
        },
        naviSubReset : function(num,none){
            var hei = $naviSubDl.eq(num).find('dd').height();
            TweenMax.to($naviSubDl.eq(num).find('dd'), 0.4, {top:-hei,ease:Power2.easeOut});
            TweenMax.to($naviSubDl, 0.4, {height:49,ease:Power2.easeOut});

            if(none){
                TweenMax.to($subCursor.eq(num), 0, {bottom:0,ease:Power2.easeOut});
            }else{
                TweenMax.to($subCursor.eq(num), 0.4, {bottom:-10,ease:Power2.easeOut});
            }
        },
        setNavi : function(depth1,depth2,depth3){
            $naviDl.find('dt').eq(depth1).find('a').addClass('active');
            $naviSubUl.eq(depth1).find('li').eq(depth2).find('a').addClass('active');
            //$naviSubUl2.eq(depth2).find('li').eq(depth3).find('a').addClass('active');
            $naviSubDl.eq(depth2).find('ul').find('li').eq(depth3).find('a').addClass('active');
            $naviSubDl.find('dt').eq(depth2).find('a').addClass('active');
            TweenMax.to($subCursor.eq(depth2), 0.4, {bottom:0,ease:Power2.easeOut});

            setNaviIdx = depth1;
            setNaviSubIdx = depth2;

            //console.log($naviSubUl2.eq(depth2).find('li').eq(depth3))

        },
        newsTextMot : function(){
            if(is_en) return;
            newsTimer = setInterval(function(){
                var curr = $('#navigation .navi_area .smart_info_side .smart_info .smart_info_news .notice_list li.active');
                var next = ( curr.next().length == 0 ) ? $('#navigation .navi_area .smart_info_side .smart_info .smart_info_news .notice_list li:first-child') : curr.next();
                curr.removeClass('active').stop().animate({'top':34}, 1000, 'easeInOutQuint', function(){
                    curr.css({'top':-34})
                });
                next.addClass('active').stop().animate({'top':0}, 1000, 'easeInOutQuint');
            }, 4000);
        },
        setNewsText:function(){


            $('#navigation .navi_area .smart_info_side .smart_info .smart_info_news .notice_list li').each(function(index) {
                if ( index > 0 ) $(this).css({'top':-34});
                else $(this).addClass('active');
            });
        },
        setCookie : function(name, value, expirehours){
            var todayDate = new Date();
            todayDate.setHours(todayDate.getHours() + expirehours);
            document.cookie = name + "=" + escape(value) + ";path=/;expires=" + todayDate.toGMTString() + ";";

        },
        getCookie : function(name){
            var  cookiedata =  document.cookie;
            var index = cookiedata.indexOf(name + "=");
            if(index == -1) return null;

            index = cookiedata.indexOf("=", index) + 1;
            var endstr = cookiedata.indexOf(";", index);
            if(endstr == -1) endstr = cookiedata.length;

            return unescape(cookiedata.substring(index, endstr));
        }
    }

})();

navi.init();

(function(){
    var ary = ["01","02","03","04"];
    if(window.location.href.indexOf('machinery')!=-1){
        ary = ["05","02","08","09"];  navi.naviImgLoad(ary);
    }else if(window.location.href.indexOf('explosives')!=-1){
        ary = ["06","02","08","09"];  navi.naviImgLoad(ary);
    } else if(window.location.href.indexOf('trade')!=-1) {
        ary = ["04", "02", "03", "09"];  navi.naviImgLoad(ary);
    }else if(window.location.href.indexOf('defense')!=-1) {
        ary = ["01", "02", "08", "09"];  navi.naviImgLoad(ary);
    }

})();

/*
 * jjh modify
 * smart info 주식 정보를 가공해서 사용한다
 * */
/*
 var SmartStock = (function(){
 var $self = {
 init:function(){
 try{
 smartStockResult = smartStockResult.replace("images/", "http://www.gsifn.co.kr/IR/hanwha/images/");
 var result = $.parseHTML(smartStockResult);
 $("#smart_price_text_box").html(result[result.length-1]);
 $("#smart_price_text_box").find("img").attr("alt", "");
 }catch(e){
 //console.log("smartStockResult not found");
 }
 }
 }
 return $self;
 })();

 SmartStock.init();
 *//**
 * Created by msminsu on 2016-12-15.
 */


$('.slide-1').each(function(){
    new ui.Slide({
        selector: $(this),
        move: 1,
        callback: function(){
            console.log('callback');
        }
    });
});
var slide3 = new ui.Slide({
    selector: $('.slide-3'),
    move: 1
});

var slide4 = new ui.Slide({
    selector: $('.slide-4'),
    move: 1
});
