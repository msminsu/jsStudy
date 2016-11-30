var minsu = {};

minsu.helper = (function ($){
    function getBtnTarget(t){
        return $(t).attr('data-target') ? $(t).attr('data-target') : t.hash;
    }

    function Stack(){
        this.dataStore = [];
    }

    Stack.prototype = {
        add: function (data){
            this.dataStore.push(data);
        },
        get: function (){
            return this.dataStore.pop();
        }
    };

    function List(){
        this.dataStore = [];
    }

    List.prototype = {
        add: function (data){
            this.dataStore.push(data);
        },
        remove: function (value){
            var index = this.find(value);
            if(index > -1){
                this.dataStore.splice(index, 1);
                return true;
            }
            return false;
        },
        find: function (value){
            for (var i = 0, max = this.dataStore.length; i < max; i++) {
                if(this.dataStore[i] == value){
                    return i;
                }
            }
            return -1;
        }
    };

    return {
        Stack: Stack,
        List: List,
        getBtnTarget: getBtnTarget
    }
}(window.jQuery));/**
 * Created by msminsu on 2016-11-29.
 */
