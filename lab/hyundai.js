/*************************************************************************************************
 *	@CreateDate : 2011.11.01
 *	@ModifyDate : 2011.12.12
 *	@FileName   : menu.js
 *	@Author     : Sung Jin Lee (Persona)
 *
 *   @Searching List
 *   MenuScroller             : 메뉴 스클롤링 담당 객체
 *       1. bind                 : 스크롤링 관련 이벤트 바인딩
 *
 *   Menu
 *		1. init                 : 메뉴 초기값 셋팅
 *		2. makeMenu             : 뎁스 별 메뉴 생성
 *		3. parsingMenu          : 메뉴 json 파싱
 *		4. openMenu             : 페이지 로딩 후 메뉴 인터렉션
 *		5. setMenu              : 메인페이지 로딩 후 메뉴 생성 및 초값 셋팅
 *		6. setNaviHeight        : 화면 높이에 맞게 메뉴 높이 재설정
 *		7. menuScroll           : 메뉴 마우스오버시 인터렉션 (상하 스크롤)
 *		8. setMenuScrollBar     : 메뉴 세로 스크롤바 설정
 *		9. setContentsSlideBar  : 해상도/ 메뉴노출에 따른 슬라이드바 컨트롤
 *		10. setMobileSize       : 해상도 720이하일때 메뉴노출 조정
 *		11. setRemoveMenuHover  : PC가 아닐경우 메뉴에서 hover속성 제거
 *       12. addListener         : 메뉴에서 발생하는 이벤트에 핸들러를 등록
 *       13. triggerListener     : 메뉴 이벤트에 등록된 핸들러 실행
 *       14. onModeChange        : 웹/모바일 모드 전환시 실행할 핸들러를 등록하는 함수
 *       15. _doModeChange       : 모드가 전환될 때 실행할 글로벌 작업들
 *       16. triggerModeChange   : 모드가 변환될 때 등록된 핸들러 실행
 *       17. onContentLoad       : 컨텐츠가 로드될 때 실행할 핸들러 등록
 *       18. _doContentLoad      : 컨텐츠가 로드될 때 실행할 글로벌 작업들
 *       19. triggerContentLoad  : 컨텐츠가 로드될 때 등록된 핸들러 실행
 *       20. onContentUnload     : 컨텐츠가 언로드될 때 실행할 핸들러 등록
 *       21. _doContentUnload    : 페이지가 언로드될 때 실행할 글로벌 작업들
 *       22. triggerContentUnload : 컨텐츠가 언로드될 때 등록된 핸들러 실행
 *       23. onContentResize     : 리사이즈가 발생할때 실행할 핸들러 등록
 *       24. _doContentResize    : 컨텐츠영역이 리사이징 될때 실행 할 글로벌 작업들
 *       25. triggerContentResize : 컨텐츠가 리사이징 될때 등록된 핸들러 실행
 *       26. onContentResizeEnd  : 리사이즈가 끝났을 때 실행할 핸들러 등록
 *       27. _doContentResizeEnd : 컨텐츠영역이 리사이징 끝날 때 실행 할 글로벌 작업들
 *       28. triggerContentResizeEnd : 컨텐츠가 리사이징이 끝날 때, 등록된 핸들러 실행
 *       29. clearContentListeners   : 등록된 모든 핸들러를 제거
 *       30. unbindContentResize : 컨텐츠 리사이징에 등록된 핸들러를 모두 제거
 *       31. _collapseMenu       : 지정된 메뉴를 축소시키는 함수
 *       32. _expandMenu         : 지정된 메뉴를 확장시키는 함수
 *       33. _moveContent        : 컨텐츠 영역을 left값에 따라 움직여 주는 함수
 *       33. _moveMenu           : 메뉴를 left값에 따라 움직여 주는 함수
 *       34. scrollToContent     : 컨텐츠영역으로 스크롤
 *************************************************************************************************/
