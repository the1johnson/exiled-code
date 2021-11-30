function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(function() {
    var monsterid = getParameterByName('id'),
        statHolder = $('#monsterStats'),
        monsterStats = {},
        placeStats = function(){
            $.each(monsterStats, function(index,val){
                console.log(index)
                console.log(val)
                $('#'+index).html(val);
            });
        },
        getMonster = function(id){
            $.ajax({
                url:'./scripts/getMonsterStats.php',
                data: {id:id},
                method: "POST",
            }).done(function(data){
        
                monsterStats = $.parseJSON(data)[0];
                placeStats();
            }).fail(function(jqXHR, textStatus){});
        };
    
    getMonster(monsterid);
});