var eventTypes = { click:'click', mouseDown:'mousedown', mouseUp:'mouseup', mouseMove:'mousemove', mouseEnter:'mouseenter', mouseLeave:'mouseleave', keyDown:'keydown', keyUp:'keyup', progress:'progress', dragover:'dragover', dragenter:'dragenter', dragleave:'dragleave', drop:'drop', change:'change', resize:'resize', blur:'blur', touchstart:'touchstart', touchend:'touchend', touchmove:'touchmove' },
    animOpts = { ease:'Quad.easeInOut', speed:0.3, timeoutID:null },
    scripts = { deleteCartItem:'assets/php/scripts/deleteCartItem.php', updateCaption:"assets/php/scripts/updateCart.php", setTouchSession:"assets/php/scripts/setTouchSession.php", promoValidate:"assets/php/scripts/promoInsert.php", newsletterOptin:"assets/php/scripts/newsletterOptin.php" },
    isTouchDevice = false,
    modalHandler = function(){
        var activeModal = { 'id':null, 'elem':null },
            isActive = 0,
            activeModalDom = null,
            util = { 'i':0 },
            showModal = function( modalID, modalContent ){
                /* add modal id and elem to object */
                activeModal.id = modalID;
                activeModal.elem = document.querySelector( '.modal[data-modalid="'+modalID+'"]' );
            
                /* add content elem to ver */
                var modalContentDom = activeModal.elem.getElementsByClassName('modalContent')[0];
            
                /* set content and show */
                modalContentDom.innerHTML = modalContent;
            
                activeModal.elem.style.display = 'block';
                activeModal.elem.style.opacity = '0.0';
                TweenLite.to( activeModal.elem, animOpts.speed, { opacity:'1', ease:animOpts.ease } );
                isActive = 1;
            },
            hideModal = function(){
                /* hide then remove style */
                TweenLite.to( activeModal.elem, animOpts.speed, { opacity:'0.0', ease:animOpts.ease, onComplete:function(){
                    activeModal.elem.removeAttribute( 'style' );
                    isActive = 0;
                } } );
            },
            isActiveCheck = function(){
                return isActive;
            },
            updateModal = function( modalID, modalContent ){
                var targModal = document.querySelector( '.modal[data-modalid="'+modalID+'"]' ),
                    modalContentDom = targModal.getElementsByClassName('modalContent')[0];
                modalContentDom.innerHTML = modalContent;
            },
            init = function(){
                /* add hide function to modal bgs and close btn */
                var modalBGs = document.getElementsByClassName('modalBg'),
                    modalCloseBtns = document.getElementsByClassName('modalClose'),
                    modalCount = modalBGs.length;
                
                for(util.i = 0; util.i<modalCount; util.i++){
                    modalBGs[ util.i ].addEventListener(eventTypes.click, hideModal);
                    modalCloseBtns[ util.i ].addEventListener(eventTypes.click, hideModal);
                    if( isTouchDevice ){
                        //modalBGs[ util.i ].addEventListener(eventTypes.touchend, hideModal);
                        modalCloseBtns[ util.i ].addEventListener(eventTypes.touchend, hideModal);
                    }
                }
            };
        return { init:init, showModal:showModal, hideModal:hideModal, updateModal:updateModal, isActiveCheck:isActiveCheck };
    }(),
    uiHandler = function(){
        var uiElems = { cartBtn:null, cartInfo:null, rotator:null, rotatorWrap:null, slides:null, menuBtn:null, containerMain:null, sideMenu:null, helpBtns:null, newsletterOpt:null },
            util = { i:0, k:0, currSlide:0, timeoutID:null, intervalTimer:5500, helpActive:0 },
            cartHoverShow = function( evt ){
                evt.preventDefault();
                var showing = parseInt( uiElems.cartInfo.dataset.showing );
                if( animOpts.timeoutID ){
                    window.clearTimeout( animOpts.timeoutID );
                }
                if( uiElems.cartBtn.dataset.status === 'empty' || showing ){ return ; }
                
                uiElems.cartInfo.style.display = 'block';
                uiElems.cartInfo.dataset.showing = '1';
                TweenLite.to( uiElems.cartInfo, animOpts.speed, { opacity:'1', top:'72', ease:animOpts.ease } );
            },
            hideCartInfo = function(){
                var showing = parseInt( uiElems.cartInfo.dataset.showing );
                
                if( showing ){
                    uiElems.cartInfo.dataset.showing = '0';
                    TweenLite.to( uiElems.cartInfo, animOpts.speed, { opacity:'0.0', top:'105', ease:animOpts.ease, onComplete:function(){
                        uiElems.cartInfo.style.display = 'none';
                        animOpts.timeoutID = null;
                    } } );
                }
            },
            cartHoverHide = function( evt ){
                evt.preventDefault();
                if( uiElems.cartBtn.dataset.status === 'empty' ){ return ; }
                animOpts.timeoutID = window.setTimeout(hideCartInfo, 300);
            },
            cartBtnClick = function( evt ){
                evt.preventDefault();
                var targ = evt.target,
                    action = targ.dataset.action;
                if( action === 'viewCart' ){
                    utilFunct.viewCart();
                }else if( action === 'deleteItem' ){
                    utilFunct.deleteCartItem( targ );
                }else if( action === 'checkout' ){
                    utilFunct.startCheckout();
                }
            },
            rotatorSize = function(){
                var rotatorWidth = uiElems.rotator.offsetWidth;
                
                for( util.i = 0, util.k = uiElems.slides.length; util.i<util.k; util.i++ ){
                    uiElems.slides[ util.i ].style.width = rotatorWidth+'px';
                }
                uiElems.rotatorWrap.style.width = rotatorWidth * uiElems.slides.length+'px';
            },
            rotatorInit = function(){
                var pagger = document.querySelector( '#rotatorPaging .pagingWrapper' ),
                    html = '',
                    btnActive = ' active';
                rotatorSize();
                for( util.i = 0, util.k = uiElems.slides.length; util.i<util.k; util.i++ ){
                    html += '<div class="rotatorSelector'+btnActive+'" data-action="chooseSlide" data-id="'+util.i+'"></div>';
                    btnActive = '';
                }
                pagger.innerHTML = html;
            },
            rotatorGoToSlide = function( targSlideID ){
                var slideWidth = uiElems.rotator.offsetWidth,
                    leftVal = (slideWidth*targSlideID)*-1,
                    activeSlide = document.querySelector( '.rotatorSelector.active' ),
                    targSlide = document.querySelector( '.rotatorSelector[data-id="'+targSlideID+'"]' );
                util.currSlide = parseInt( targSlideID );
                TweenLite.to( uiElems.rotatorWrap, animOpts.speed, { left:leftVal, ease:animOpts.ease } );
                activeSlide.className = activeSlide.className.replace(/\bactive\b/,'');
                targSlide.className = targSlide.className+' active';
            },
            rotatorClick = function( evt ){
                evt.preventDefault();
                var targ = evt.target,
                    action = targ.dataset.action;
                if( action === 'chooseSlide' ){
                    rotatorGoToSlide( targ.dataset.id );
                    clearInterval( util.timeoutID );
                    util.timeoutID = window.setInterval( rotatorTimer, util.intervalTimer );
                }else if( action === 'toUrl' ){
                    window.location.href = targ.dataset.url;
                } 
            },
            rotatorTimer = function( evt ){
                util.currSlide++;
                if( util.currSlide === uiElems.slides.length ){ util.currSlide = 0; }
                rotatorGoToSlide( util.currSlide );
            },
            toggleSideMenu = function( evt ){
                evt.preventDefault();
                var targ = evt.target,
                    showing = parseInt( uiElems.sideMenu.dataset.showing );
                if( showing ){
                    TweenLite.to( uiElems.sideMenu, animOpts.speed, { width:'0px', ease:animOpts.ease } );
                    TweenLite.to( uiElems.containerMain, animOpts.speed, { left:'0px', ease:animOpts.ease } );
                    uiElems.sideMenu.dataset.showing = '0';
                    targ.className = targ.className.replace(/\bactive\b/,'')
                }else{
                    TweenLite.to( uiElems.sideMenu, animOpts.speed, { width:'250px', ease:animOpts.ease } );
                    TweenLite.to( uiElems.containerMain, animOpts.speed, { left:'-250px', ease:animOpts.ease } );
                    uiElems.sideMenu.dataset.showing = '1';
                    targ.className = targ.className+' active';
                }
            },
            helpTxtShow = function( evt ){
                if( util.helpActive ){ helpTxtClose(); }
                evt.preventDefault();
                var targ = evt.target,
                    helpTxt = targ.dataset.helptxt,
                    position = utilFunct.getElemOffset( targ ),
                    leftRmv = ( isTouchDevice ) ? 170 : 0,
                    isImg = (targ.dataset.isimg === '1') ? 1 : 0;
                    
                if( targ.dataset.rightfloat === '1' ){
                    leftRmv += 430;
                }
                uiElems.helpContainer.innerHTML = '<div class="helpArrow"></div>'+helpTxt;
                uiElems.helpContainer.style.top = (position.top+30)+'px';
                uiElems.helpContainer.style.left = (position.left - leftRmv)+'px';
                uiElems.helpContainer.style.display = 'block';
                uiElems.helpContainer.dataset.isimg = isImg;
                
                TweenLite.to( uiElems.helpContainer, animOpts.speed, { opacity:'1', top:position.top+20, ease:animOpts.ease } );
                util.helpActive = 1;
            },
            helpTxtClose = function(){
                uiElems.helpContainer.style.display = 'none';
                uiElems.helpContainer.style.opacity = '0.0';
                util.helpActive = 0;
            },
            helpTxtHide = function( evt ){
                if( !util.helpActive ){ return ; }
                evt.preventDefault();
                var targ = evt.target,
                    topPos = parseInt( uiElems.helpContainer.style.top )+10;
                    TweenLite.to( uiElems.helpContainer, animOpts.speed, { opacity:'0.0', top:topPos, ease:animOpts.ease, onComplete:function(){
                        uiElems.helpContainer.style.display = 'none';
                        util.helpActive = 0;
                    } } );
            },
            newsletterKeyup = function( evt ){
                var returnCode = 13,
                    key = evt.keyCode || evt.which,
                    emailAddr = uiElems.newsletterOpt.value,
                    ajax = new XMLHttpRequest(),
                    formData = new FormData();
                    
                if( key == returnCode && emailAddr.match(/^\S+@\S+\.\S+$/) !== null ){
                    formData.append( 'emailAddr', emailAddr );
                    ajax.open( 'POST', scripts.newsletterOptin );
                    ajax.onreadystatechange = function() {
                        if( ajax.readyState == 4 && ajax.status == 200 ) {
                            //email sent
                            uiElems.newsletterOpt.value = 'Thank you! Email Added.';
                        }
                    }
                    ajax.send( formData );
                }
            },
            ieVersion = function() {
                var ie = (function() { 
                    if (document.documentMode) {
                        return document.documentMode;
                    } else {
                        for (var i = 7; i > 0; i--) {
                            var div = document.createElement("div");
                            div.innerHTML = "<!--[if IE " + i + "]><span></span><![endif]-->";
                            if (div.getElementsByTagName("span").length) {
                                return i;
                            }
                        }
                    }
                    return undefined;
                })();
                //console.log('*'+ie);
                if (ie < 11) {window.location.href='./?pg=unsupported';}
            },
            init = function( uiOpts ){
                
                ieVersion();
                
                isTouchDevice = utilFunct.touchDeviceCheck();
                
                if( !uiOpts.touchSessionSet ){
                    var ajax = new XMLHttpRequest(),
                        formData = new FormData();
                    formData.append( 'isTouchDevice', isTouchDevice );
                    ajax.open( 'POST', scripts.setTouchSession );
                    ajax.onreadystatechange = function() {
                        if( ajax.readyState == 4 && ajax.status == 200 ) {
                        }
                    }
                    ajax.send( formData );
                }
                
                if( isTouchDevice ){
                    /*eventTypes.click = 'touchend';
                    eventTypes.mouseDown = 'touchstart';
                    eventTypes.mouseUp = 'touchend';
                    eventTypes.mouseMove = 'toughmove';
                    eventTypes.mouseEnter = 'touchstart';
                    eventTypes.mouseLeave = 'touchend';*/
                }
                
                uiElems.cartBtn = document.getElementById( 'cartBtn' );
                uiElems.cartInfo = document.getElementById( 'cartInfo' );
                uiElems.rotator = document.getElementById( 'rotator' );
                uiElems.containerMain = document.getElementById( 'containerMain' );
                uiElems.sideMenu = document.getElementById( 'sideMenu' );
                uiElems.menuBtn = document.getElementById( 'menuBtn' );
                uiElems.helpBtns = document.getElementsByClassName( 'sectionHelp' );
                uiElems.helpContainer = document.getElementById( 'helpContainer' );
                uiElems.newsletterOpt = document.getElementById( 'newsletterOpt' );
            
                uiElems.cartBtn.addEventListener( eventTypes.mouseEnter, cartHoverShow );
                uiElems.cartBtn.addEventListener( eventTypes.mouseLeave, cartHoverHide );
                uiElems.cartBtn.addEventListener( eventTypes.click, cartBtnClick );
                uiElems.menuBtn.addEventListener( eventTypes.click, toggleSideMenu );
                uiElems.newsletterOpt.addEventListener( eventTypes.keyUp, newsletterKeyup );
                
                if( isTouchDevice ){
                    uiElems.cartBtn.addEventListener( eventTypes.touchstart, cartHoverShow );
                    uiElems.cartBtn.addEventListener( eventTypes.touchend, cartHoverHide );
                    uiElems.cartBtn.addEventListener( eventTypes.touchend, cartBtnClick );
                    uiElems.menuBtn.addEventListener( eventTypes.touchend, toggleSideMenu );
                }
                
                for( util.i = 0, util.k = uiElems.helpBtns.length; util.i<util.k; util.i++ ){
                    uiElems.helpBtns[ util.i ].addEventListener( eventTypes.mouseEnter, helpTxtShow );
                    uiElems.helpBtns[ util.i ].addEventListener( eventTypes.mouseLeave, helpTxtHide );
                    if( isTouchDevice ){
                        uiElems.helpBtns[ util.i ].addEventListener( eventTypes.touchend, helpTxtShow );
                        uiElems.helpBtns[ util.i ].addEventListener( eventTypes.touchend, helpTxtHide );
                    }
                }
                
                if( uiElems.rotator ){
                    uiElems.slides = document.getElementsByClassName( 'slide' );
                    uiElems.rotatorWrap = document.getElementById( 'rotatorWrap' );
                    rotatorInit();
                    window.addEventListener( eventTypes.resize, rotatorSize );
                    uiElems.rotator.addEventListener( eventTypes.click, rotatorClick );
                    if( isTouchDevice ){
                        uiElems.rotator.addEventListener( eventTypes.touchend, rotatorClick );
                    }
                    util.timeoutID = window.setInterval( rotatorTimer, util.intervalTimer );
                } 
                uiElems.continueShopping = document.querySelector( '#cartInfo .button[data-action="continueShop"]');
                uiElems.continueShopping.addEventListener( eventTypes.click, function(){ window.location.href = './?pg=order'; });
                if( isTouchDevice ){
                    uiElems.continueShopping.addEventListener( eventTypes.touchend, function(){ window.location.href = './?pg=order'; });
                }
            };
        return{ init:init };
    }(),
    utilFunct = function(){
        var util = { i:0, k:0 },
        getUrlParam = function( name ){
            return decodeURIComponent( ( new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)' ).exec( location.search )||[ ,"" ] )[ 1 ].replace( /\+/g, '%20' ) )||null
        },
        parentUntilClass = function( el, targClass ){
            var regEx = new RegExp( targClass );
            while(el.parentNode){
                el = el.parentNode;
                if( el.className.match(regEx) ){
                    return el;
                }
            }
            return null;
        },
        getInputVals = function( inputSelector ){
            var data = {},
                inputs = document.querySelectorAll( inputSelector ),
                key = null,
                val = null;
                
            for( util.i = 0, util.k = inputs.length; util.i<util.k; util.i++ ){
                key = inputs[ util.i ].dataset.id;
                val = inputs[ util.i ].value;
                
                data[ key ] = val;

            }
        },
        getInputVals = function( inputSelector ){
            var data = {},
                inputs = document.querySelectorAll( inputSelector ),
                key = null,
                val = null;
                
            for( util.i = 0, util.k = inputs.length; util.i<util.k; util.i++ ){
                key = inputs[ util.i ].dataset.id;
                val = inputs[ util.i ].value;
                //patch for shipping info (not input fields) :
                if (( key === 'orderTotalSH' ) || ( key == 'shipMethod' )) {val = inputs[ util.i ].innerHTML;} 
                data[ key ] = val;
            }
            return data;
        },
        deleteCartItem = function( targ, cart ){
            var itemID = targ.dataset.id,
                dontDelete = targ.parentNode.innerHTML,
                deleteOption = targ.parentNode;
            
            deleteOption.innerHTML = (cart) ? '<div class="deleteCartInCart"><h2>Are you sure?</h2><div class="button dark bRadSM" data-action="delete">Yes</div><div class="button dark bRadSM" data-action="cancel">No</div></div>' :'<div class="deleteCartContent"><h2>Are you sure you want to remove this cart item?</h2><div class="modalBtns"><div class="button dark modalBtn bRadSM" data-action="delete">Yes, delete.</div><div class="button dark modalBtn bRadSM" data-action="cancel">Cancel</div></div></div>'
                                   + '<div class="fadeToBg">' + dontDelete + '</div>';
            deleteOption.addEventListener( eventTypes.click, function( evt ){
                evt.preventDefault();
                var targ = evt.target,
                    action = targ.dataset.action;
                if( action === 'delete' ){
                    var formData = new FormData(),
                    ajax = new XMLHttpRequest();
                
                    formData.append( 'itemID', itemID );
                    ajax.open( 'POST', scripts.deleteCartItem );
                    ajax.onreadystatechange = function() {
                        if( ajax.readyState == 4 && ajax.status == 200 ) {
                            location.reload();
                        }
                    }
                    ajax.send( formData );
                } else if ( action === 'cancel' ) {
                    deleteOption.innerHTML = dontDelete;
                }
            });
            if( isTouchDevice ){
                deleteOption.addEventListener( eventTypes.touchend, function( evt ){
                    evt.preventDefault();
                    var targ = evt.target,
                        action = targ.dataset.action;
                    if( action === 'delete' ){
                        var formData = new FormData(),
                        ajax = new XMLHttpRequest();
                
                        formData.append( 'itemID', itemID );
                        ajax.open( 'POST', scripts.deleteCartItem );
                        ajax.onreadystatechange = function() {
                            if( ajax.readyState == 4 && ajax.status == 200 ) {
                                location.reload();
                            }
                        }
                        ajax.send( formData );
                    } else if ( action === 'cancel' ) {
                        deleteOption.innerHTML = dontDelete;
                    }
                });
            }
        },
        viewCart = function(){
            window.location.href = './?pg=viewCart';
        },
        startCheckout = function(bypass){
            var page = './?pg=checkout';//used to handle seperate free checkout page
            window.location.href = page;
        },
        update = function( data, refresh ) {
            var ajax = new XMLHttpRequest();
            ajax.open( 'POST', scripts.updateCaption);
            ajax.onreadystatechange = function() {
                if( ajax.readyState == 4 && ajax.status == 200 ) {
                    if(refresh){ document.location.reload(); }
                } else {
                    return ('err');
                }
            };
            ajax.send( data );
        },
        getElemOffset = function( element ){
            var body = document.body,
                win = document.defaultView,
                docElem = document.documentElement,
                box = document.createElement( 'div' );
            box.style.paddingLeft = box.style.width = "1px";
            body.appendChild( box );
            var isBoxModel = box.offsetWidth == 2;
            body.removeChild( box );
            box = element.getBoundingClientRect();
            var clientTop  = docElem.clientTop  || body.clientTop  || 0,
                clientLeft = docElem.clientLeft || body.clientLeft || 0,
                scrollTop  = win.pageYOffset || isBoxModel && docElem.scrollTop  || body.scrollTop,
                scrollLeft = win.pageXOffset || isBoxModel && docElem.scrollLeft || body.scrollLeft;
            return { top : box.top  + scrollTop  - clientTop, left: box.left + scrollLeft - clientLeft };
        },
        toggleRemember = function( evt ) {
            evt.preventDefault();
            var targ = evt.target;
            if ( targ.className.indexOf( 'active' ) !== -1) {
                targ.className = targ.className.replace(/active/, '' );
            } else {
                targ.className = targ.className+' active';
            }
        },
        handlePromo = function() {
            var promoCode = document.querySelector( 'input.promoCode' ).value;
            var formData = new FormData(),
                ajax = new XMLHttpRequest()
            formData.append( 'promoCode', promoCode );
            ajax.open( 'POST', scripts.promoValidate );
            ajax.onreadystatechange = function() {
                if( ajax.readyState == 4 && ajax.status == 200 ) {
                    var res = ajax.responseText;
                    if (res.charAt(0) === '&') {
                        handlePromoErr(res);
                    } else {
                        window.location.href = './?pg=viewCart';
                    }
                }
            }
            ajax.send( formData );
        },
        handlePromoErr = function ( err ) {
            var alertHolder = document.getElementById( 'alerts' );
            var alerts = '';
                if (err === '&invalid') {
                    alerts += '<div class="alert alertDanger"><div class="alertIcon"></div><div class="alertMsg">Sorry, that promo code is not valid</div></div>';
                } else if (err === '&used') {
                    alerts += '<div class="alert alertDanger"><div class="alertIcon"></div><div class="alertMsg">Sorry, you have already used that promo code</div></div>';
                } else if (err === '&expired') {
                    alerts += '<div class="alert alertDanger"><div class="alertIcon"></div><div class="alertMsg">Unfortunately, this promo code is no longer valid. However, our deal to buy 2 and get 1 of the same size free is on-going and is a great deal. Thanks for your business!</div></div>';
                } else {
                    alerts += '<div class="alert alertDanger"><div class="alertIcon"></div><div class="alertMsg">Oops! Something went wrong</div></div>';
                }
                alertHolder.innerHTML = alerts;
        },
        touchDeviceCheck = function(){
            var check = ( ( 'ontouchstart' in window ) || ( navigator.MaxTouchPoints > 0 ) || ( navigator.msMaxTouchPoints > 0 ) );
            return check;
        },
        shuffleArray = function (o){
            for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        };
        return{ getUrlParam:getUrlParam, parentUntilClass:parentUntilClass, viewCart:viewCart, deleteCartItem:deleteCartItem, startCheckout:startCheckout, getInputVals:getInputVals, update:update, getElemOffset:getElemOffset, toggleRemember:toggleRemember, handlePromo:handlePromo, touchDeviceCheck:touchDeviceCheck, shuffleArray:shuffleArray };

    }();