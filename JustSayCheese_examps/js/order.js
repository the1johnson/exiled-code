var orderTool = function(){
    var canvasInfo = { type:null, size:'10x10', orient:'horiz', price:0.00, caption:'', borderStyle:'wrap' },
        util = { activeStep:'1', activeProcess:null, i:0, k:0, uploadsDir:'./uploads/', returnData:null, sub1024res:false, verticalOrientation:false, cartEdit:0 },
        domElems = { orderContent:null, activeEditor:null, activeCaption:null, activeRoomview:null, activeSizeList:null, activeModifyList:null, editCanvasBtn:null, closeEditCanvasBtn:null, smallEditBtn:null },
        scripts = { toCart:'assets/php/scripts/addItemToCart.php' },
        goToProcess = function( targProcess ){
            var currentProcessDOM = document.querySelector( '.orderProcess[data-process="'+util.activeProcess+'"]' ),
                targProcessDOM = document.querySelector( '.orderProcess[data-process="'+targProcess+'"]' ),
                targDOMsizeBtn = targProcessDOM.getElementsByClassName( 'sizeBtn' )[ 0 ];
                
            currentProcessDOM.style.display = 'none';
            targProcessDOM.style.display = 'block';
            util.activeProcess = targProcess;
            //targDOMsizeBtn.click();
            domElems.activeEditor = document.querySelector( '.orderProcess[data-process="'+util.activeProcess+'"] .canvasEditor' );
            domElems.editCanvasBtn = document.querySelector( '.orderProcess[data-process="'+util.activeProcess+'"] .editCanvas' );
            domElems.activeCaption = document.querySelector( '.orderProcess[data-process="'+util.activeProcess+'"] .captionHolder' );
            domElems.activeRoomview = document.querySelector( '.orderProcess[data-process="'+util.activeProcess+'"] .roomView' );
            domElems.activeSizeList = document.querySelector( '.orderProcess[data-process="'+util.activeProcess+'"] .sizeListStep' );
            domElems.activeModifyList = document.querySelector( '.orderProcess[data-process="'+util.activeProcess+'"] .modifyModeStep' );
            if( util.activeProcess === 'singleCanvas' ){
                /* INTIT THE EDITING TOOLS */
                var zoomInBtn = document.querySelector( '.orderProcess[data-process="'+util.activeProcess+'"] .zoomBtn[data-action="zoomIn"]' ),
                    zoomOutBtn = document.querySelector( '.orderProcess[data-process="'+util.activeProcess+'"] .zoomBtn[data-action="zoomOut"]' ),
                    zoomSlider = document.querySelector( '.orderProcess[data-process="'+util.activeProcess+'"] .zoomBtn[data-action="zoomSlide"]' ),
                    rotateUp = document.querySelector( '.orderProcess[data-process="'+util.activeProcess+'"] .rotateBtn[data-action="rotateUp90"]' ),
                    rotateDwn = document.querySelector( '.orderProcess[data-process="'+util.activeProcess+'"] .rotateBtn[data-action="rotateDwn90"]' ),
                    rotateHalf = document.querySelector( '.orderProcess[data-process="'+util.activeProcess+'"] .rotateBtn[data-action="rotate180"]' ),
                    editOpts = { activeEditor:domElems.activeEditor, orientation:canvasInfo.orient, zoomInBtn:zoomInBtn, zoomOutBtn:zoomOutBtn, zoomSlider:zoomSlider, rotateUp:rotateUp, rotateDwn:rotateDwn, rotateHalf:rotateHalf };
                jscImageEditor.editToolInit( editOpts );
            }
        },
        addToCart = function(){
            var item = { edit:{} },
                formData = new FormData(),
                ajax = new XMLHttpRequest(),
                activeEditor = domElems.activeEditor,
                imgElem = activeEditor.querySelector( 'img' ),
                modalHTML = '<div class="cartWait"><h2>Adding To Cart</h2><p>You items are being processed. Please wait.</p><div class="loadingGif"></div></div>',
                rotateVal = ( imgElem.style.transform ) ? parseFloat (imgElem.style.transform.substring( 7 ) ) : 0;

            item.caption = canvasInfo.caption;
            item.size = canvasInfo.size;
            item.orientation = canvasInfo.orient;
            item.borderStyle = canvasInfo.borderStyle;
            item.imgSrc = jscImageEditor.imgUploaded.uploadSrc;
            item.uploadSrc = jscImageEditor.imgUploaded.source;
            item.price = canvasInfo.price;
            item.quantity = 1;
            item.sizeby = imgElem.dataset.sizeby;
            item.edit.posX = (imgElem.style.left) ? parseInt( imgElem.style.left ) : 0;
            item.edit.posY = (imgElem.style.top) ? parseInt( imgElem.style.top ) : 0;
            item.edit.editorSize = activeEditor.offsetWidth+'x'+activeEditor.offsetHeight;
            item.edit.scale = ( item.sizeby === 'width' ) ? parseFloat( imgElem.style.width ) : parseFloat( imgElem.style.height );
            item.edit.scale = ( item.edit.scale > 0 ) ? item.edit.scale : 100;
            item.edit.rotate = rotateVal;
            
            if( util.cartEdit ){
                item.cartEdit = util.cartEdit;
            }
            
            formData.append( 'cartItem', JSON.stringify(item) );
            ajax.open( 'POST', scripts.toCart );
            modalHandler.updateModal( 'default', modalHTML );
            ajax.onreadystatechange = function() {
                if( ajax.readyState == 4 && ajax.status == 200 ) {
                    util.returnData = ajax.responseText;
                    window.location.href = './?pg=viewCart';
                }
            }
            ajax.send( formData );
        },
        goToStep = function( targ ){
            var stepAttrTarg = targ.dataset.nextstep,
                activeTargs = document.querySelectorAll( '.orderProcess[data-process="'+util.activeProcess+'"] .orderStep[data-step="'+util.activeStep+'"]' ),
                stepTargs = document.querySelectorAll( '.orderProcess[data-process="'+util.activeProcess+'"] .orderStep[data-step="'+stepAttrTarg+'"]' ),
                currentBtn = document.querySelector( '.orderProcess[data-process="'+util.activeProcess+'"] .orderNavBtn.active' ),
                targBtn = document.querySelector( '.orderProcess[data-process="'+util.activeProcess+'"] .orderNavBtn[data-nextstep="'+stepAttrTarg+'"]' );
            /* HIDES ALL ACTIVE STEP DOM ELEMENTS */
            for( util.i=0, util.k = activeTargs.length; util.i < util.k; util.i++ ){
                activeTargs[ util.i ].style.display = 'none';
            }
            
            /* SHOWS ALL TARGET STEP DOM ELEMENTS */
            for( util.i=0, util.k = stepTargs.length; util.i < util.k; util.i++ ){
                //stepTargs[ util.i ].style.display = 'block';
                TweenLite.to( stepTargs[ util.i ], 1, { display:'inline-block', onComplete:function(){
                    setImgOrientation();
                } } );
            }

            currentBtn.className = currentBtn.className.replace(/\bactive\b/,'dark');
            targBtn.className = targBtn.className+' active';
            targBtn.className = targBtn.className.replace(/disabled/, '');
            util.activeStep = stepAttrTarg;
            
            if( util.activeProcess === 'singleCanvas' ){
                if( util.activeStep === '2' ){
                    /* INTIT THE EDITING TOOLS */
                    var zoomInBtn = document.querySelector( '.orderProcess[data-process="'+util.activeProcess+'"] .zoomBtn[data-action="zoomIn"]' ),
                        zoomOutBtn = document.querySelector( '.orderProcess[data-process="'+util.activeProcess+'"] .zoomBtn[data-action="zoomOut"]' ),
                        zoomSlider = document.querySelector( '.orderProcess[data-process="'+util.activeProcess+'"] .zoomBtn[data-action="zoomSlide"]' ),
                        activeEditor = document.querySelector( '.orderProcess[data-process="'+util.activeProcess+'"] .canvasEditor[data-editor="1"]' ),
                        editOpts = { activeEditor:activeEditor, orientation:canvasInfo.orient, zoomInBtn:zoomInBtn, zoomOutBtn:zoomOutBtn, zoomSlider:zoomSlider };
                    jscImageEditor.editToolInit( editOpts );
                }
            }
        },
        nextStep = function(){
            var fakeDiv = document.createElement( 'div' ),
                currStep = parseInt( util.activeStep );
            fakeDiv.dataset.nextstep = currStep+1;
            goToStep( fakeDiv );
            
            if( modalHandler.isActiveCheck() ){
                modalHandler.hideModal();
            }
        },
        setImgOrientation = function(){
            var imgDom = document.querySelector( '.orderProcess[data-process="'+util.activeProcess+'"] .roomView .canvasImg img' ),
                editorDom = ( canvasInfo.borderStyle === 'wrap' ) ? jscImageEditor.editToolOpts.activeEditor : document.getElementsByClassName( 'borderStyler' )[ 0 ];
            if( imgDom.offsetWidth < editorDom.offsetWidth ){
                imgDom.dataset.sizeby = 'width';
            }else if( imgDom.offsetHeight < editorDom.offsetHeight ){
                imgDom.dataset.sizeby = 'height';
            }
        },
        setOrientation = function( targ ){
            var processParent = utilFunct.parentUntilClass( targ, 'orderProcess' ),
                roomViewDom = processParent.querySelector( '.roomView' ),
                chosenOrientation = targ.dataset.orient,
                orientActiveBtn = document.querySelectorAll( '.orderProcess[data-process="'+util.activeProcess+'"] .orientBtn.active' ),
                orientTargBtn = document.querySelectorAll( '.orderProcess[data-process="'+util.activeProcess+'"] .orientBtn[data-orient="'+chosenOrientation+'"]' );
                
                if( targ.className.match(/\bactive\b/) ){
                    return ;
                }
                
                for( util.i=0, util.k = orientActiveBtn.length; util.i < util.k; util.i++ ){
                    orientActiveBtn[ util.i ].className = orientActiveBtn[ util.i ].className.replace(/\bactive\b/, '');
                    orientTargBtn[ util.i ].className = orientTargBtn[ util.i ].className+' active';
                }
                
                roomViewDom.dataset.orient = chosenOrientation;
                canvasInfo.orient = chosenOrientation;
                jscImageEditor.editToolOpts.orientation = chosenOrientation;
                jscImageEditor.resetImg();
                roomViewDom.style.display = 'none';
                roomViewDom.style.display = 'inline-block';
                setImgOrientation();
        },
        setSize = function( targ ){
            if( !targ.className.match(/\bsizeBtn\b/) ){
                targ = utilFunct.parentUntilClass( targ, 'sizeBtn' );
            }
            var processParent = utilFunct.parentUntilClass( targ, 'orderProcess' ),
                roomViewDom = processParent.querySelector( '.roomView' ),
                chosenSize = targ.dataset.size,
                chosenPrice = targ.dataset.price,
                chosenSizeDom = document.querySelector( '.orderProcess[data-process="'+util.activeProcess+'"] .canvasChosen' ),
                sizeActiveBtn = document.querySelector( '.orderProcess[data-process="'+util.activeProcess+'"] .sizeBtn.active' );
                
            if( targ.className.match(/\bactive\b/) ){
                return ;
            }
            roomViewDom.dataset.size = chosenSize;
            canvasInfo.size = chosenSize;
            canvasInfo.price = chosenPrice;
            
            if( sizeActiveBtn ){ sizeActiveBtn.className = sizeActiveBtn.className.replace(/\bactive\b/, ''); }
            targ.className = targ.className+' active';
            
            if( chosenSizeDom ){ 
                chosenSizeDom.innerHTML = targ.innerHTML;
                chosenSizeDom.querySelector( '.sizePrice' ).dataset.action = '';
            }
            jscImageEditor.resetImg();
            roomViewDom.style.display = 'none';
            roomViewDom.style.display = 'inline-block';
            setImgOrientation();
        },
        setRoomView = function(){
            var mainArea = document.querySelector('.canvasEditor');
            mainArea.className += " loadingRoom";
            
            var imgDom = document.querySelector( '.orderProcess[data-process="'+util.activeProcess+'"] .roomView .canvasImg img' ),
                imgH = parseInt( jscImageEditor.imgUploaded.height ),
                imgW = parseInt( jscImageEditor.imgUploaded.width ),
                imgR = parseInt( jscImageEditor.imgUploaded.res );
                
            imgDom.src = util.uploadsDir+jscImageEditor.imgUploaded.uploadSrc;
            
            if( imgH > imgW ){
                imgDom.dataset.orient = 'vert';
                util.verticalOrientation = true;
            }else if( imgH < imgW ){
                imgDom.dataset.orient = 'horiz';
            }else if( imgH === imgW ){
                imgDom.dataset.orient = 'square';
            }
        },
        showModify = function(){
            var captionBtn = document.querySelector( '.orderProcess[data-process="'+util.activeProcess+'"] .editActionBtn[data-action="addCaption"]' );
                //modifyBtn = document.querySelector( '.orderProcess[data-process="'+util.activeProcess+'"] .editActionBtn[data-action="modifyMode"]' );
                
            captionBtn.className = captionBtn.className.replace(/\bactive\b/, '');
            //modifyBtn.className = modifyBtn.className+' active';
            domElems.activeRoomview.style.display = 'block';
            domElems.activeCaption.style.display = 'none';
            canvasInfo.caption = document.querySelector( '.orderProcess[data-process="'+util.activeProcess+'"] input[data-id="caption"]' ).value;
        },
        showCaption = function(){
            //var activeAction = document.querySelector( '.orderProcess[data-process="'+util.activeProcess+'"] .editActionBtn.active' ),
            var captionBtn = document.querySelector( '.orderProcess[data-process="'+util.activeProcess+'"] .editActionBtn[data-action="addCaption"]' );
            //activeAction.className = activeAction.className.replace(/\bactive\b/, '');
            captionBtn.className = captionBtn.className+' active';
            
            domElems.activeRoomview.style.display = 'none';
            domElems.activeCaption.style.display = 'block';
        },
        sizeFilter = function(){
            var currSizeBtns = document.querySelectorAll( '.orderProcess[data-process="'+util.activeProcess+'"] .sizeBtn' ),
                sizeSplit = null,
                sizeObj = {},
                minResolution = 72,
                resThreshold = minResolution/2,
                aspectRatio = 0,
                lastAspectSplit = 10,
                sizeClicked = 0;
            var totalDisabled = 0;
            for( util.i = 0, util.k = currSizeBtns.length; util.i < util.k; util.i++ ){
                sizeSplit = currSizeBtns[ util.i ].dataset.size.split('x');
                sizeObj.large = ( parseInt( sizeSplit[0] ) > parseInt( sizeSplit[1] ) ) ? parseInt( sizeSplit[0] ) : parseInt( sizeSplit[1] );
                sizeObj.small = ( parseInt( sizeSplit[0] ) > parseInt( sizeSplit[1] ) ) ? parseInt( sizeSplit[1] ) : parseInt( sizeSplit[0] );
                sizeObj.width = ( canvasInfo.orient === 'horiz' ) ? sizeObj.large * jscImageEditor.imgUploaded.res : sizeObj.small * jscImageEditor.imgUploaded.res;
                sizeObj.height = ( canvasInfo.orient === 'horiz' ) ? sizeObj.small * jscImageEditor.imgUploaded.res : sizeObj.large * jscImageEditor.imgUploaded.res;
                sizeObj.sizeScale = ( sizeObj.width < jscImageEditor.imgUploaded.width ) ? sizeObj.width/jscImageEditor.imgUploaded.width : jscImageEditor.imgUploaded.width/sizeObj.width;
                sizeObj.sizeScale = jscImageEditor.imgUploaded.width/sizeObj.width;
                sizeObj.pixThreshold = jscImageEditor.imgUploaded.res * sizeObj.sizeScale;
                
                //Check for ideal cavas size
                aspectRatioCanvas = parseInt(sizeSplit[1])/parseInt(sizeSplit[0]) ; //Vertical : Horiz
                aspectRatioImage = util.verticalOrientation ? jscImageEditor.imgUploaded.height / jscImageEditor.imgUploaded.width : jscImageEditor.imgUploaded.width / jscImageEditor.imgUploaded.height;
                aspectRatioSplit = Math.abs( aspectRatioCanvas - aspectRatioImage );
                if( sizeObj.pixThreshold < resThreshold && currSizeBtns[ util.i ].dataset.size !== '10x10' ){
                    currSizeBtns[ util.i ].className = currSizeBtns[ util.i ].className+' disabled';
                    totalDisabled++;
                }else{
                    currSizeBtns[ util.i ].className = currSizeBtns[ util.i ].className.replace(/\bdisabled\b/,'');
                    if (aspectRatioSplit <= lastAspectSplit) {
                        currSizeBtns[ util.i ].click();
                        lastAspectSplit = aspectRatioSplit;
                    }
                }

            }

            //Set orientation
            if ( util.verticalOrientation ) {
                var vertOrient = document.querySelector( '.orientBtn[data-orient="vert"]' );
                vertOrient.click();
            }
        },
        selectType = function( targ ){
            /* SET CANVAS TYPE THEN GO TO CHOSEN PROCESS */
            canvasInfo.type = targ.dataset.type;
            if (canvasInfo.type === "group") {
                window.location.href = "./?pg=order";
            }
            goToProcess( targ.dataset.next );
        },
        startUpload = function( uploadFunct ){
            /* RUN THE UPLOAD FUNCTION IN THE jscImageEditor OBJECT */
            if( uploadFunct === 'device' ){
                jscImageEditor.deviceUpload();
            }else if( uploadFunct === 'facebook' ){
                jscImageEditor.facebookUpload();
            }else if( uploadFunct === 'instagram' ){
                jscImageEditor.instagramUpload();
            }
        },
        startEditor = function(){
            var editorParent = domElems.activeEditor.parentNode,
                scaleAnim = { '32x50:vert':'1.75', '32x50:horiz':'1.7', '22x38:vert':'1.9', '22x38:horiz':'2.5', '16x50:vert':'1.5', '16x50:horiz':'2.2', '16x20:vert':'1.2', '16x20:horiz':'1.4', '10x10:horiz':'2.2', '10x10:vert':'2.2' },
                leftPosAnim = { '32x50:vert':'0px', '32x50:horiz':'118px', '22x38:vert':'-13px', '22x38:horiz':'-13px', '16x50:vert':'0px', '16x50:horiz':'17px', '16x20:vert':'0px', '16x20:horiz':'0px', '10x10:horiz':'-240px', '10x10:vert':'-240px' },
                topPosAnim = { '32x50:vert':'60px', '32x50:horiz':'96px', '22x38:vert':'172px', '22x38:horiz':'102px', '16x50:vert':'55px', '16x50:horiz':'90px', '16x20:vert':'45px', '16x20:horiz':'42px', '10x10:horiz':'284px', '10x10:vert':'284px' },
                searchVal = canvasInfo.size+':'+canvasInfo.orient;
                
            domElems.activeEditor.dataset.editoractive = '1';
            editorParent.style.overflow = 'initial';
            domElems.editCanvasBtn.style.display = 'none';
            domElems.activeSizeList.style.display = 'none';
            domElems.smallEditBtn.style.display = 'none';
            domElems.closeEditCanvasBtn.style.display = 'block';
            domElems.activeModifyList.style.display = 'block';
            domElems.explanation.style.display = 'block';
            TweenLite.to( domElems.activeRoomview, animOpts.speed, { transform:'scale('+scaleAnim[ searchVal ]+')', left:leftPosAnim[ searchVal ], top:topPosAnim[ searchVal ], ease:animOpts.ease } );
            /*if (!util.sub1024res) {
                TweenLite.to( domElems.activeRoomview, animOpts.speed, { transform:'scale('+scaleAnim[ searchVal ]+')', left:leftPosAnim[ searchVal ], top:topPosAnim[ searchVal ], ease:animOpts.ease } );
            }*/
            //Start with white border
            var whiteButton = document.querySelector('.borderTypes .button[data-style="white"]');
            whiteButton.click();

        },
        closeEditor = function(){
            var editorParent = domElems.activeEditor.parentNode;
            domElems.activeEditor.dataset.editoractive = '0';
            editorParent.style.overflow = 'hidden';
            domElems.editCanvasBtn.style.display = 'block';
            domElems.activeSizeList.style.display = 'block';
            domElems.smallEditBtn.style.display = 'block';
            domElems.closeEditCanvasBtn.style.display = 'none';
            domElems.activeModifyList.style.display = 'none';
            domElems.explanation.style.display = 'none';
            
            showModify();
            
            TweenLite.to( domElems.activeRoomview, animOpts.speed, { transform:'scale(1)', left:'0px', top:'0px', ease:animOpts.ease } );
        },
        termsAgree = function() {
            modaliOwnHTML = '<div class="cartWait">By clicking the button below you are confirming that you own the rights to this image and that you agree to our <a id="tosLink" href=".?pg=tos" target="_blank">terms of service.</a></div><div class="modalBtns"><div id="termsAgree" class="button modalBtn dark bRadMD">I agree</div></div>';
            modalHandler.showModal( 'default', modaliOwnHTML);
            var agree = document.getElementById( 'termsAgree' );
            agree.addEventListener( eventTypes.click, addToCart );
            if( isTouchDevice ){
                agree.addEventListener( eventTypes.touchend, addToCart );
            }
        },
        changeBorder = function( targ ){
            var activeStyleBtn = document.querySelector( '.borderTypes .active' ),
                roomViewDom = document.getElementsByClassName( 'roomView' )[ 0 ],
                targImg = document.querySelector( '.borderStyler img' );
                
            canvasInfo.borderStyle = targ.dataset.style;
            activeStyleBtn.className = activeStyleBtn.className.replace(/\bactive\b/, '');
            targ.className = targ.className+' active';
            roomViewDom.dataset.borderstyle = canvasInfo.borderStyle;
            
            jscImageEditor.setSnapPos( targImg );
        },
        orderClick = function( evt ){
            if (!evt.target.href) evt.preventDefault();
            var targ = evt.target,
                action = targ.dataset.action;
                //Check for clicks on parent
                if (targ.parentNode.className.indexOf('partySelect') !== -1) {
                    selectType(targ.parentNode);
                }else if (targ.parentNode.parentNode.className.indexOf('partySelect') !== -1){ 
                    selectType(targ.parentNode.parentNode);
                }

                switch( action ){
                    case 'selectType':
                        selectType( targ );
                        break;
                    case 'startUpload':
                        startUpload( targ.dataset.upload );
                        break;
                    case 'goToStep':
                        goToStep( targ );
                        break;
                    case 'setSize':
                        setSize( targ );
                        break;
                    case 'setOrientation':
                        setOrientation( targ );
                        break;
                    case 'startOver':
                        document.location.reload(  );
                        break;
                    case 'startEditor':
                        startEditor();
                        break;
                    case 'closeEditor':
                        closeEditor();
                        break;
                    case 'addCaption':
                        showCaption();
                        break;
                    case 'modifyMode':
                        showModify();
                        break;
                    case 'toCart':
                        termsAgree();
                        break;
                    case 'changeBorder':
                        changeBorder( targ );
                        break;
                    default:
                        /*console.log( 'no function for action: '+action );*/
                }
        },
        preloadImgs = function(){
            var imgSrc = [ './assets/img/roomView/roomViewSprite.png' ],
                imgElems = [];
            
            for( util.i = 0, util.k = imgSrc.length; util.i < util.k; util.i++ ){
                imgElems[ util.i ] = new Image();
                imgElems[ util.i ].src = imgSrc[ util.i ];
            }
        },
        init = function( opts ){
            
            if( isTouchDevice ){
                /* if touch decvice send to mobile order */
                window.location.href = './?pg=orderMobile';
            }
            
            if( opts.cartEdit ){
                util.cartEdit = opts.cartEdit ;
            }
            
            domElems.orderContent = document.getElementById( 'orderCont' );
            domElems.addToCart = document.querySelector( '.button[data-action="toCart"]' );
            domElems.modalContent = document.querySelector( '.modal .modalContent' );
            domElems.uploadArea = document.querySelector( '.uploadArea' );
            domElems.smallEditBtn = document.getElementsByClassName( 'smallEditButton' )[ 0 ];
            domElems.closeEditCanvasBtn = document.getElementsByClassName( 'closeEditCanvas' )[ 0 ];
            domElems.explanation = document.querySelector('.editExplanation');
            
            domElems.orderContent.addEventListener( eventTypes.click, orderClick );
            if( isTouchDevice ){
                domElems.orderContent.addEventListener( eventTypes.touchend, orderClick );
            }
            
            preloadImgs();
            
            /* IF orderProcess IS SET IN URL THEN GO TO THAT STEP */
            util.activeProcess = 'typeChoice';
            util.activeStep = 1;
            if( utilFunct.getUrlParam( 'orderProcess' ) ){
                goToProcess( utilFunct.getUrlParam( 'orderProcess' ) );
            }else if( utilFunct.getUrlParam( 'code' ) ){
                jscImageEditor.instagram.accessCode = utilFunct.getUrlParam( 'code' );
                goToProcess( 'singleCanvas' );
                startUpload( 'instagram' );
            }
        };
    return { init:init, selectType:selectType, nextStep:nextStep, setRoomView:setRoomView, canvasInfo:canvasInfo, sizeFilter:sizeFilter, setImgOrientation:setImgOrientation, goToProcess:goToProcess };
}();