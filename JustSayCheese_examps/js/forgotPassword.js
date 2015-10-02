var forgotPassHandler = function(){
    
    var domElems = { forgotPassContent:null, alertHolder:null, userIdInput:null },
        util = { i:0, k:0, returnData:null },
        errorInfo = { count:0, list:[] },
        scripts = { regNameCheck:'assets/php/scripts/regNameCheck.php', sendPasswordLink:'assets/php/scripts/sendPasswordLink.php' },
        checkErrors = function(){
            var alerts = '',
                ajax = new XMLHttpRequest(),
                formData = new FormData(),
                userId = domElems.userIdInput.value;
            errorInfo.list = [];
            errorInfo.count = 0;
            domElems.alertHolder.innerHTML = '';
            
            if( userId === '' ){
                errorInfo.count++;
                errorInfo.list.push( 'Please enter your Email or Username' );
            }else{
                formData.append( 'checkCol', 'email,nickname' );
                formData.append( 'checkVal', userId+','+userId );
                ajax.open( 'POST', scripts.regNameCheck, false );
                ajax.onreadystatechange = function() {
                    if( ajax.readyState == 4 && ajax.status == 200 ) {
                        util.returnData = parseInt( ajax.responseText );
                        if( util.returnData == 0 ){
                            errorInfo.count++;
                            errorInfo.list.push( 'No account found associated with that Email or Username' );
                        }
                    }
                }
                ajax.send( formData );
            }
            
            /* IF ERRORS SEND FALSE AND DISPLAY THEM AS ALERTS */
            if( errorInfo.count > 0 ){
                for( util.i = 0, util.k = errorInfo.list.length; util.i < util.k; util.i++ ){
                    alerts += '<div class="alert alertDanger"><div class="alertIcon"></div><div class="alertMsg">'+errorInfo.list[ util.i ]+'</div></div>';
                }
                domElems.alertHolder.innerHTML = alerts;
                return true;
            }else{
                return false;
            }
            
        },
        sendPasswordLink = function(){
            var ajax = new XMLHttpRequest(),
                formData = new FormData(),
                userId = domElems.userIdInput.value;
                
            formData.append( 'uID', userId );
            ajax.open( 'POST', scripts.sendPasswordLink );
            ajax.onreadystatechange = function() {
                if( ajax.readyState == 4 && ajax.status == 200 ) {
                    domElems.alertHolder.innerHTML = '<div class="alert alertSuccess"><div class="alertIcon"></div><div class="alertMsg">A verification link has been emailed to you.</div></div>';
                }
            }
            ajax.send( formData );
        },
        contClick = function( evt ){
            if (!evt.target.href) evt.preventDefault();
            var targ = evt.target,
                action = targ.dataset.action;
                
            if( action === 'passRecover' && !checkErrors() ){
                sendPasswordLink();
            }
        },
        init = function(){
            domElems.forgotPassContent = document.getElementsByClassName( 'forgotPassContent' )[ 0 ];
            domElems.alertHolder = document.getElementById( 'alerts' );
            domElems.userIdInput = document.querySelector( '.loginInput[data-id="userID"]' );
            
            domElems.forgotPassContent.addEventListener( eventTypes.click, contClick );
            if( isTouchDevice ){
                domElems.forgotPassContent.addEventListener( eventTypes.touchend, contClick );
            }
        };
    
    return{ init:init };
}();