(function () {
    if (this.Menu) return;

    var console = window.console || { log: function () { } };
    var $win = $(window);
    window.screenWidth = 0;  // 현재 스크린 사이즈


    // 터치 이벤트 확인
    var SUPPORT_TOUCH = 'ontouchstart' in document.documentElement;
    var MENU_DURATION = 500;
    var HEADER_HEIGHT = 57;

    // 메뉴 템플릿
    var menu_tmpl = {
        '1': '<a href="{{LINK}}">{{TITLE}}</a>',
        '2': '<a href="{{LINK}}" class="{{CLASS}}">{{TITLE}}<span class="txt_lt">{{DESCRIPTION}}</span></a>',
        '3': '<a href="{{LINK}}" class="{{CLASS}}"><em>{{TITLE}}</em><span class="txt_lt">{{DESCRIPTION}}</span></a>'
    };

    // 컨트롤 캐쉬
    var $wrapper = null,
        $menuCon = {},
        $menuPane = {},
        $menuCons = null,
        $content = null,
        $nav = null,
        $container = null,
        $footer = null,
        $indicator = null,
        $best = null,
        $header = null,
        $move_left = null,
        $move_right = null,
        $slider = null,
        $slider_span = null,

        nowMenu = '01',         // 현재 메뉴 코드

        menuWidth = 0,          // 네비게이션 width
        menuLeft = 0,           // 메뉴 Left
        contentLeft = 0,        // contentLeft
        containerOffSetLeft = 0, // 컨테이너의 offsetLeft
        openDepth = 1,          // 열려있는 메뉴 갯수


        listeners = [],    // 리스너들

        lookups = [],      // 페이지가 언로드시, 언바인드시킬 이벤트 네임스페이스 저장소

        IS_WEBMODE = true;    // true: web, false: mobile

    // 유틸 함수 //////////////////////////////////////////////////////////////////////////////
    // 스크린 너비 구하는 함수
    function getScreenWidth() {
        var sw = Math.min(Math.round($win.innerWidth()), 1600);
        IS_WEBMODE = sw > 720;
        return sw;
    }
    // 컨텐트 유형에 따른 왼쪽 마진값 반환
    function getMarginLeft() {
        if (!IS_WEBMODE) return 0;

        var left = (!$content.hasClass('special') && ($content.hasClass('submain') || $content.hasClass('main'))) ? 32 : 0;
        return left;
    }
    // nav left
    function getMenuLeft() {
        return (menuLeft = isNaN(menuLeft = Number($nav.css('left').replace('px', ''))) ? 32 : menuLeft);
    }
    // 디바이스에 따른 top 위치 조절
    function cssTop($obj, top) {
        if (typeof top == 'undefined') {
            return parseInt($obj.css('top'), 10) || 0;
        } else {
            $obj.css('top', top);
        }
    }

    /**
     * 메뉴 휠링 & 터치드래깅 바인드
     **/
    var MenuScroller = {
        bind: function ($con) {
            var $header = $('#header'),
                header_height = $header.outerHeight(),
                $nav = $con.unbind(),
                $stick = $('.stick', $con),
                $wrap = $('.nav_scroll_wrap', $con),
                $track = $(".scroll", $con).hide(),
                $arrow_up = $('span.btn_control.up', $con),
                $arrow_down = $('span.btn_control.down', $con);

            if (SUPPORT_TOUCH) {
                (function () {
                    if (IS_WEBMODE) {
                        // css에서 제공하는 스크롤링을 적용
                        $con.css({ '-webkit-overflow-scrolling': 'touch', 'overflow': 'scroll !important' })
                            .find('>div.nav_scroll_wrap').css({ 'height': 'auto !important' });
                    } else {
                        $con.css({ '-webkit-overflow-scrolling': '', 'overflow': 'auto' }).find('>div.nav_scroll_wrap').css({ 'height': '' }); ;
                    }
                })();

            } else {
                (function () {
                    var nav_height = 0;
                    var wrap_height = 0;
                    var hover_timer;

                    // 기존이벤트 언바인딩
                    $nav.unbind();

                    // 호버시에 스크롤바 표시
                    $nav.hover(
                        function () {
                            if (!IS_WEBMODE) return;

                            nav_height = $nav.height();
                            wrap_height = $wrap.height();

                            var wrap_top = parseInt($wrap.css('top'), 10) || 0;
                            if ((nav_height > wrap_height) && (wrap_top == 0)) return;

                            $track.stop(true).fadeIn('fast');

                            // 화살표 표시 ////////////////////////////////////////////////////////////
                            if (wrap_top < 0) { $arrow_up.css({ 'top': 0 }).show(); }
                            if (wrap_top > (nav_height - wrap_height)) {
                                $arrow_down.css({ 'top': nav_height - 55 }).show();
                            }
                            if (hover_timer) clearTimeout(hover_timer);
                            hover_timer = setTimeout(function () {
                                $arrow_down.add($arrow_up).hide();
                            }, 1000); // 1.5초후에 자동으로 사라지게...
                            ///////////////////////////////////////////////////////////////////////////

                        },
                        function () {
                            if (hover_timer) { clearTimeout(hover_timer); hover_timer = null; }
                            $track.fadeOut('fast');
                            $arrow_down.add($arrow_up).hide();
                        }
                    );

                    $nav.mousewheel(function (event, delta) {
                        if (!IS_WEBMODE) return;

                        event.preventDefault();
                        event.stopPropagation();

                        var nav_height = $nav.height(),
                            wrap_top = parseInt($wrap.css('top'), 10) || 0,
                            is_bubble = false;
                        if ((nav_height > wrap_height) && (wrap_top == 0)) return;

                        var oe = event.originalEvent;
                        if (oe.wheelDelta) {
                            delta = oe.wheelDelta / 120;
                        } else if (oe.detail) {
                            delta = -oe.detail / 3;
                        }
                        if (delta < 0) {        //휠 다운
                            is_bubble = wheelDown(nav_height, wrap_height);
                        } else {                //휠 업
                            is_bubble = wheelUp(nav_height, wrap_height);
                        };

                        // 화살표 표시////////////////////////////////////////////////////////////////
                        if (wrap_top < 0) $arrow_up.show();
                        else $arrow_up.hide();

                        if (wrap_top > (nav_height - wrap_height)) $arrow_down.show();
                        else $arrow_down.hide();

                        if (hover_timer) clearTimeout(hover_timer);
                        hover_timer = setTimeout(function () {
                            $arrow_down.add($arrow_up).hide();
                        }, 1500); // 1.5초후에 자동으로 사라지게...
                        /////////////////////////////////////////////////////////////////////////////

                        /*
                         // 더이상 스크롤영역이 없을 때, 본문을 스크롤하고자 할 경우, 상단의 event prevent 부분을 지우고 이 부분을 활성화시켜 주면 된다.
                         if (is_bubble !== true) {
                         event.preventDefault();
                         event.stopPropagation();
                         }
                         */

                    });
                })();
            }

            // $wrap 의 위치에 따라서 스틱 위치를 재조정
            function redrawStick(nav_height, wrap_height, top) {
                var diff = nav_height - wrap_height;
                if (top < diff) top = diff;
                top = Math.abs(top) * (nav_height / wrap_height);
                cssTop($stick, top);
            }

            // 휠 업
            function wheelDown(nav_height, wrap_height) {
                var top = (parseInt($wrap.css('top'), 10) || 0),
                    new_top = top - 30,
                    diff = nav_height - wrap_height;

                if (top === diff) return true;
                if (new_top < diff) new_top = diff;

                $wrap.css('top', new_top);
                redrawStick(nav_height, wrap_height, new_top);
            }

            // 휠 다운
            function wheelUp(nav_height, wrap_height) {
                var top = (parseInt($wrap.css('top'), 10) || 0),
                    new_top = top + 30,
                    diff = nav_height - wrap_height;

                if (new_top > 0) new_top = 0;
                if (top == 0) return true;

                $wrap.css('top', new_top);
                redrawStick(nav_height, wrap_height, new_top);
            }

            return this;
        }
    };

    /**
     * 공통메뉴
     *
     * @namespace
     */
    Menu = {
        /**
         * 메뉴 초기설정
         *
         * @function
         */
        init: function () {

            // 메뉴 오브젝트
            $wrapper = $('#wrapper');
            $menuCon[1] = $('div.lnb');
            $menuCon[2] = $('div.snb');
            $menuCon[3] = $('div.snb_in');
            $menuCons = $('div.nav');
            $menuPane[1] = $("#1depth");
            $menuPane[2] = $("#2depth");
            $menuPane[3] = $("#3depth");
            $content = $("#content");
            $container = $("#container");
            $footer = $('#footer');
            $nav = $('#nav');
            $best = $('div.best', $nav);
            $header = $("#header");
            $move_left = $("#move_content_left");
            $move_right = $("#move_content_right");
            $indicator = $("div.indicator", $header);
            $slider = $("div.slider", $indicator);
            $slider_span = $slider.find('>span');

            screenWidth = getScreenWidth();
            menuLeft = getMenuLeft();

            // 화살표 숨김
            $('span.btn_control', $nav).hide();

            // 기본으로 1뎁스 메뉴에 마우스휠링 이벤트 바인딩
            MenuScroller.bind($menuCon[1]);

            //수정
            if (!DetectSmartphone()) {
                $indicator.hide();
                $container.css('paddingTop', HEADER_HEIGHT);
                $nav.css('top', HEADER_HEIGHT);

                var OLD_IS_WEBMODE = !IS_WEBMODE;
                $win.unbind('.menuHeight').bind('resize.menuHeight', function () {
                    screenWidth = getScreenWidth();

                    if (IS_WEBMODE) {
                        $content.css('width', '');
                        Menu.setMenuScrollBar();
                    }
                    Menu.openMenu();

                    // 모드 변환여부 체크 및 이벤트 핸들러 실행
                    if (OLD_IS_WEBMODE != IS_WEBMODE) {
                        Menu.triggerModeChange();
                    }

                    OLD_IS_WEBMODE = IS_WEBMODE;
                }).trigger('resize.menuHeight');
            }

        },

        /**
         * 메뉴에서 발생하는 이벤트에 핸들러를 등록
         */
        addListener: function (type, handler) {
            (listeners[type] || (listeners[type] = [])).push(handler);
        },

        /**
         * 메뉴 이벤트에 등록된 핸들러 실행
         */
        triggerListener: function (type) {
            if (!listeners[type]) return;
            for (var i = -1, handler; handler = listeners[type][++i]; ) {
                handler();
            }
        },

        /**
         *  모드가 변환될 때 실행할 핸들러를 등록
         *
         * @function
         * @param {Function} cb 핸들러 함수
         */
        onModeChange: function (cb) {
            this.addListener('modechange', cb);
            return this;
        },

        /**
         * 모드가 전환될 때 실행할 글로벌 작업들
         */
        _doModeChange: function () {
            if (IS_WEBMODE) {
                $('div.bg_header').show();
                // 모바일에서 웹모드로 전환 시
                $container.css('zIndex', '');
                $footer.css('zIndex', '');

                // 푸터의 셀렉터박스가 열려있으면 닫는다.
                (function ($btn) {
                    if ($btn.hasClass('on')) {
                        $btn.trigger('click');
                    }
                })($footer.find('div.default'));
            } else {
                $('div.bg_header').hide();
            }

            Common.set2DepthBanner(nowMenu.split('-'));
        },

        /**
         *  모드가 변환될 때 등록된 핸들러 실행
         */
        triggerModeChange: function () {
            this._doModeChange();

            this.triggerListener('modechange');
            return this;
        },

        /**
         *  컨텐츠가 로드될 때 실행할 핸들러 등록
         *
         * @function
         * @param {Function} cb 핸들러 함수
         */
        onContentLoad: function (cb) {
            this.addListener('contentload', cb);
            return this;
        },

        /**
         * 컨텐츠가 로드될 때 실행할 글로벌 작업들
         */
        _doContentLoad: function () {
            this._doModeChange();
        },

        /**
         *  컨텐츠가 로드될 때 등록된 핸들러 실행
         */
        triggerContentLoad: function () {
            this._doContentLoad();
            this.triggerListener('contentload');
            return this;
        },

        /**
         *  컨텐츠가 언로드될 때 실행할 핸들러 등록
         *
         * @function
         * @param {Function} cb 핸들러 함수
         */
        onContentUnload: function (cb) {
            this.addListener('contentunload', cb);
            return this;
        },

        /**
         * 페이지가 언로드될 때 실행할 글로벌 작업들
         */
        _doContentUnload: function () {

        },

        /**
         *  컨텐츠가 언로드될 때 등록된 핸들러 실행
         */
        triggerContentUnload: function () {
            this.triggerListener('contentunload');
            return this;
        },

        /**
         * 리사이즈가 발생할때 실행할 핸들러 등록
         *
         * @function
         * @param {Function} cb 핸들러 함수
         */
        onContentResize: function (ns, cb) {
            if (typeof ns === 'function') {
                $win.bind('resize.contentresize', ns);
            } else if (typeof ns === 'string' && typeof cb === 'function') {
                ns = ns.replace(/^\.*/, '');
                lookups.push(ns);
                $win.bind('resize.' + ns, cb);
            }
            return this;
        },

        /**
         * 컨텐츠영역이 리사이징 될때 실행 할 글로벌 작업들
         *
         * @function
         */
        _doContentResize: function () {
            // 모바일에서 웹으로 변경됐을 때, top 버튼이 위치를 못잡는 버그 수정
            $(window).trigger('scroll.btnTop');

        },

        /**
         * 컨텐츠가 리사이징 될때 등록된 핸들러 실행
         *
         * @function
         */
        triggerContentResize: function () {
            Menu._doContentResize();

            $win.trigger('resize.contentresize');
            for (var i = -1, ns; ns = lookups[++i]; ) {
                $win.trigger('resize.' + ns);
            }
            return this;
        },

        /**
         * 리사이즈가 끝났을 때 실행할 핸들러 등록
         *
         * @function
         * @param {Function} cb 핸들러 함수
         */
        onContentResizeEnd: function (cb) {
            if (typeof cb === 'function') {
                this.addListener('resizeend', cb);
            }
            return this;
        },

        /**
         * 컨텐츠영역이 리사이징 끝날 때 실행 할 글로벌 작업들
         */
        _doContentResizeEnd: function () {

            return this;
        },

        /**
         * 컨텐츠가 리사이징이 끝날 때, 등록된 핸들러 실행
         *
         * @function
         */
        triggerContentResizeEnd: function () {
            Menu._doContentResizeEnd();

            this.triggerListener('resizeend');
            return this;
        },

        /**
         * 컨텐츠 리스너 초기화
         */
        clearContentListeners: function () {
            $win.unbind('.contentresize');
            for (var i = -1, ns; ns = lookups[++i]; ) {
                $win.unbind('.' + ns);
            }
            listeners = {};
            lookups = [];
            return this;
        },

        /*
         * 컨텐츠리사이징에 바인딩된 핸들러를 제거
         *
         * @function
         * @param {String} ns [optional] 제거할 네임스페이스
         */
        unbindContentResize: function (ns) {
            var tmp = [];
            ns.replace(/^\.*/, '');
            for (var i = -1, item; item = lookups[++i]; ) {
                if (item != ns) {
                    tmp.push(item);
                }
            }
            lookups = tmp;
            $win.unbind('.' + ns);
            return this;
        },

        /**
         * 뎁스 별 메뉴 생성
         *
         * @function
         * @param {String} pdepth 생성할 메뉴의 뎁스
         * @param {JSON} pitems 생성할 메뉴의 json 데이타
         */
        makeMenu: function (pdepth, pitems) {
            var nowMenuArr = nowMenu.split('-');

            // 현재 메뉴의 부모메뉴 코드를 조합
            var make_code = function (depth) {
                return (nowMenuArr || []).slice(0, depth).join('-');
            };

            var _makeMenu = function (depth, items, parent_code) {
                var template = menu_tmpl[depth],
                    $pane = $menuPane[depth],
                    my_code = nowMenuArr[depth - 1],
                    hasChild = false,
                    drawMenu = (typeof parent_code == 'undefined' || $pane.attr('parent_code') !== parent_code); // 메뉴를 새로 그릴지 체크

                // 현재 뎁스 기록
                openDepth = depth;


                if (drawMenu) {
                    // 이전에 있던 메뉴는 다 없앰
                    $pane.empty();
                    // 후에 새로 그릴지에 대한 판별을 위해 패널에 속성으로 메뉴코드를 저장
                    $pane.attr('parent_code', parent_code || '');
                }

                var html = '';
                for (var key in items) {
                    var item = items[key];

                    // 새로운 메뉴면 메뉴아이템을 생성하고, 기존에 그려진 메뉴이면, 해당 메뉴아이템을 조회해서 가져온다.
                    if (drawMenu) {
                        html += '<li menu_code="' + key + '" ' + (my_code == key ? ' class="on"' : '') + '>' + Menu.parsingMenu(template, items[key]) + '</li>';
                    } else {
                        $pane.find('>li[menu_code="' + key + '"]')[my_code == key ? 'addClass' : 'removeClass']('on');
                    }

                    if (my_code == key) {
                        // 하위메뉴가 있을경우 하위메뉴를 생성
                        if (nowMenuArr.length >= depth && item.items) {
                            _makeMenu(depth + 1, item.items, make_code(depth));
                            hasChild = true;
                        }
                    }
                }
                if (drawMenu) {
                    $pane[0].innerHTML = html;
                    MenuScroller.bind($menuCon[depth]);
                }

                if (!hasChild) {
                    Menu.openMenu();
                }
            };
            _makeMenu(pdepth, pitems);

            return this;
        },

        /**
         * 메뉴 json 파싱
         *
         * @function
         * @param {String} str 템플릿 문자열
         * @param {JSON} item 템플릿 문자열을 변환할 json 데이타
         * @return {String} 변환된 문자열
         */
        parsingMenu: function (str, item) {
            for (var k in item) {
                str = str.replace('{{' + k.toUpperCase() + '}}', item[k]);
            }
            return str;
        },

        /**
         * 페이지 로딩 후 메뉴 인터렉션
         *
         * @function
         */
        openMenu: function () {

            $content.width($content.innerWidth());

            // document.title = screenWidth + ' ' + openDepth;

            //모바일 사이즈
            if (!IS_WEBMODE) {
                Menu.setMobileSize();
                // 웹사이즈
            } else {

                // 페이지 로딩 시 포커스 이동 , 2016.03.22 삭제 : 웹접근성 강제 초점이동 스크립트 제거
                if (openDepth > 1) {
                    setTimeout(function () {
                        if ($menuPane[openDepth].children('li[class=on]').length == 0) {
                            $menuPane[openDepth].children('li:first').children('a:first').focus();
                        } else {
                            $menuPane[openDepth].children('li[class=on]').children('a:first').focus();
                        }

                    }, 500);
                }

//                if (openDepth > 1) {
//                    setTimeout(function () {
//
//                        if ($menuPane[openDepth].children('li[class=on]').length == 0) {
//                            $('#skipnavi').find('.hide').remove();
//                            $('#skipnavi').prepend("<a href='#' class='hide'></a>");
//                            $('#skipnavi').children('a:first').focus();
//                        } else {
//                            $('#skipnavi').find('.hide').remove();
//                            $('#skipnavi').prepend("<a href='#' class='hide'></a>");
//                            $('#skipnavi').children('a:first').focus();
//                        }
//                    }, 500);
//                }

                //containerOffSetLeft = $container.offset().left;
                menuLeft = getMenuLeft();
                contentLeft = openDepth * 159 + 32 + openDepth;

                $menuCon[1][(openDepth >= 1 ? 'show' : 'hide')]();

                // 해상도에 따른 메뉴 인터렉션 변화
                if (screenWidth >= 1600) {

                    menuLeft = $header.offset().left + 32;
                    $content.css({ 'width': '' });

                } else if (screenWidth > 1200 && screenWidth < 1600) {

                    $content.css({ 'width': '', 'minWidth': 641 });
                    menuLeft = 32;

                } else if (screenWidth > 880 && screenWidth <= 1200) {

                    $content.css({ 'width': '', 'minWidth': 481 });

                    if (openDepth > 1) {
                        menuLeft = -((openDepth - 2) * 160) + 32;
                    } else {
                        menuLeft = 32;
                    }

                    contentLeft += (menuLeft - 32);

                } else if (screenWidth <= 880 && screenWidth > 720) {

                    menuLeft = -((openDepth - 1) * 160) + 32;

                    $content.css({ 'width': '', 'minWidth': 481 });
                    contentLeft += (menuLeft - 32);

                }

                if (openDepth >= 2) {
                    Menu._expandMenu($menuCon[2]);
                } else {
                    Menu._collapseMenu($menuCon[2]);
                }

                if (openDepth >= 3) {
                    Menu._expandMenu($menuCon[3]);
                } else {
                    Menu._collapseMenu($menuCon[3]);
                }

                if (SUPPORT_TOUCH) {
                    Menu._moveMenu(menuLeft, function () {
                        Menu._moveContent(contentLeft, {
                            duration: 0,
                            complete: function () {
                                Menu.setContentsSlideBar();
                            }
                        });
                    });
                } else {
                    Menu._moveMenu(menuLeft)
                        ._moveContent(contentLeft, function () {
                            Menu.setContentsSlideBar();
                        });
                }

            }

            return this;
        },

        /**
         * 지정된 메뉴를 축소시키는 함수
         *
         * @function
         * @param $menu {jQuery} 축소시킬 메뉴
         * @param [cb] {Function} 애니메이트가 끝났을 때, 실행할 콜백 함수
         */
        _collapseMenu: function ($menu, cb) {
            // 닫히는 순간 parent_code 삭제
            $menu.find('.menu>ul').removeAttr('parent_code');

            if (SUPPORT_TOUCH) {
                $menu.css({ 'width': '0px', 'overflow': '' }).hide();
                cb && cb.call($menu[0]);
            } else {
                $menu
                    .stop(true)
                    .animate({ 'width': '0px' }, MENU_DURATION, 'easeInOutQuad', function () {
                        $menu.hide().css({ 'overflow': '' });
                        cb && cb.call($menu[0]);
                    });
            }
            return this;
        },

        /**
         * 지정된 메뉴를 확장시키는 함수
         *
         * @function
         * @param $menu {jQuery} 확장시킬 메뉴
         * @param [cb] {Function} 애니메이트가 끝났을 때, 실행할 콜백 함수
         */
        _expandMenu: function ($menu, cb) {
            if (SUPPORT_TOUCH) {
                $menu.show().css({ 'width': '159px', 'display': 'block', 'overflow': '' });
                cb && cb.call($menu[0]);
            } else {
                $menu
                    .show()
                    .stop(true)
                    .animate({ 'width': '159px' }, MENU_DURATION, 'easeInOutQuad', function () {
                        $menu.css({ 'display': 'block', 'overflow': '' });
                        cb && cb.call($menu[0]);
                    });
            }

            return this;
        },

        /**
         * 컨텐츠영역을 축소/확장시키는 함수
         *
         * @function
         * @param contentLeft {Number} left 값
         * @param [duration] {Number} duration 값
         * @param [cb] {Function} 애니메이트가 끝났을 때, 실행할 콜백 함수
         */
        _moveContent: function (contentLeft, opt) {
            contentLeft -= getMarginLeft();

            var complete = false,
                step = false,
                duration = false;

            if (typeof opt == 'object') {
                // 타이밍
                if ('duration' in opt) { duration = opt.duration; }
                // 완료 핸들러
                if ('complete' in opt) { complete = opt.complete; }
                // 스텝 핸들러
                if ('step' in opt) { step = opt.step; }
            } else if (typeof opt == 'function') {
                complete = opt;
            } else if (typeof opt == 'number') {
                duration = opt;
            }

            if (duration === 0 || SUPPORT_TOUCH) {
                $content.css('marginLeft', contentLeft);
                step && step.apply($content[0], [contentLeft]);
                complete && complete.call($content[0]);
                this.triggerContentResize();
                this.triggerContentResizeEnd();
            } else {

                var step_idx = 0;
                $content
                    .stop(true)
                    .animate(
                        {
                            'marginLeft': contentLeft + 'px'
                        },
                        {
                            'duration': MENU_DURATION,
                            'easing': 'easeInOutQuad',
                            'complete': function () {
                                complete && complete.call(this);
                                Menu.triggerContentResize();
                                Menu.triggerContentResizeEnd();
                            },
                            'step': function () {
                                step && step.apply(this, [now, fx]);
                                setTimeout(function () {
                                    Menu.triggerContentResize();
                                }, 0);
                            }
                        });
            }

            return this;
        },

        /**
         * 메뉴를 좌우로 움직이는 함수
         *
         * @function
         * @param $menu {jQuery} 닫을 메뉴
         * @param [cb] {Function} 애니메이트가 끝났을 때, 실행할 콜백 함수
         */
        _moveMenu: function (left, opt) {
            var complete = false,
                step = false,
                duration = false;

            if (typeof opt == 'object') {
                // 타이밍
                if ('duration' in opt) { duration = opt.duration; }
                // 완료 핸들러
                if ('complete' in opt) { complete = opt.complete; }
                // 스텝 핸들러
                if ('step' in opt) { step = opt.step; }
            } else if (typeof opt == 'function') {
                complete = opt;
            } else if (typeof opt == 'number') {
                duration = opt;
            }

            if (duration === 0 || SUPPORT_TOUCH) {
                $nav.css('left', left);
                $menuCons.css({ 'overflow': '' });
                step && step.apply($nav[0], [left]);
                complete && complete.call($nav[0]);
            } else {

                $nav.stop(true).animate({ 'left': left },
                    {
                        'duration': MENU_DURATION,
                        'easing': 'easeInOutQuad',
                        'complete': function () {
                            $menuCons.css({ 'overflow': '' });
                            complete && complete.call(this);
                        },
                        'step': function (now, fx) {
                            step && step.apply(this, [now, fx]);
                        }
                    });
            }
            return this;
        },

        /**
         * 컨텐츠영역으로 스크롤
         *
         * @param {Number} duration Duration 값
         * @param {Function} [cb] 스크롤이 끝난 후에 실행할 콜백함수
         */
        scrollToContent: function (duration, cb) {
            // 메인은 스크롤하지 않는다.
            if (location.href.indexOf('/pages/main.aspx') < 0) {
                duration = duration || 800;
                setTimeout(function () {
                    Common.scrollToElement($content, duration);
                    cb && cb.call($content[0]);
                }, 1000);
            } else {
                Common.scrollTo(0, function () {
                    cb && cb.call($content[0]);
                });
            }
        },

        /**
         * 메인페이지 로딩 후 메뉴 생성 및 초값 셋팅
         *
         * @function
         */
        setMenu: function (depth, give_padding) {
            // 스크롤이 되어있으면 0위치로 초기화 시켜준다.
            function moveWrapToTop(open_depth, is_force) {
                for (var i = open_depth + 1; i < 3; i++) {
                    cssTop($menuCon[i].children('.nav_scroll_wrap'), 0);
                }

                if (open_depth < 3 || is_force) {
                    cssTop($menuCon[3].children('.nav_scroll_wrap'), 0);
                }
            }

            $nav.css('visibility', 'visible');
            openDepth = 1;

            if (depth == '*' || depth == '~') { // only 1depth show
                if (depth == '*') {
                    if ($content.hasClass('special')) {
                        $content.addClass('submain');
                    } else {
                        $content.addClass('main');

                        // 각 메뉴의 scroll top을 0위치로 초기화
                        moveWrapToTop(0);
                    }
                } else {
                    $content.addClass('optimum');
                }

                // 기본적으로 1depth 메뉴를 모두 비활성화
                $menuPane[1].find('>li').removeClass('on');

                if (!IS_WEBMODE) {
                    Menu.setMobileSize();
                    Menu.scrollToContent(800);
                } else {
                    $content.css('width', '');
                    if (!DetectSmartphone()) {
                        if (screenWidth >= 1600) {
                            containerOffSetLeft = $container.offset().left;
                            Menu._moveMenu(containerOffSetLeft + 32);
                        } else {
                            Menu._moveMenu(32);
                        }

                        Menu._collapseMenu($menuCon[2])
                            ._collapseMenu($menuCon[3])
                            ._expandMenu($menuCon[1], function () { $content.css('visibility', 'visible'); })
                            ._moveContent($menuCon[1].width() + 32, function () { Menu.setContentsSlideBar(); });
                    }
                }

            } else {    // 하위 페이지일 경우
                // 메뉴 생성
                var tmp = depth.split('-');
                if (tmp.length == 1) {
                    $content.addClass('submain');
                } else {
                    // 좌우패딩이 필요없는 경우 false가 넘어옴
                    if (give_padding !== false) {
                        $content.addClass('optimum');
                    }
                }

                // 스크롤이 되어있으면 0위치로 초기화 시켜준다.
                moveWrapToTop(tmp.length, tmp.length == 3 && tmp[2] == '01');

                // 해당페이지의 메뉴 코드를 기록
                nowMenu = depth;
                Menu.makeMenu(1, HMC_MenuData);

                if (!IS_WEBMODE) {
                    Menu.scrollToContent();
                }
            }

            if (!DetectSmartphone() && IS_WEBMODE) {
                /////comahead : Menu.setNaviHeight();
            }

            setTimeout(function () {
                $content.css('visibility', 'visible');
                // 화면 갱신
                //////if (SUPPORT_TOUCH) { $(window).trigger('resize.menuHeight'); }
            }, 500);

            return this;
        },

        /**
         * 화면 높이에 맞게 메뉴 높이 재설정
         *
         * @function
         */
        setNaviHeight: function () {
            $(".area_nav").height($win.height() - $header.outerHeight());
            Menu.setMenuScrollBar();

            return this;
        },

        /**
         * 메뉴 세로 스크롤바 설정
         *
         * @function
         */
        setMenuScrollBar: function () {

            if (!IS_WEBMODE) {
                // 모바일 사이즈
                $indicator.hide();
            } else {
                // 웹 사이즈
                var header_height = $header.outerHeight(),
                    win_height = $win.height(),
                    track_height = win_height - header_height - 20;

                $menuCons.height(win_height - header_height);
                $menuCons.each(function () {
                    var $nav = $(this),
                        $wrap = $('>div.nav_scroll_wrap', this),
                        $track = $('>div.scroll', this),
                        $stick = $track.children(),
                        wrap_height = $wrap.height(),
                        wrap_top = cssTop($wrap),
                        nav_height = $nav.height(),
                        scroll_persent = nav_height / wrap_height * 100

                    if (wrap_top < 0) {
                        if (wrap_height + wrap_top <= nav_height) {
                            wrap_top = Math.min(0, nav_height - wrap_height);
                            cssTop($wrap, wrap_top);
                        }
                    }

                    $track.height(track_height);
                    $stick.css({ 'height': scroll_persent + '%' });
                    cssTop($stick, Math.max(0, Math.abs(wrap_top) * (nav_height / wrap_height)));
                });

            }

            return this;
        },

        /**
         * 해상도/ 메뉴노출에 따른 슬라이드바 컨트롤, _moveContent 에서 호출됨
         *
         * @function
         */
        setContentsSlideBar: (function () {
            function moveComplete() {
                menuLeft = parseInt($nav.css('left'), 10);
                $slider_span.css({ 'left': -menuLeft + 'px' });
                if (menuLeft >= 0) {
                    $move_left.parent().hide();
                } else {
                    $move_left.parent().show();
                }

                if ((menuLeft + screenWidth - $slider_span.width()) <= 0) {
                    $move_right.parent().hide();
                } else {
                    $move_right.parent().show();
                }
            }

            function moveMenu(left) {
                var menu_width = $nav.outerWidth();

                containerOffSetLeft = $container.offset().left;
                Menu._moveMenu(left, {
                    step: function (now, fx) {
                        contentLeft = menu_width + now;
                        Menu._moveContent(contentLeft - containerOffSetLeft, 0);
                    },
                    complete: function () {
                        moveComplete();
                    }
                });
            }



            return function () {
                if (screenWidth <= 1600) {
                    menuLeft = getMenuLeft();

                    // 버튼 클릭시 컨텐츠 오른쪽으로 이동
                    $move_left.unbind('click').bind('click', function (event) {
                        $content.css('width', $content.innerWidth());
                        if (menuLeft < 0) {
                            moveMenu(menuLeft + 160);
                        }
                        event.preventDefault();
                    });

                    // 버튼 클릭시 컨텐츠 왼쪽으로 이동
                    $move_right.unbind('click').bind('click', function (event) {
                        $content.css('width', $content.innerWidth());
                        if ((menuLeft + screenWidth - $slider_span.width()) >= 0) {
                            moveMenu(menuLeft - 160);
                        }
                        event.preventDefault();
                    });

                    if (menuLeft < 0) {

                        $slider_span.css({ 'width': (screenWidth + menuLeft) + 'px', 'left': -menuLeft + 'px', 'visiblity': 'visible' });
                        $indicator.show();

                        $('.move', $indicator).css('visibility', 'visible');

                        moveComplete();

                    } else {
                        $indicator.hide();
                        $container.css('paddingTop', HEADER_HEIGHT);
                        $nav.css('top', HEADER_HEIGHT);
                        $slider_span.css({ 'left': '0px', 'width': '100%' });
                        $('.move', $indicator).css('visibility', 'hidden');
                    }

                    Menu.setNaviHeight();
                }
            };

        })(),

        /**
         * 해상도 720이하일때 메뉴노출 조정
         *
         * @function
         */
        setMobileSize: function () {
            $content.stop(true).css({ 'minWidth': '', 'width': '' });
            $menuCons.stop(true).css({ 'width': '', 'height': '', 'left': '0px', 'padding': '0px' });
            $menuCon[1][openDepth == 1 ? 'show' : 'hide']();
            $menuCon[2][openDepth == 2 ? 'show' : 'hide']();
            $menuCon[3][openDepth == 3 ? 'show' : 'hide']();

            $nav.stop(true).css({ 'height': '', 'left': '0px', 'padding': '0px' });
            Menu._moveContent(0, 0);
            $container.css('paddingTop', '40px');
            $indicator.hide();
            $('.scroll', $nav).hide();

            return this;
        },

        /**
         * PC가 아닐경우 메뉴에서 hover속성 제거
         *
         * @function
         */
        setRemoveMenuHover: function () {
            if (SUPPORT_TOUCH) {
                $('head').append('<link rel="stylesheet" type="text/css" href="/css/unhover.css"/>');
            }

            return this;
        }

    };

})(window);

$(function () {
    // 메뉴 초기설정
    Menu.init();
    Menu.setRemoveMenuHover();
});

//$(function () {
//    $(document).on('click', '#nav', function () {
//        $('#skipnavi').find('.hide').remove();
//        $('#skipnavi').prepend("<a href='#' class='hide' id='aGO'></a>");
//        $('#skipnavi').find('#aGO').focus();
//    });
//});