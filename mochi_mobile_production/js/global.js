function scrollToAnchor(aid){
    var aTag = $("a[name='"+ aid +"']");
    $('html,body').animate({scrollTop: aTag.offset().top},'fast');
}

$(function(){
    FastClick.attach(document.body);
    //NAVBAR STUFF
    $('#nav-bar').slideUp();
    $('#drop-nav').click(function(e){
       e.preventDefault();
       $('.prod, #registration, #contact-info, #team-info, #jobs').slideUp();
       $('#nav-bar').slideToggle({queue: false});
    });
    //NAVR BAR STUFF END
    
    //slider stuff
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
    pubSwipe = new Swipe(document.getElementById('pub-slider'), {
      speed: 400,
      continuous: true,
      disableScroll: false,
      stopPropagation: false,
      callback: function(index, elem) {},
      transitionEnd: function(index, elem) {}
    });
    advSwipe = new Swipe(document.getElementById('adv-slider'), {
      speed: 400,
      continuous: true,
      disableScroll: false,
      stopPropagation: false,
      callback: function(index, elem) {},
      transitionEnd: function(index, elem) {}
    });
    adsSwipe = new Swipe(document.getElementById('ads-slider'), {
      speed: 400,
      continuous: true,
      disableScroll: false,
      stopPropagation: false,
      callback: function(index, elem) {},
      transitionEnd: function(index, elem) {}
    });
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
    
    $('#pub-swipe-next').click(function(e){
        e.preventDefault();
        pubSwipe.next();
    });
    $('#pub-swipe-prev').click(function(e){
        e.preventDefault();
        pubSwipe.prev();
    });
    
    $('#adv-swipe-next').click(function(e){
        e.preventDefault();
        advSwipe.next();
    });
    $('#adv-swipe-prev').click(function(e){
        e.preventDefault();
        advSwipe.prev();
    });
    
    $('#ads-swipe-next').click(function(e){
           e.preventDefault();
           adsSwipe.next();
       });
       $('#ads-swipe-prev').click(function(e){
           e.preventDefault();
           adsSwipe.prev();
       });
    
    var header = $('.swipe-wrap h2')[0];
    var hHeight = $(header).outerHeight();
    
    $('.swipe-nav a').width(hHeight-2);
    $('#pub-prod .swipe-nav, #dev-prod .swipe-nav').css('bottom', -1*hHeight);
    //slider stuff OVER!!1
       
    $('.social-hooks li a').each(function(){
        var obj = $(this).find('img')[0],
            img_size = 0;
        $(obj).load(function(){
            img_size = $(obj).width() - 5;
            $(this).parent().width(img_size);
        });
    });
    
    $('.act').removeClass('act');
    
    $('.prod').slideUp(0, function(){
        $('.prod').addClass('loaded');
    });
    $('.prod-link').click(function(e){
        e.preventDefault();
        if($(this).siblings('.prod').css('display') == 'block')
        {
            $(this).siblings('.prod').slideUp();
            return ;
        }
        $('#nav-bar, .prod, #registration, #contact-info, #team-info, #jobs').slideUp();
        $(this).siblings('.prod').slideToggle(400, function(){
            if($(this).attr('id') == 'dev-prod')
            {
                setTimeout(function() {
                    devSwipe.setup();
                }, 10);
                scrollToAnchor('dev-anchor');
            }
            else if($(this).attr('id') == 'pub-prod')
            {
                setTimeout(function() {
                    pubSwipe.setup();
                }, 10);
                scrollToAnchor('pub-anchor');
            }
            else if($(this).attr('id') == 'adv-prod')
            {
                setTimeout(function() {
                    advSwipe.setup();
                }, 10);
                scrollToAnchor('adv-anchor');
            }
        });
    });
    
    $('.info').slideUp();
    $('.info-link').click(function(e){
        e.preventDefault();
        $('.act').removeClass('act');
        if($(this).siblings('.info').css('display') != 'block'){
            $('.info').slideUp();
        }
        $(this).addClass('act');
        $(this).siblings('.info').slideToggle();
    });

    // if user not login
    $.ajax('/login/mobile_urls')
    .done(function(urls) {
        $('#registration').attr('action', urls.register);
        $('#host').val(urls.host);
    })
    .fail(function() {
            // handle errors here
    });

    $('#to-top').click(function(e){
        e.preventDefault();
        $("html, body").animate({ scrollTop: 0 }, "fast");
    });
    
    $('#contact-info, #team-info, #registration, #jobs').slideUp(0);
    
    $('#signup-now').click(function(e){
        e.preventDefault();
        $('#nav-bar, .prod, #contact-info, #team-info, #jobs').slideUp();
        $('#registration').slideToggle('fast');
    });
    
    $('#foot-contact').click(function(e){
        e.preventDefault();
        $('#nav-bar, .prod, #registration, #team-info, #jobs').slideUp();
        $('#contact-info').slideToggle();
    });
    
    $('#foot-team').click(function(e){
        e.preventDefault();
        $('#nav-bar, .prod, #registration, #contact-info, #jobs').slideUp();
        $('#team-info').slideToggle();
    });
    
    $('#foot-jobs').click(function(e){
        e.preventDefault();
        $('#nav-bar, .prod, #registration, #contact-info, #team-info').slideUp();
        $('#jobs').slideToggle();
    });
    
    $('#nav-signup').click(function(e){
        e.preventDefault();
        $('#registration').slideDown(0);
        $('#nav-bar').slideUp('fast', function(){
            scrollToAnchor('signup-anchor');
        });
    });
    
    $('#reg-next-slide').click(function(){
        if($(this).hasClass('deactivated')){
            return ;
        }
        var slideWidth = $('.reg-slide').outerWidth();
        $('.reg-wrapper').animate({right: slideWidth}, 'fast');
    });
    
    $('.textbox').change(function(){
        var alias = $('#alias').val(),
            email = $('#email').val(),
            realName = $('#name').val(),
            password = $('#password').val(),
            password2 = $('#password2').val(),
            aliasCheck = false,
            emailCheck = false,
            realNameCheck = false,
            passwordCheck = false;
            
        if(alias.length > 0)
        {
            aliasCheck =  /^[a-zA-Z0-9-_]+$/.test(alias);
            if(!aliasCheck)
            {
                $('#alias').addClass('error');
            }
            else if(aliasCheck && $('#alias').hasClass('error'))
            {
                $('#alias').removeClass('error');
            }
        }
        
        if(email.length > 0){
            emailCheck = /.+@.+\..+/i.test(email);
            if(!emailCheck)
            {
                $('#email').addClass('error');
            }
            else if(emailCheck && $('#email').hasClass('error'))
            {
                $('#email').removeClass('error');
            }
        }
        
        if(realName.length > 0)
        {
            realNameCheck = true;
        }
        else
        {
            realNameCheck = false;
        }
        
        if(password.length > 0 && password2.length > 0)
        {
            if(password != password2)
            {
                passwordCheck = false;
                $('#password, #password2').addClass('error');
            }
            else if(password == password2)
            {
                passwordCheck = true;
                if($('#password').hasClass('error')){
                    $('#password, #password2').removeClass('error');
                }
            }
        }
        //if the form is filled out correctly activate next. 
        //if it is changed after being filled out correctly and it is incorrect deactivate next
        if(aliasCheck && emailCheck && realNameCheck && passwordCheck)
        {
            $('#reg-next-slide').removeClass('deactivated');
        }
        else if(!aliasCheck && !emailCheck && !realNameCheck && !passwordCheck && !$('#reg-next-slide').hasClass('deactivated'))
        {
            $('#reg-next-slide').addClass('deactivated');
        }
        console.log('alias: '+aliasCheck+' email: '+emailCheck+' real name: '+realNameCheck+' password: '+passwordCheck)
    });
});
