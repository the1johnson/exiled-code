var contactHandler = function(){
    var domElems = { firsNameInput:null, lastNameInput:null, emailInput:null, phoneInput:null, messageInput:null, container:null, contactPre:null, contactPost:null, alerts:null },
        util = { i:0, k:0 },
        scripts = { supportEmail:'assets/php/scripts/supportEmail.php' },
        errorInfo = { count:0, list:[] },
        checkFormErrors = function(){
            var alerts = '<div class="alert alertDanger"><div class="alertIcon"></div><div class="alertMsg">',
                firstName = domElems.firsNameInput.value,
                lastName = domElems.lastNameInput.value,
                email = domElems.emailInput.value,
                message = domElems.messageInput.value,
                comma = '';
                
            errorInfo.list = [];
            errorInfo.count = 0;
            domElems.alerts.innerHTML = '';
            
            if( firstName.length < 2 ){
                errorInfo.count++;
                errorInfo.list.push( 'First Name' );
            }
            
            if( lastName.length < 2 ){
                errorInfo.count++;
                errorInfo.list.push( 'Last Name' );
            }
            
            if( email.length < 6 ){
                errorInfo.count++;
                errorInfo.list.push( 'Email Address' );
            }else if( email.match(/^\S+@\S+\.\S+$/) == null ){
                errorInfo.count++;
                errorInfo.list.push( 'Valid Email' );
            }
            
            if( message.length < 2 ){
                errorInfo.count++;
                errorInfo.list.push( 'Your Message' );
            }
            
            if( errorInfo.count > 0 ){
                alerts += 'Please fill out the '+errorInfo.count+' required fields: ';
                for( util.i = 0, util.k = errorInfo.list.length; util.i < util.k; util.i++ ){
                    alerts += comma+errorInfo.list[ util.i ];
                    comma = ', ';
                }
                alerts += '</div></div>';
                domElems.alerts.innerHTML = alerts;
                return true;
            }else{
                return false;
            }
        },
        sendMessage = function(){
            if( checkFormErrors() ){ return ; }
            var formData = new FormData(),
                ajax = new XMLHttpRequest();
                
            formData.append( 'firstName', domElems.firsNameInput.value );
            formData.append( 'lastName', domElems.lastNameInput.value );
            formData.append( 'email', domElems.emailInput.value );
            formData.append( 'phone', domElems.phoneInput.value );
            formData.append( 'message', domElems.messageInput.value );
            ajax.open( 'POST', scripts.supportEmail );
            ajax.onreadystatechange = function() {
                if( ajax.readyState == 4 && ajax.status == 200 ) {
                    domElems.contactPre.style.display = 'none';
                    domElems.contactPost.style.display = 'block';
                }
            }
            ajax.send( formData );
        },
        contClick = function( evt ){
            if (!evt.target.href) evt.preventDefault();
            var targ = evt.target,
                action = targ.dataset.action;
                
            if( action === 'sendMessage' ){
                sendMessage();
            }
        },
        init = function(){
            domElems.firsNameInput = document.querySelector( 'input[data-id="firstName"]' );
            domElems.lastNameInput = document.querySelector( 'input[data-id="lastName"]' );
            domElems.emailInput = document.querySelector( 'input[data-id="email"]' );
            domElems.phoneInput = document.querySelector( 'input[data-id="phone"]' );
            domElems.messageInput = document.querySelector( 'textarea[data-id="message"]' );
            domElems.container = document.getElementsByClassName( 'contactContent' )[ 0 ];
            domElems.alerts = document.getElementById( 'alerts' );
            domElems.contactPre = document.getElementById( 'contactPre' );
            domElems.contactPost = document.getElementById( 'contactPost' );
            
            domElems.container.addEventListener( eventTypes.click, contClick );
            if( isTouchDevice ){
                domElems.container.addEventListener( eventTypes.touchend, contClick );
            }
        };
    return{ init:init };
}();