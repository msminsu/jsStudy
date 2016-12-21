// about samsung ui script

//about library
var aboutLib = (function (){

    function openMenu(target){
        var iconMinus = target.find('.icon-plus'), blind = iconMinus.find('.blind');
        target.addClass('on');
        iconMinus.removeClass().addClass('icon-minus');
        blind.text( iconMinus.attr('data-after-text') );
    }

    function closeMenu(target){
        var iconPlus = target.find('.icon-minus'),
            blind = iconPlus.find('.blind');
        target.removeClass('on');
        iconPlus.removeClass().addClass('icon-plus');
        blind.text( iconPlus.attr('data-text') );
    }

    return {

        //about global var
        aboutVar : {},

        // s: LNB
        aboutLnb : {
            depthVar : {},

            //loading
            aboutLnbLoading : function(depth1, depth2, depth3, depth4) {

                this.depthVar.depth1 = depth1;
                this.depthVar.depth2 = depth2 || null;
                this.depthVar.depth3 = depth3 || null;
                this.depthVar.depth4 = depth4 || null;

                this.loadingAction = function() {

                    //depth1
                    if (!$(".about_lnb > h3 a").hasClass("on")) {
                        if (aboutLib.aboutVar.checkDeviceId > 3) {
                            $(".about_lnb > h3 a").trigger("click");
                        } else {
                            $(".about_lnb > h3:eq(" + (depth1 - 1) + ") > a").trigger("click");
                        }
                    }

                    //depth2
                    if (aboutLib.aboutLnb.depthVar.depth3 == null) {
                        $("#about_lnb_0" + depth1 + " > li:eq(" + (depth2 - 1) + ") > a").addClass("on");
                    } else {
                        $("#about_lnb_0" + depth1 + " > li:eq(" + (depth2 - 1) + ") > a").trigger("click");
                    }

                    //depth3
                    if (aboutLib.aboutLnb.depthVar.depth4 == null) {
                        $("#about_lnb_0" + depth1 + " > li:eq(" + (depth2 - 1) + ") > ul > li:eq(" + (depth3 - 1) + ") > a").addClass("on");
                    } else {

                        $("#about_lnb_0" + depth1 + " > li:eq(" + (depth2 - 1) + ") > ul > li:eq(" + (depth3 - 1) + ") > a").trigger("click");
                        $("#about_lnb_0" + depth1 + " > li:eq(" + (depth2 - 1) + ") > ul > li:eq(" + (depth3 - 1) + ") > ul > li:eq(" + (depth4 - 1) + ") > a").addClass("on");
                    }

                    setTimeout(aboutLib.startPst,500);
                };

                if (aboutLib.aboutVar.checkDeviceId < 4) {
                    $(".about_lnb").addClass("mobile");
                }

                if (aboutLib.aboutVar.checkDeviceId > 3) {
                    $(".about_lnb").addClass("pc");
                }

                this.loadingAction();
            },

            aboutLnbReset : function() {
                if (aboutLib.aboutVar.checkDeviceId < 4) {
                    if (!$(".about_lnb").hasClass("mobile")) {
                        $(".about_lnb").removeClass("pc").addClass("mobile");
                        this.aboutLnbResetAction();
                    }
                }

                if (aboutLib.aboutVar.checkDeviceId > 3) {
                    if (!$(".about_lnb").hasClass("pc")) {
                        $(".about_lnb").removeClass("mobile").addClass("pc");
                        this.aboutLnbResetAction();
                        this.loadingAction();
                    }
                }
            },

            aboutLnbResetAction : function(reset) {
                closeMenu($(".about_lnb *"));
                /*$(".about_lnb *").removeClass("on");
                 $(".about_lnb *").find(".icon-minus").removeClass().addClass("icon-plus");*/
                $(".about_lnb ul").hide();
            },

            aboutLnbAction : function(name) {
                name = name || {};
                var depth1 = name.depth1;
                var depth2 = name.depth2 || "null";
                var depth3 = name.depth3 || "null";
                var naviBtn = $(depth1 + "," + depth2 + "," + depth3);

                //event action
                var action = {
                    click : function(e) {
                        var eTarget = e.currentTarget;
                        var sTarget = eTarget.hash;

                        if ($(".about_lnb").hasClass("pc")) {
                            if ($(eTarget).hasClass("on")) {
                                this.close(sTarget, eTarget);
                            } else {
                                this.open(sTarget, eTarget);
                            }
                        } else if ($(".about_lnb").hasClass("mobile")) {
                            if ($(eTarget).hasClass("on")) {
                                this.close(sTarget, eTarget);
                            } else {
                                this.init(sTarget, eTarget);
                                this.open(sTarget, eTarget);
                            }
                        }
                    },

                    init : function(sTarget, eTarget) {
                        if ($(eTarget).is(depth1)) {
                            $(depth1).each(function() {
                                var a = $(this).attr("href");
                                $(a).hide();
                                closeMenu($(this));
                                /*$(this).removeClass("on");
                                 $(this).find(".icon-minus").removeClass().addClass("icon-plus");*/
                            });
                        }
                        if ($(eTarget).is(depth2)) {
                            $(depth2).each(function() {
                                var a = $(this).attr("href");
                                $(a).slideUp();
                                closeMenu($(this));
                                /*$(this).removeClass("on");
                                 $(this).find(".icon-minus").removeClass().addClass("icon-plus");*/
                            });
                        }
                    },

                    open : function(sTarget, eTarget) {
                        openMenu($(eTarget));
                        /*$(eTarget).addClass("on");
                         $(eTarget).find(".icon-plus").removeClass().addClass("icon-minus");*/
                        $(sTarget).stop().slideDown();
                    },

                    close : function(sTarget, eTarget) {
                        closeMenu($(eTarget));
                        /*$(eTarget).removeClass("on");
                         $(eTarget).find(".icon-minus").removeClass().addClass("icon-plus");*/
                        $(sTarget).stop().slideUp();
                    }
                };

                //click event
                $(naviBtn).bind("click", function(e) {
                    action.click(e);
                    return false;
                });
            }
        },

        // s: Accordion Tab
        aboutAccordion : function(eBtn, showTab) {
            eBtn = eBtn;
            showTab = showTab || 0;

            //event action
            var action = {

                loading : function(showTab) {
                    action.count = 0;
                    $(eBtn).eq(showTab).trigger("click");
                },

                click : function(e) {
                    var eTarget = e.currentTarget;
                    var sTarget = eTarget.hash;

                    if ($(eTarget).hasClass("on")) {
                        this.close(sTarget, eTarget);
                    } else {
                        this.init(sTarget, eBtn);
                        this.open(sTarget, eTarget);
                    }
                },

                init : function(sTarget, eBtn) {
                    $(eBtn).each(function() {
                        var a = $(this).attr("href");

                        $(a).slideUp();
                        closeMenu($(this));
                        /*$(this).removeClass("on");
                         $(this).find(".icon-minus").removeClass().addClass("icon-plus");*/
                    });
                },

                open : function(sTarget, eTarget) {
                    openMenu($(eTarget));
                    /*$(eTarget).addClass("on");
                     $(eTarget).find(".icon-plus").removeClass().addClass("icon-minus");*/
                    $(sTarget).stop().slideDown(function() {
                        if (action.count > 0) {
                            action.move(eTarget);
                        }
                        action.count = 1;
                    });
                },

                close : function(sTarget, eTarget) {
                    closeMenu($(eTarget));
                    /*$(eTarget).removeClass("on");
                     $(eTarget).find(".icon-minus").removeClass().addClass("icon-plus");*/
                    $(sTarget).stop().slideUp();
                },

                move : function(eTarget) {
                    var pst = $(eTarget).offset().top;

                    $("body").animate({
                        "scrollTop" : pst
                    }, 700);

                }
            };

            //click event
            $(eBtn).bind("click", function(e) {
                action.click(e);
                return false;
            });

            //loading event
            action.loading(showTab);
        },

        // Contents Tab
        contentsTab : function(eBtn, showTab) {

            eBtn = eBtn;
            showTab = showTab || 0;

            //event action
            var action = {

                loading : function() {
                    $(".tab_con").hide();
                    $(".tab_btn ul li").eq(showTab).find("a").trigger("click");
                },

                click : function(e) {
                    var eTarget = e.currentTarget;

                    $(".tab_btn ul li a.on").removeClass("on");
                    $(".tab_btn ul li a span.icon-arrow-on").attr("class", "icon icon-arrow-off");
                    $(eTarget).find("span.icon").attr("class", "icon icon-arrow-on");
                    $(eTarget).addClass("on");

                    var sTarget = $(eTarget).attr("href");

                    $(".tab_con").hide();
                    $(sTarget).show();
                }
            };

            //click event
            $(eBtn).bind("click", function(e) {
                action.click(e);
                return false;
            });

            //loading event
            action.loading(showTab);
        },

        //Page loading position at mobile device
        startPst : function(speed) {
            var speed = speed || 350;
            //mobile
            if (aboutLib.aboutVar.checkDeviceId < 4) {
                if (ss.metrics.isMobile() !== null) {
                    var pst = $(".about_bread_crumbs").offset().top;
                    $("body").animate({
                        "scrollTop" : pst
                    }, speed);
                }

            }
        },

        //Quick navi move to bottom at mobile device
        moveNavi : function() {

            //mobile
            if (aboutLib.aboutVar.checkDeviceId < 4) {
                if ($(".about_centent .about_quick").length === 0) {
                    $(".about_centent").append($(".about_quick"));
                    $(".about_quick").css("display", "block");
                }
            }
            //pc
            if (aboutLib.aboutVar.checkDeviceId > 3) {
                if ($(".about_nav .about_quick").length === 0) {
                    $(".about_nav").append($(".about_quick"));
                }
            }
        },

        visualPst : function() {
            var checkHeight = this.checkSize.crumbsHeight();
            if (!$(".hero").hasClass("img_gallery")) {

                $(".hero, .sub_visual").css({
                    "margin-top" : -checkHeight
                });
            }
        },

        //check size
        checkSize : {
            //bread crumbs height
            crumbsHeight : function() {
                var a = $(".about_bread_crumbs").outerHeight();
                return a;
            }
        },

        //fix height
        fixHeight : function() {
            var fix = [];

            if ($(".main_page").length > 0) {
                refix(1);
            } else {
                refix(3);
            }

            function refix(a) {
                if (aboutLib.aboutVar.checkDeviceId > a) {
                    $(".fix_height").removeAttr("style");
                    var fixNum = new Array();
                    var compare = 0;
                    $(".fix_height").each(function(index) {

                        $(this).find("> *").each(function() {
                            fixNum.push($(this).outerHeight());
                        });
                        for (var i = 0; i < fixNum.length; i++) {
                            if (compare < fixNum[i]) {
                                compare = fixNum[i];
                            }
                        }
                        fix.push(compare);
                    });

                    $(".fix_height").each(function(index) {
                        $(this).css({
                            "height" : fix[index]
                        });
                    });
                } else {
                    $(".fix_height").css({
                        "height" : "auto"
                    });
                }
            }

        },

        fixImgBox : function() {
            var obj = ".box_layout .img, .preview_pic_box .pic";

            $(obj).each(function(index) {
                var a = $(this).parent().outerHeight();

                $(this).css({
                    "height" : a
                });
                if(!$(this).find("img").hasClass("exc")){
                    $(this).find("img").css({
                        "height" : a
                    });
                }
            });
        }
    };
})();

// document ready
$(document).ready(function() {

    aboutLib.aboutVar.checkDeviceId = ss.metrics.deviceLayoutId;
    aboutLib.aboutLnb.aboutLnbAction({
        depth1 : ".lnb_btn_01",
        depth2 : ".lnb_btn_02",
        depth3 : ".lnb_btn_03"
    });

    aboutLib.aboutAccordion(".about_tab .opener a");
    aboutLib.contentsTab(".tab_btn a");
    aboutLib.moveNavi();
    aboutLib.visualPst();
    aboutLib.fixImgBox();

    aboutLib.aboutLnb.aboutLnbLoading();

    //resize event
    eventBridge.on(eventDictionary.global.RESIZE, function() {

        aboutLib.aboutVar.checkDeviceId = ss.metrics.deviceLayoutId;

        aboutLib.moveNavi();
        aboutLib.visualPst();
        aboutLib.fixHeight();
        aboutLib.fixImgBox();
        aboutLib.aboutLnb.aboutLnbReset();
    });
});

// window load
$(window).on("load", function() {
    aboutLib.visualPst();
    aboutLib.fixHeight();
    aboutLib.fixImgBox();
});
