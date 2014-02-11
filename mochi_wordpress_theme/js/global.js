var url = 'http://youtu.be/AL6Na4v8H_o',
    windowName = 'Terminated';
$(function()
{
    /*$('.dropdown').hover(function()
    {
        $(this).find('.dropdown-menu').first().slideDown({queue: false});
        $(this).find('a').first().addClass('hover');
    },*/
    var reset = new Konami(function() {window.open(url, windowName, "height=615,width=945");});
    /*function()
    {
        //$(this).find('.dropdown-menu').first().stop();
        $(this).find('.dropdown-menu').first().slideUp({duration: 200, queue: false});
        $(this).find('a').first().removeClass('hover');
    });*/
    $('#arch').click(function(e)
    {
        e.preventDefault();
        if($('#arch').hasClass('active'))
        {
            $('#arch').removeClass('active');
            $('#arch-drop').slideUp({duration: 200, queue: false, complete: function(){
                var sideHeight = $('#sidebar').outerHeight();
                $('#content').css('min-height', sideHeight);
            }});
        }
        else
        {
            $('#arch').addClass('active');
            $('#arch-drop').slideDown({duration: 200, queue: false, complete: function(){
                var sideHeight = $('#sidebar').outerHeight();
                $('#content').css('min-height', sideHeight);
            }});
        } 
    });
    $('#reset').click(function(){window.open(url, windowName, "height=615,width=945");});
});