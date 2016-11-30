/**
 * Created by msminsu on 2016-11-30.
 */

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



})(window.jQuery);