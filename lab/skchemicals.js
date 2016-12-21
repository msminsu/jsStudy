// TopMenu
(function($)
{
    $.fn.TopMenu	= function (option)
    {
        var target				= $(this);
        var option				= option || {};
        var interval			= option.interval ? option.interval : 500;
        var individual			= option.individual ? option.individual : false;

        var lnb_name			= option.lnb_name ? option.lnb_name : '.lnb-item';
        var lnb_title_name		= option.lnb_title_name ? option.lnb_title_name : '.lnb-item-title';
        var lnb_symbol_name		= option.lnb_symbol_name ? option.lnb_symbol_name : '';
        var lnb_sub_item_name	= option.lnb_sub_item_name ? option.lnb_sub_item_name : '.lnb-sub-item';
        var lnb_sub_name		= option.lnb_sub_name ? option.lnb_sub_name : '.lnb-sub';

        var lnb_active_css		= option.lnb_active_css ? option.lnb_active_css : 'active';
        var lnb_sub_active_css	= option.lnb_sub_active_css ? option.lnb_sub_active_css : 'active';

        var timeout				= null;

        var lnb					= $(target).children(lnb_name);
        var lnb_title			= $(target).find(lnb_title_name);
        var lnb_symbol			= (lnb_symbol_name != '') ? $(target).find(lnb_symbol_name) : false;
        var lnb_sub_item		= $(target).find(lnb_sub_item_name);
        var lnb_sub				= $(target).find(lnb_sub_name);

        if (!option.hover) { option.hover	= {};}

        $(lnb_sub_item).each(function ()
        {
            $(this).hide();
            $(".lnb_bg").hide();
        });

        // 메인 메뉴 이미지 변경 작업
        $(lnb_title).each(function ()
        {
            $(this).find('a:first').ImageRollOver();
        });

        // 하위 메뉴 이미지 변경 작업
        $(lnb_sub).children().each(function ()
        {
            $(this).find('a:first').ImageRollOver();
        });

        var over	= function(obj)
        {
            var index	= $(obj).index();
            if (index >-1)
            {
                // 최상단 메뉴 모두 초기화
                if (lnb_active_css != "")
                {
                    $(lnb).find('.' + lnb_active_css).each(function ()
                    {
                        $(this).removeClass(lnb_active_css)
                    });
                }
                // 하위 모든 메뉴 타이틀 이미지 비활성화
                if ($(lnb_symbol) !== false)
                {
                    $(lnb_symbol).hide();
                    $(".lnb_bg").hide();
                }

                // 선택 메뉴 활성화
                if (lnb_active_css != "")
                {
                    $(obj).children(lnb_title_name).find('a:first').addClass(lnb_active_css);
                    $(".lnb_bg").show();
                }

                if (individual === true)
                {
                    if ($(lnb_sub_item).eq(index).is(':visible'))
                    {
                        // 선택 하위 메뉴 활성화
//						if ($(lnb_sub_item).eq(index).is(':animated'))
//						{
//							$(lnb_sub_item).eq(index).slideDown('fast', function ()
//							{
//								if ($(lnb_symbol) !== false)
//								{
//									$(obj).find(lnb_symbol_name).eq(index).show();
//								}
//							});
//						}
//						else
//						{
//							$(obj).find(lnb_symbol_name).eq(index).show();
//						}
                    }
                    else
                    {
                        // 하위 모든 메뉴 활성화
                        $(lnb_sub_item).slideUp('fast');
                        $(lnb_sub_item).eq(index).slideDown('fast', function ()
                        {
                            if ($(lnb_symbol) !== false)
                            {
                                $(obj).find(lnb_symbol_name).eq(index).show();
                            }
                        });
                    }
                }
                else
                {
                    if ($(lnb_sub_item).is(':visible'))
                    {
                        // 선택 하위 메뉴 활성화
                        if ($(lnb_sub_item).is(':animated'))
                        {
                            $(lnb_sub_item).slideDown('fast', function () {$(obj).find(lnb_symbol_name).show();});
                        }
                        else
                        {
                            $(obj).find(lnb_symbol_name).show();
                        }
                    }
                    else
                    {
                        // 하위 모든 메뉴 활성화
                        $(lnb_sub_item).slideDown('fast', function () {$(obj).find(lnb_symbol_name).show();});
                    }
                }

            }
        };

        var out		= function ()
        {
            // 하위 모든 메뉴 및 하위 메뉴 타이틀 비활성화
            if ($(lnb_symbol) !== false)
            {
                $(lnb_symbol).hide();
                $(".lnb_bg").slideUp('show');
            }
            $(lnb_sub_item).slideUp();

            // 최상단 메뉴 모두 초기화
            if (lnb_active_css != "")
            {
                $(lnb).find('.' + lnb_active_css).each(function ()
                {
                    $(this).removeClass(lnb_active_css)
                });
            }
        };

        var timer_in	= function (obj)
        {
            clearTimeout(timeout);
            over(obj);
        };

        var timer_out	= function ()
        {
            timeout	= setTimeout(out, interval);
        };

        // 상단 메뉴 선택시
        $(lnb_title).find('a:first')
            .hover
            (
                function ()
                {
                    var index	= $(lnb_title).index($(this).parent());
                    timer_in($(lnb).eq(index));
                },
                function ()
                {
                    timer_out();
                }
            )
            .focus
            (
                function()
                {
                    var index	= $(lnb_title).index($(this).parent());
                    timer_in($(lnb).eq(index));
                }
            )
            .blur(function() { timer_out(); });


        // 하위 메뉴 영역 선택시
        $(lnb_sub_item).hover
        (
            function ()
            {
                var index	= $(lnb_sub_item).index($(this));
                timer_in($(lnb).eq(index));
                $(lnb_sub_item).addClass('active'); /* 추가 */
            },
            function ()
            {
                timer_out();
            }
        );

        // 하위 메뉴 링크 선택시
        $(lnb_sub).children().find('a')
            .focus(function()
            {
                var index	= $(lnb_sub).index($(this).parent().parent());
                timer_in($(lnb).eq(index));
            })
            .blur(function() {
                timer_out(); });
    };

})(jQuery);

