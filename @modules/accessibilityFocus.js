var minsu = {};

/**
 * 접근성 관련 포커스 강제 이동
 */


minsu.accessibilityFocus = (function($){
    $(document).on('keydown','[data-ui-focus-prev],[data-ui-focus-next]',function(e){
       var next = $(e.target).attr('data-ui-focus-next'),
           prev = $(e.target).attr('data-ui-focus-prev'),
           target = next || prev || false;

        if(!target || e.keyCode != 9 ){
            return;
        }

        if((!e.shiftKey && !!next) || (e.shiftkey && !!prev)){
            e.preventDefault();
            $('[data-ui-focus-id="'+target+'"]').focus();
        }
    });
})(window.jQuery);


/*

function tooltip(){
    var openBtn = '[data-tooltip]',
        closeBtn = '.tooltip-close';

    function getTarget(t){
        return $(t).attr('data-tooltip');
    }

    function open(t){
        var showTarget = $('[data-tooltip-con="'+t+'"]');
        showTarget.show().focus();
        showTarget.find('.tooltip-close').data('activeTarget',t);
    }

    function close(t){
        var activeTarget = $('[data-tooltip-con="' + t+ '"]');
        activeTarget.hide();
        $('[data-tooltip="'+t+'"]').focus();
    }

    $(document)
        .on('click',openBtn, function(e){
        e.preventDefault();
        open(getTarget(e.target));
        })
        .on('clock',closeBtn,function(e){
            e.preventDefault();
            close($(this).data('activeTarget'));
        })
}

$(document).ready(function(){
    tooltip();
});*/
