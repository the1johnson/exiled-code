$(function() {
    var domElems = {
            monsterul: $('#monsterList'),
        }
        monsterList = {},
        handleAlerts = function($wrapper, alert){
            if(alert.type && alert.msg){
                $wrapper.html('<div class="alert alert-'+alert.type+'" role="alert">'+alert.msg+'</div>');
            }
        },
        updateFilterList = function(listObj, selector){
            var $finderList = $(selector),
                newListItems = '';
            $.each(listObj, function(index, element){
                newListItems += '<li data-id="'+index+'" class="col-sm-6">'+element.name+' - '+element.creature_type+'</li>';
            });
        
            $finderList.html(newListItems);
        },
        getMonsterList = function(){
            $.ajax({
                url:'./scripts/getMonsterNames.php',
                method: "GET"
            }).done(function(data){
                monsterList = $.parseJSON(data);
                updateFilterList(monsterList, '#monsterList');
            }).fail(function(jqXHR, textStatus){});
        };
        
    /* INIT */
    getMonsterList();
    
    $('.list-filter').keyup(function(){
        var filter = $(this).val(),
            filterType = $(this).data('filter'),
            filterList = monsterList,
            filterId = '#monsterList',
            filteredObj = {};
        if( filter.length >= 3){
            $.each(filterList, function(index, element){
                if( element[filterType].toLowerCase().includes(filter.toLowerCase()) ){
                    filteredObj[index] = element;
                }
            });
            updateFilterList(filteredObj, filterId);
        }else{
            updateFilterList(filterList, filterId);
        }
    });
    domElems.monsterul.on('click', 'li', function(evt){
        window.open('./print.html?id='+$(this).data('id'));
    });
});