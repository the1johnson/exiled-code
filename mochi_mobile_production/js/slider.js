/*$(function(){
    mySwipe = new Swipe(document.getElementById('slider'), {
      speed: 400,
      auto: 3000,
      continuous: true,
      disableScroll: false,
      stopPropagation: false,
      callback: function(index, elem) {},
      transitionEnd: function(index, elem) {}
    });
    devSwipe = new Swipe(document.getElementById('dev-slider'), {
      speed: 400,
      continuous: true,
      disableScroll: false,
      stopPropagation: false,
      callback: function(index, elem) {},
      transitionEnd: function(index, elem) {}
    });
    setTimeout(function() {
        devSwipe.setup();
    }, 10);
    $('#slider-prev').click(function(e){
        e.preventDefault();
        mySwipe.prev();
    });
    $('#slider-next').click(function(e){
        e.preventDefault();
        mySwipe.next();
    });
    
    $('#dev-swipe-next').click(function(e){
        e.preventDefault();
        devSwipe.next();
    });
    $('#dev-swipe-prev').click(function(e){
        e.preventDefault();
        devSwipe.prev();
    });
    
    var header = $('.swipe-wrap h2')[0];
    var hHeight = $(header).outerHeight();
    
    $('.swipe-nav a').width(hHeight-3);
    $('.swipe-nav').css('bottom', -1*hHeight);
});*/