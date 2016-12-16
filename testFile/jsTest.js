var abstractCharacterFactory = (function(){
    var jobs = {};
    return {
        addJob: function(job, Character){
            if(Character.prototype.attack){
                jobs[job] = Character;
            }
        },
        create: function(job, options){
            var Character = jobs[job];
            return (Character ? new Character(options):null);
        }
    }
})();

var Emperor = (function(){

    function Emperor(options){
        this.name = options.name;
    }

    Emperor.prototype.attack = function(target){
        console.log(this.name + '가 '+ target + '을 공격합니다.');
    };
    Emperor.prototype.proclaim  = function(){
        console.log(this.name +' 가 스스로를 황제라고 칭했습니다.');
    };
    return Emperor;
})();



var Governor = (function(){
        function Governor(options.name){
            this.name = options.name;
        }
        Governor.prototype.attack = function(target){
            console.log(this.name + ' 가'+target + ' 을 공격합니다.');
        };
        Governor.prototype.betray = function(){
            console.log(this.name + ' 가 황제를 배신합니다. ');
        };
        return Governor;
    }

)();