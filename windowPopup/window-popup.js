/**
 * Created by msminsu on 2016-11-29.
 */
/*
* window.open(URL, name, specs, replace )
* http://www.w3schools.com/jsref/met_win_open.asp
* https://developer.mozilla.org/en-US/docs/Web/API/Window/open
* */

var minsu = {};
minsu.windowPopup = (function($){

    function open(e){
        e.preventDefault();
        var url = $(this).attr('href'),
            specs = $(this).attr('data-ui-window-open'),
            name = $(this).attr('data-ui-window-name')?$(this).attr('data-ui-window-name') : false;

        if(name){
            open.data[name] = window.open(url, '_blank', specs);
        }else{
            window.open(url,'_blank',specs);
        }
    }

    open.data = {};
    function close(value) {
        open.data[value].close();
        delete open.data[value];
    }

    $(document).on('click.minsu.windowPopup','[data-ui-window-open]', open);

    return {
        open: open,
        close: close
    }

}(window.jQuery));

