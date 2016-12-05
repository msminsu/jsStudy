
minsu.layerPopup = (function($){
    var layerSection = $('#layer-section');
    if(layerSection.length < 1){
        return;
    }

    var layerDataStore = {},
        openHistory = new minsu.helper.Stack(),
        openList = new minsu.helper.List();

    function addData(html){
        layerDataStore['#'+$(html).attr('id')] = $(html);
    }

    function open(template){
        addData(template);
        showLayer(false, '#'+$(template).attr('id'));
    }

    function isOpen(){
        return lqyerSection.find('.layer').length > 0;
    }

    function close(hideId){
        hideLayer(false, hideId);
    }

    function showLayer(e, layerId) {
        var showId;
        if(e){
            e.preventDefault();
            showId = minsu.helper.getBtnTarget(e.target);
        }else{
            showId = layerId;
        }

        if(openList.find(showId) > -1){
            return;
        }

        layerSection.append(layerDataStore[showId]).addClass('active');
        $(layerDataStore[showId]).addClass('on').focus();
        openList.add(showId);
        openHistory.add($(e.target));
    }

    function hideLayer(e, hideID){
        hideID = hideId || "#" + $(this).parent().attr('id');
        openList.remove(hideID);
        $(hideID).remove();

        if(!isOpen()){
            layerSection.removeClass('active');
        }
        if(e){
            e.preventDefault();
            openHistory.get().focus();
        }
    }

    function initOpen(){
        $('[data-ui-layer-open]').each(function(){
            if($(this).attr('data-ui-layer-open') === 'false'){
                return;
            }
            $(this).trigger('click.minsu.layerPopup');
        });
    }

    layerSection.find('.layer').each(function () {
        addData(this);
        $(this).remove();
    });

    $(document).on('click.minsu.layerPopup','[data-ui-layer-open]',showLayer);
    $(document).on('click.minsu.layerPopup','.btn-layer-close', hideLayer);

    initOpen();

    return{
        open: open,
        close: close
    }


})(window.jQuery);