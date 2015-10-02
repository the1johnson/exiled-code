var orderMobileTool = function(){
    var domElems = { content:null, uploadList:null, uploadFileInput:null, fbFileHolder:null, instagramFileHolder:null, progHolder:null, uploadProgName:null, uploadProgSize:null, uploadProgBar:null, uploadProgPercentTxt:null, step1:null, step2:null, step3:null, step1Loading:null, imgPreview:null, viewSizePrev:null, foldSizePrev:null, editorImgPreview:null, editorSizePreview:null, editorPrintSizePreview:null, canvasChosen:null, editImgBtn:null, addToCartBtn:null, editImgCloseBtn:null, gapLines:null, finishLines:null, mainLine:null, borderStyler:null, borderStyleHolder:null },
        hammerTime = null,
        util = { i:0, k:0, j:0, n:0, returnData:null, uploadsDir:'./uploads/', currStep:1, prevPanX:0, prevPanY:0, scaleT:0, pinchFirst:0, sizebySet:0, cartEdit:null, cartEditId:0 },
        canvasInfo = { type:null, size:'10x10', orient:'horiz', price:0.00, caption:'', borderStyle:'wrap' },
        imgUploaded = { uploadSrc:null, height:null, width:null, res:null, source:null },
        facebook = { container:null, selectedImg:null },
        instagram = { container:null, selectedImg:null, accessToken:null, accessCode:null, clientID:'50b78ad584ef4ac69133a5119014d8c5', userInfo:null, redirectUrl:'https://justsaycheese.com/?pg=orderMobile&response_type=code' },
        scripts = { uploadImg:'assets/php/jscImgEditor/uploadImg.php', uploadImgFromUrl:'assets/php/jscImgEditor/uploadImgFromUrl.php', uploadImgFromExisting:'assets/php/jscImgEditor/uploadImgFromExisting.php', instagramCode:'assets/php/jscImgEditor/mobileInstagramCode.php', instagramImgs:'assets/php/jscImgEditor/mobileInstagramImages.php', flickrPhotos:'assets/php/jscImgEditor/flickrPhotos.php', toCart:'assets/php/scripts/addItemToCart.php' },
        acceptedFileTypes = [ 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG' ],
        foldSize = { '10x10': { small:209, large:209 }, '16x20': { small:318, large:383 }, '22x38': { small:148, large:240 }, '16x50': { small:113, large:310 }, '32x50': { small:257, large:388 } },
        viewSize = { '10x10': { small:155, large:155 }, '16x20': { small:261, large:325 }, '22x38': { small:128, large:220 }, '16x50': { small:91, large:290 }, '32x50': { small:231, large:362 } },
        validFileType = function( fType ){
            /* check if uploaded file type is a valid file type */
            var isValid = false,
                typesLen = acceptedFileTypes.length;
            
            for( util.i = 0; util.i<typesLen; util.i++ ){
                if( fType === acceptedFileTypes[ util.i ] ){
                    isValid = true;
                }
            }
        
            return isValid;
        },
        readURL = function( file ){
            var reader = new FileReader(),
                targImg = document.getElementById( 'uploadPreview' );
            reader.onload = function( evt ){
                targImg.src = evt.target.result;
            }
            reader.readAsDataURL( file );
        },
        sizeFilter = function(){
            var currSizeBtns = document.getElementsByClassName( 'sizeBtn' ),
                sizeSplit = null,
                sizeObj = {},
                minResolution = 72,
                resThreshold = minResolution/2,
                sizeClicked = 0,
                aspectRatio = 0,
                vertical = false;
                lastAspectSplit = 10,
                totalDisabled = 0;
            for( util.j = 0, util.n = currSizeBtns.length; util.j < util.n; util.j++ ){
                sizeSplit = currSizeBtns[ util.j ].dataset.size.split('x');
                sizeObj.large = ( parseInt( sizeSplit[0] ) > parseInt( sizeSplit[1] ) ) ? parseInt( sizeSplit[0] ) : parseInt( sizeSplit[1] );
                sizeObj.small = ( parseInt( sizeSplit[0] ) > parseInt( sizeSplit[1] ) ) ? parseInt( sizeSplit[1] ) : parseInt( sizeSplit[0] );
                sizeObj.width = ( canvasInfo.orient === 'horiz' ) ? sizeObj.large * imgUploaded.res : sizeObj.small * imgUploaded.res;
                sizeObj.height = ( canvasInfo.orient === 'horiz' ) ? sizeObj.small * imgUploaded.res : sizeObj.large * imgUploaded.res;
                sizeObj.sizeScale = ( sizeObj.width < imgUploaded.width ) ? sizeObj.width/imgUploaded.width : imgUploaded.width/sizeObj.width;
                sizeObj.sizeScale = imgUploaded.width/sizeObj.width;
                sizeObj.pixThreshold = imgUploaded.res * sizeObj.sizeScale;

                vertical = (imgUploaded.width < imgUploaded.height)

                //Check for ideal cavas size
                aspectRatioCanvas = parseInt(sizeSplit[1])/parseInt(sizeSplit[0]) ; //Vertical : Horiz
                aspectRatioImage = vertical ? imgUploaded.height / imgUploaded.width : imgUploaded.width / imgUploaded.height;
                aspectRatioSplit = Math.abs( aspectRatioCanvas - aspectRatioImage );
                if( sizeObj.pixThreshold < resThreshold && currSizeBtns[ util.j ].dataset.size !== '10x10' ){
                    currSizeBtns[ util.j ].className = currSizeBtns[ util.j ].className+' disabled';
                    totalDisabled++;
                }else{
                    currSizeBtns[ util.j ].className = currSizeBtns[ util.j ].className.replace(/\bdisabled\b/,'');
                    if (aspectRatioSplit <= lastAspectSplit) {  //if( !sizeClicked ){
                        $$( currSizeBtns[ util.j ] ).trigger('touchend');
                        lastAspectSplit = aspectRatioSplit; //sizeClicked = 1;
                    }
                }

            }

            //Set orientation
            if ( vertical ) {
                var vertOrient = document.querySelector( '.orientBtn[data-orient="vert"]' );
                $$(vertOrient).trigger('touchend');
            }
        },
        sizePreviewImageLoaded = function(){
            var loadingTxt = document.getElementsByClassName( 'loadingTxt' )[ 0 ];
            loadingTxt.style.display = 'none';
            updateSizePreview();
        },
        uploadComplete = function(){
            window.scroll(0,0);
            /* got to step 2 */
            var explodeSrc = imgUploaded.uploadSrc.split( '.' ),
                fileName = ( util.cartEditId ) ? explodeSrc[0].replace(/_edit/,'') : explodeSrc[0];
            
            domElems.imgPreview.src = util.uploadsDir+fileName+'_downSample.'+explodeSrc[1];
            domElems.editorImgPreview.src = util.uploadsDir+fileName+'_downSample.'+explodeSrc[1];
            //domElems.imgPreview.src = util.uploadsDir+imgUploaded.uploadSrc;
            domElems.editorImgPreview.src = util.uploadsDir+imgUploaded.uploadSrc;
            domElems.step1.style.display = 'none';
            domElems.imgPreview.onload = sizePreviewImageLoaded;
            TweenLite.to( domElems.step2, 1, { display:'block', onComplete:function(){
                util.currStep = 2;
                sizeFilter();
            } } );
        },
        uploadProgress = function( evt ){
            var percent = ( ( evt.loaded / evt.total ) * 100 ).toFixed( 2 ),
                perceTxt = percent+'%';
            domElems.uploadProgPercentTxt.innerHTML = perceTxt;
            TweenLite.to( domElems.uploadProgBar, animOpts.speed, { width:perceTxt, ease:animOpts.ease } );
        },
        loadFBimgs = function( targElem ){
            var ajax = new XMLHttpRequest(),
                scriptUrl = targElem.dataset.script ;
            ajax.open( 'GET', scriptUrl );
            ajax.onreadystatechange = function() {
                if( ajax.readyState == 4 && ajax.status == 200 ) {
                    var modalHTML = '',
                        imgSrc = '',
                        altTag = '',
                        dataSrc = '',
                        orientClass = '';
                    util.returnData = JSON.parse( ajax.responseText );
                    if( util.returnData.paging.next ){
                        targElem.dataset.script = util.returnData.paging.next;
                    }else{
                        var elemParent = targElem.parentNode;
                        elemParent.removeChild( targElem );
                    }
                    for( util.i = 0, util.k=util.returnData.data.length; util.i<util.k; util.i++ ){
                        orientClass = ( util.returnData.data[ util.i ].height > util.returnData.data[ util.i ].width || util.returnData.data[ util.i ].height === util.returnData.data[ util.i ].width ) ? 'vert' : 'horiz';
                        imgSrc = util.returnData.data[ util.i ].source;
                        altTag = ( util.returnData.data[ util.i ].name ) ? util.returnData.data[ util.i ].name : 'User Photo';
                        dataSrc = util.returnData.data[ util.i ].images[0].source;
                        modalHTML += '<li><div class="selectedOverlay" data-action="toggleFB"></div><img src="'+imgSrc+'" alt="Facebook Image: '+altTag+'" data-src="'+dataSrc+'" data-orient="'+orientClass+'" /></li>';
                    }
                    facebook.container.innerHTML = facebook.container.innerHTML+modalHTML;
                }
            }
            ajax.send();
        },
        loadInstagramImgs = function( url ){
            var ajax = new XMLHttpRequest(),
                formData = new FormData(),
                imgHTML = '';
            formData.append( 'requestUrl', url );
            ajax.open( 'POST', scripts.instagramImgs );
            ajax.onreadystatechange = function() {
                if( ajax.readyState == 4 && ajax.status == 200 ) {
                    util.returnData = JSON.parse( ajax.responseText );
                    var moreBtn = domElems.instagramFileHolder.querySelector( '.viewMoreInstagram' );
                    if(util.returnData.pagination.next_url){
                        moreBtn.dataset.script = util.returnData.pagination.next_url;
                    }else{
                        moreBtn.parentNode.removeChild( moreBtn );
                    }
                    
                    if( util.returnData.data.length === 0 ){
                        instagram.container.innerHTML = '<li class="noSocial">You have no Instagram photos.</li>'
                    }else{
                        for( util.i = 0, util.k = util.returnData.data.length; util.i<util.k; util.i++ ){
                            imgSrc = util.returnData.data[ util.i ].images.low_resolution.url.replace( /http/, 'https' );
                            dataSrc = util.returnData.data[ util.i ].images.standard_resolution.url;
                            altTag = ( util.returnData.data[ util.i ].caption ) ? util.returnData.data[ util.i ].caption.text : 'User Photo';
                            //imgHTML += '<li><div class="selectedOverlay" data-action="toggleInstagramSelect"></div><img src="'+imgSrc+'" alt="Instagram Image: '+altTag+'" data-src="'+dataSrc+'" /></li>';
                            instagram.container.innerHTML = instagram.container.innerHTML+'<li><div class="selectedOverlay" data-action="toggleInstagramSelect"></div><img src="'+imgSrc+'" alt="Instagram Image: '+altTag+'" data-src="'+dataSrc+'" /></li>';
                        }
                    }
                    //instagram.container.innerHTML = instagram.container.innerHTML+imgHTML;
                }
            }
            ajax.send( formData  );
        },
        instagramUpload = function(){
            window.scroll(0,0);
            if( instagram.accessCode !== null ){
                var ajax = new XMLHttpRequest(),
                    formData = new FormData(),
                    instagramList = '<ul class="instagramPicList"></ul><div class="modalBtns"><div class="viewMoreInstagram button modalBtn dark bRadMD" data-action="viewMoreInstagram" data-script="">View More</div><div class="chooseImage button modalBtn dark bRadMD" data-action="chooseInstagramImg">Choose Image</div></div>';
                formData.append( 'code', instagram.accessCode );
                ajax.open( 'POST', scripts.instagramCode );
                ajax.onreadystatechange = function() {
                    if( ajax.readyState == 4 && ajax.status == 200 ) {
                        util.returnData = JSON.parse( ajax.responseText );
                        instagram.accessToken = util.returnData.access_token;
                        instagram.userInfo = util.returnData.user;
                        
                        if( instagram.userInfo == null ){
                            window.location.href = './?pg=orderMobile';
                        }
                        loadInstagramImgs( 'https://api.instagram.com/v1/users/'+instagram.userInfo.id+'/media/recent/?access_token='+instagram.accessToken );
                        domElems.instagramFileHolder.innerHTML = instagramList;
                        instagram.container = document.querySelector( 'ul.instagramPicList' );
                        domElems.instagramFileHolder.style.display = 'block';
                        domElems.step1Loading.style.display = 'none';
                    }
                }
                ajax.send( formData  );
            }else{
                window.location.href = 'https://api.instagram.com/oauth/authorize/?client_id='+instagram.clientID+'&redirect_uri='+instagram.redirectUrl;
            }
        },
        deviceUpload = function(){
            window.scroll(0,0);
            var formData = new FormData(),
                ajax = new XMLHttpRequest();
            /* upload progress handler */
            ajax.upload.addEventListener( eventTypes.progress, uploadProgress );
            ajax.open( 'POST', scripts.uploadImg );
            ajax.onreadystatechange = function() {
                if( ajax.readyState == 4 && ajax.status == 200 ) {
                    util.returnData = JSON.parse( ajax.responseText );
                    imgUploaded.uploadSrc = util.returnData.fileName;
                    imgUploaded.width = util.returnData.width;
                    imgUploaded.height = util.returnData.height;
                    imgUploaded.res = util.returnData.res;
                    imgUploaded.source = 'device';
                    uploadComplete();
                }
            }
            
            /* file chosen handler */
            domElems.uploadFileInput.addEventListener( eventTypes.change, function(){
                var fileList = domElems.uploadFileInput.files,
                    fileNameSplit = fileList[0].name.split('.');
                    //alert( 'test name: '+fileList[0].name );
                /* if file chosen through input is acceptable then set uploadProg text and upload */
                if( fileList.length > 0 && validFileType( fileNameSplit[ fileNameSplit.length-1 ] ) ) {
                    domElems.uploadProgName.innerHTML = fileList[0].name;
                    domElems.uploadProgSize.innerHTML = (fileList[0].size/1000).toFixed(2);
                    readURL( fileList[0] );
                    formData.append( 'jscImage', fileList[0] );
                    /* show prog bar */
                    domElems.uploadList.style.display = 'none';
                    domElems.progHolder.style.display = 'block';
                    ajax.send(formData);
                }
            } );
            
            /* click input after events added */
            domElems.uploadFileInput.click();
            $$( domElems.uploadFileInput ).trigger('touchend');
        },
        toggleFBselect = function( targElem ){
            var parentElem = targElem.parentNode,
                currActive = facebook.container.getElementsByClassName( 'active' )[0]
                imgSrc = parentElem.querySelector( 'img' ).dataset.src;
            if( currActive ){ currActive.className = currActive.className.replace(/\bactive\b/,''); }
            parentElem.className = ( parentElem.className.length > 0 ) ? parentElem.className+' active' : 'active';
            facebook.selectedImg = imgSrc;
        },
        toggleInstagramSelect = function( targElem ){
            var parentElem = targElem.parentNode,
                currActive = instagram.container.getElementsByClassName( 'active' )[0]
                imgSrc = parentElem.querySelector( 'img' ).dataset.src;
            if( currActive ){ currActive.className = currActive.className.replace(/\bactive\b/,''); }
            parentElem.className = ( parentElem.className.length > 0 ) ? parentElem.className+' active' : 'active';
            instagram.selectedImg = imgSrc;
        },
        uploadFBimg = function( targ ){
            if( facebook.selectedImg == null || targ.className.match(/\bdisabled\b/) ){ return ; }
            var formData = new FormData(),
                ajax = new XMLHttpRequest();
                
            formData.append( 'imgUrl', facebook.selectedImg );
            targ.className = targ.className+' disabled';
            ajax.open( 'POST', scripts.uploadImgFromUrl );
            ajax.onreadystatechange = function() {
                if( ajax.readyState == 4 && ajax.status == 200 ) {
                    util.returnData = JSON.parse( ajax.responseText );
                    imgUploaded.uploadSrc = util.returnData.fileName;
                    imgUploaded.width = util.returnData.width;
                    imgUploaded.height = util.returnData.height;
                    imgUploaded.res = util.returnData.res;
                    imgUploaded.source = 'facebook';
                    uploadComplete();
                }
            }
            ajax.send( formData );
        },
        uploadInstagramImg = function( targ ){
            if( instagram.selectedImg == null || targ.className.match(/\bdisabled\b/) ){ return ; }
            var formData = new FormData(),
                ajax = new XMLHttpRequest();
                
            formData.append( 'imgUrl', instagram.selectedImg );
            targ.className = targ.className+' disabled';
            ajax.open( 'POST', scripts.uploadImgFromUrl );
            ajax.onreadystatechange = function() {
                if( ajax.readyState == 4 && ajax.status == 200 ) {
                    util.returnData = JSON.parse( ajax.responseText );
                    imgUploaded.uploadSrc = util.returnData.fileName;
                    imgUploaded.width = util.returnData.width;
                    imgUploaded.height = util.returnData.height;
                    imgUploaded.res = util.returnData.res;
                    imgUploaded.source = 'instagram';
                    uploadComplete();
                }
            }
            ajax.send( formData );
        },
        updateSizePreview = function(){
            var currWidth = ( util.currStep === 2 ) ? domElems.viewSizePrev.offsetWidth : domElems.editorSizePreview.offsetWidth,
                scalePercent = ( canvasInfo.orient === 'horiz' ) ? currWidth/viewSize[ canvasInfo.size ].large : currWidth/viewSize[ canvasInfo.size ].small,
                viewSetVal = ( canvasInfo.orient === 'horiz' ) ? parseInt( viewSize[ canvasInfo.size ].small * scalePercent ) : parseInt( viewSize[ canvasInfo.size ].large * scalePercent ),
                foldSetHeight = ( canvasInfo.orient === 'horiz' ) ? parseInt( foldSize[ canvasInfo.size ].small * scalePercent ) : parseInt( foldSize[ canvasInfo.size ].large * scalePercent ),
                foldSetWidth = ( canvasInfo.orient === 'horiz' ) ? parseInt( foldSize[ canvasInfo.size ].large * scalePercent ) : parseInt( foldSize[ canvasInfo.size ].small * scalePercent ),
                foldMarkSize = (foldSetHeight - viewSetVal)/2;
                
            domElems.viewSizePrev.style.height = viewSetVal+'px';
            domElems.viewSizePrev.style.minHeight = '0px';
            domElems.editorSizePreview.style.height = viewSetVal+'px';
            
            domElems.foldSizePrev.style.height = foldSetHeight+'px';
            domElems.foldSizePrev.style.width = foldSetWidth+'px';
            
            domElems.editorPrintSizePreview.style.height = foldSetHeight+'px';
            domElems.editorPrintSizePreview.style.width = foldSetWidth+'px';
            
            domElems.mainLine.style.height = 'calc( 100% - '+(foldMarkSize*2)+'px )';
            domElems.mainLine.style.width = 'calc( 100% - '+(foldMarkSize*2)+'px )';
            
            for( util.i = 0, util.k = domElems.gapLines.length; util.i<util.k; util.i++ ){
                domElems.gapLines[ util.i ].style.height = foldMarkSize+'px';
                domElems.gapLines[ util.i ].style.width = foldMarkSize+'px';
                
                if( domElems.finishLines[ util.i ].className.match(/\btop\b/) || domElems.finishLines[ util.i ].className.match(/\bbottom\b/) ){
                    domElems.finishLines[ util.i ].style.height = foldMarkSize+'px';
                    domElems.finishLines[ util.i ].style.width = 'calc( 100% - '+(foldMarkSize*2)+'px )';
                }else{
                    domElems.finishLines[ util.i ].style.width = foldMarkSize+'px';
                    domElems.finishLines[ util.i ].style.height = 'calc( 100% - '+(foldMarkSize*2)+'px )';
                }
            }
            
            var checkWidth = ( domElems.imgPreview.offsetWidth ) ? domElems.imgPreview.offsetWidth : domElems.editorImgPreview.offsetWidth,
                checkHeight = ( domElems.imgPreview.offsetHeight ) ? domElems.imgPreview.offsetHeight : domElems.imgPreview.offsetHeight;
            
            if( util.currStep === 2 ){
                if( checkWidth < foldSetWidth ){
                    domElems.imgPreview.dataset.sizeby = 'width';
                    domElems.editorImgPreview.dataset.sizeby = 'width';
                }else if( checkHeight < foldSetHeight ){
                    domElems.imgPreview.dataset.sizeby = 'height';
                    domElems.editorImgPreview.dataset.sizeby = 'height';
                }
            }
            
        },
        setSize = function( targ ){
            if( !targ.className.match(/\bsizeBtn\b/) ){
                targ = utilFunct.parentUntilClass( targ, 'sizeBtn' );
            }
            if( targ.className.match(/\bactive\b/) ){
                return ;
            }
            
            var chosenSize = targ.dataset.size,
                chosenPrice = targ.dataset.price,
                sizeActiveBtn = document.querySelector( '.sizeBtn.active' );
                
            if( sizeActiveBtn ){ sizeActiveBtn.className = sizeActiveBtn.className.replace(/\bactive\b/, ''); }
            targ.className = targ.className+' active';
            canvasInfo.size = chosenSize;
            canvasInfo.price = chosenPrice;
            updateSizePreview();
            window.scroll(0,0);
            domElems.canvasChosen.innerHTML = targ.innerHTML;
            var ccSub = domElems.canvasChosen.getElementsByClassName( 'btnSubTxt' )[ 0 ],
                ccPrice = domElems.canvasChosen.getElementsByClassName( 'sizePrice' )[ 0 ],
                selectSizeBtn = document.querySelector( '.button[data-action="selectSize"]' ),
                selectSizeArrow = document.querySelector( '.arrowRight[data-action="selectSize"]' );
            selectSizeBtn.className = selectSizeBtn.className.replace(/\bdisabled\b/,'');
            selectSizeArrow.className = selectSizeArrow.className.replace(/\bdisabled\b/,'');
            if( ccSub ){
                ccSub.dataset.action = '';
            }
            ccPrice.dataset.action = '';
        },
        setOrientation = function( targ ){
            
            if( targ.className.match(/\bactive\b/) ){ return; }

            var orientActiveBtn = document.querySelector( '.orientBtn.active' );
            orientActiveBtn.className = orientActiveBtn.className.replace(/\bactive\b/, '');
            
            targ.className = targ.className+' active';
            
            canvasInfo.orient = targ.dataset.orient;
            updateSizePreview();
            window.scroll(0,0);
        },
        addItemToCart = function(){
            var item = { edit:{} },
                formData = new FormData(),
                ajax = new XMLHttpRequest(),
                activeEditor = domElems.editorPrintSizePreview,
                imgElem = domElems.editorImgPreview,
                modalHTML = '<div class="cartWait"><h2>Adding To Cart</h2><p>You items are being processed. Please wait.</p><div class="loadingGif"></div></div>',
                rotateVal = ( imgElem.style.transform ) ? parseFloat (imgElem.style.transform.substring( 7 ) ) : 0;
            
            item.caption = canvasInfo.caption;
            item.size = canvasInfo.size;
            item.orientation = canvasInfo.orient;
            item.borderStyle = canvasInfo.borderStyle;
            item.imgSrc = imgUploaded.uploadSrc;
            item.uploadSrc = imgUploaded.source;
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
                item.cartEdit = util.cartEditId;
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
        showTermsAgree = function(){
            var modalHTML = '<div class="cartWait">By clicking the button below you are confirming that you own the rights to this image and that you agree to our <a id="tosLink" href=".?pg=tos" target="_blank">terms of service.</a></div><div class="modalBtns"><div id="termsAgree" class="button modalBtn dark bRadMD">I agree</div></div>';
            modalHandler.showModal( 'default', modalHTML);
            window.scroll(0,0);
            var agree = document.getElementById( 'termsAgree' );
            agree.addEventListener( eventTypes.click, addItemToCart );
            agree.addEventListener( eventTypes.touchend, addItemToCart );
        },
        showEditor = function(){
            domElems.canvasChosen.style.display = 'none';
            domElems.editImgBtn.style.display = 'none';
            domElems.addToCartBtn.style.display = 'none';
            domElems.editImgCloseBtn.style.display = 'block';
            domElems.borderStyleHolder.style.display = 'block';
            domElems.editorSizePreview.style.overflow = 'initial';
            domElems.step3.dataset.editactive = '1';
            var whiteButton = document.querySelector('.borderStyleHolder .button[data-style="white"]');
            whiteButton.click();
        },
        hideEditor = function(){
            domElems.canvasChosen.style.display = 'block';
            domElems.editImgBtn.style.display = 'inline-block';
            domElems.addToCartBtn.style.display = 'inline-block';
            domElems.editImgCloseBtn.style.display = 'none';
            domElems.borderStyleHolder.style.display = 'none';
            domElems.editorSizePreview.style.overflow = 'hidden';
            domElems.step3.dataset.editactive = '0';
            window.scroll(0,0);
        },
        setSnapPos = function(){
            var currTop = ( domElems.editorImgPreview.style.top ) ? parseInt(domElems.editorImgPreview.style.top) : 0,
                currLeft = ( domElems.editorImgPreview.style.left ) ? parseInt(domElems.editorImgPreview.style.left) : 0,
                checkElem = ( canvasInfo.borderStyle === 'wrap' ) ? domElems.editorPrintSizePreview : domElems.mainLine ,
                minTop = checkElem.offsetHeight - domElems.editorImgPreview.offsetHeight,
                minLeft = checkElem.offsetWidth - domElems.editorImgPreview.offsetWidth;
            
            if( currTop > 0 ){
                TweenLite.to( domElems.editorImgPreview, animOpts.speed, { top:'0px', ease:animOpts.ease } );
            }else if( currTop < minTop ){
                TweenLite.to( domElems.editorImgPreview, animOpts.speed, { top:minTop+'px', ease:animOpts.ease } );
            }
            
            if( currLeft > 0 ){
                TweenLite.to( domElems.editorImgPreview, animOpts.speed, { left:'0px', ease:animOpts.ease } );
            }else if( currLeft < minLeft ){
                TweenLite.to( domElems.editorImgPreview, animOpts.speed, { left:minLeft+'px', ease:animOpts.ease } );
            }
        },
        changeBorder = function( borderStyle ){
            var activeStyleBtn = document.querySelector( '.borderStyleHolder .active' ),
                targStyleBtn = document.querySelector( '.borderStyleHolder .button[data-style="'+borderStyle+'"]' );
            activeStyleBtn.className = activeStyleBtn.className.replace(/\bactive\b/, '');
            targStyleBtn.className = targStyleBtn.className+' active';
            
            canvasInfo.borderStyle = borderStyle;
            domElems.editorPrintSizePreview.dataset.borderstyle = borderStyle;
            if( borderStyle === 'wrap' ){
                domElems.borderStyler.removeAttribute( 'style' );
            }else{
                domElems.borderStyler.style.cssText = domElems.mainLine.style.cssText;
            }
            setSnapPos();
        },
        backToSizeChoice = function(){
            if( domElems.step3.dataset.editactive === '1' ){
                hideEditor();
            }
            domElems.step3.style.display = 'none';
            domElems.step2.style.display = 'block';
            util.currStep = 2;
            changeBorder( 'wrap' );
        },
        contClick = function( evt ){
            if ( !evt.target.href && !parseInt( evt.target.dataset.default ) ){ evt.preventDefault(); }
            if( evt.target.href ){
                evt.target.click();
            }
            var targ = evt.target,
                action = targ.dataset.action;
                if( targ.className.match(/\bdisabled\b/) ){ return ; }
                switch( action ){
                    case 'startUploadDevice':
                        deviceUpload();
                        break;
                    case 'startUploadInstagram':
                        instagramUpload();
                        break;
                    case 'viewMoreInstagram':
                        loadInstagramImgs( targ.dataset.script )
                        break;
                    case 'viewMoreFacebook':
                        loadFBimgs( targ );
                        break;
                    case 'startUploadFacebook':
                        window.scroll(0,0);
                        domElems.uploadList.style.display = 'none';
                        domElems.step1Loading.style.display = 'block';
                        FB.login( function( response ){
                            FB.api(
                                'me/photos/uploaded',
                                function( response ){
                                    if( response && !response.error ){
                                        /* photos are in response */
                                        var facebookList = '<ul class="facbookPicList">',
                                            imgSrc = '',
                                            dataSrc = '',
                                            altTag = '',
                                            orientClass = '',
                                            viewMoreBtn = ( response.paging.next ) ? '<div class="viewMoreFacebook button modalBtn dark bRadMD" data-action="viewMoreFacebook" data-script="'+response.paging.next+'">View More</div>' : '';
                                        if( response.data.length === 0 ){
                                            facebookList += '<li class="noSocial">You have no Facebook photos.</li>'
                                        }else{
                                            for( util.i = 0, util.k=response.data.length; util.i<util.k; util.i++ ){
                                                orientClass = ( response.data[ util.i ].height > response.data[ util.i ].width || response.data[ util.i ].height === response.data[ util.i ].width ) ? 'vert' : 'horiz';
                                                imgSrc = response.data[ util.i ].source;
                                                dataSrc = response.data[ util.i ].images[0].source;
                                                altTag = ( response.data[ util.i ].name ) ? response.data[ util.i ].name : 'User Photo';
                                                facebookList += '<li><div class="selectedOverlay" data-action="toggleFB"></div><img src="'+imgSrc+'" alt="Facebook Image: '+altTag+'" data-src="'+dataSrc+'" data-orient="'+orientClass+'" /></li>';
                                            }
                                        }
                                        facebookList += '</ul><div class="modalBtns">'+viewMoreBtn+'<div class="button modalBtn dark bRadMD" data-action="chooseFBimg">Choose Image</div></div>';
                                        domElems.fbFileHolder.innerHTML = facebookList;
                                        facebook.container = document.getElementsByClassName( 'facbookPicList' )[ 0 ];
                                        domElems.fbFileHolder.style.display = 'block';
                                        domElems.step1Loading.style.display = 'none';
                                    }else{
                                        document.location.reload();
                                    }
                                }
                            );
                        }, { scope:'email,user_photos' } );
                        break;
                    case 'toggleFB':
                        toggleFBselect( targ );
                        break;
                    case 'toggleInstagramSelect':
                        toggleInstagramSelect( targ );
                        break;
                    case 'chooseFBimg':
                        uploadFBimg( targ );
                        break;
                    case 'chooseInstagramImg':
                        uploadInstagramImg( targ );
                        break;
                    case 'setSize':
                        setSize( targ );
                        break;
                    case 'setOrientation':
                        setOrientation( targ );
                        break;
                    case 'startOver':
                        document.location.reload();
                        break;
                    case 'selectSize':
                        domElems.step2.style.display = 'none';
                        domElems.step3.style.display = 'block';
                        util.currStep = 3;
                        window.scroll(0,0);
                        break;
                    case 'termsAgree':
                        showTermsAgree();
                        break;
                    case 'startEditor':
                        showEditor();
                        break;
                    case 'hideEditor':
                        hideEditor();
                        break;
                    case 'changeSize':
                        backToSizeChoice();
                        break;
                    case 'changeBorder':
                        changeBorder( targ.dataset.style );
                        break;
                    default:
                        //evt.target.click();
                }
        },
        windowResize = function( evt ){
            updateSizePreview();
        },
        handlePan = function( evt ){
            var editorActive = parseInt(domElems.step3.dataset.editactive);
            if( !editorActive ){ return ; }
            var currTop = ( domElems.editorImgPreview.style.top ) ? parseInt(domElems.editorImgPreview.style.top) : 0,
                currLeft = ( domElems.editorImgPreview.style.left ) ? parseInt(domElems.editorImgPreview.style.left) : 0,
                moveTop = ( util.prevPanY === 0 ) ? currTop : currTop - (util.prevPanY - evt.center.y),
                moveLeft = ( util.prevPanX === 0 ) ? currLeft : currLeft - (util.prevPanX - evt.center.x);
            
            util.prevPanX = (evt.isFinal) ? 0 : evt.center.x;
            util.prevPanY = (evt.isFinal) ? 0 : evt.center.y;
            domElems.editorImgPreview.style.top = moveTop+'px';
            domElems.editorImgPreview.style.left = moveLeft+'px';
            
            if( evt.isFinal ){
                setSnapPos();
            }
        },
        handlePinchStart = function( evt ){
            util.pinchFirst = 1;
        },
        handlePinch = function( evt ){
            var editorActive = parseInt(domElems.step3.dataset.editactive);
            if( !editorActive ){ return ; }
            var scaleVal = evt.scale,
                maxScale = 200,
                minScale = 100,
                currScale = null,
                targScale = 0;
                
            if(util.pinchFirst){
                if( domElems.editorImgPreview.style.height && domElems.editorImgPreview.style.width ){
                    currScale = ( domElems.editorImgPreview.dataset.sizeby === 'height' ) ? parseFloat(domElems.editorImgPreview.style.height) : parseFloat(domElems.editorImgPreview.style.width);
                }else{
                    currScale = 100;
                }
                util.scaleT = currScale;
            }else{
                currScale = util.scaleT;
            }
            util.pinchFirst = 0;
            
            targScale = currScale*scaleVal;
            
            if( targScale < minScale ){
                targScale = minScale;
            }else if( targScale > maxScale ){
                targScale = maxScale;
            }
            
            if( domElems.editorImgPreview.dataset.sizeby === 'height' ){
                domElems.editorImgPreview.style.height = targScale+'%';
                domElems.editorImgPreview.style.width = 'auto';
            }else{
                domElems.editorImgPreview.style.width = targScale+'%';
                domElems.editorImgPreview.style.height = 'auto';
            }
            setSnapPos();
        },
        editExistingFile = function( imgSrc, uploadSrc ){
            var ajax = new XMLHttpRequest(),
                formData = new FormData();
            formData.append( 'imgSrc', imgSrc );
            
            ajax.open( 'POST', scripts.uploadImgFromExisting );
            ajax.onreadystatechange = function() {
                if( ajax.readyState == 4 && ajax.status == 200 ) {
                    util.returnData = JSON.parse( ajax.responseText );
                    imgUploaded.uploadSrc = util.returnData.fileName;
                    imgUploaded.width = util.returnData.width;
                    imgUploaded.height = util.returnData.height;
                    imgUploaded.res = util.returnData.res;
                    imgUploaded.source = uploadSrc;
                    uploadComplete();
                    //console.log( util.returnData );
                }
            }
            ajax.send( formData );
        },
        init = function( opts ){
            if( !isTouchDevice ){
                /* if not touch decvice send to order */
                window.location.href = './?pg=order';
            }
            domElems.content = document.getElementById( 'orderMobile' );
            domElems.uploadFileInput = document.getElementById( 'jscUploadInput' );
            domElems.fbFileHolder = document.getElementById( 'fbFileHolder' );
            domElems.instagramFileHolder = document.getElementById( 'instagramFileHolder' );
            domElems.progHolder = document.getElementById( 'progHolder' );
            domElems.uploadProgName = document.getElementById( 'uploadFileName' );
            domElems.uploadProgSize = document.getElementById( 'uploadFileSize' );
            domElems.uploadProgBar = document.getElementById( 'uploadProgressBar' );
            domElems.uploadProgPercentTxt = document.getElementById( 'uploadPercentComplete' );
            domElems.uploadList = document.getElementsByClassName( 'uploadList' )[ 0 ];
            domElems.imgPreview = document.getElementById( 'mobileImgPrev' );
            domElems.viewSizePrev = document.getElementsByClassName( 'sizePreview' )[ 0 ];
            domElems.foldSizePrev = document.getElementsByClassName( 'printSizePreview' )[ 0 ];
            domElems.editorImgPreview = document.getElementById( 'editorImgPreview' );
            domElems.editorSizePreview = document.getElementsByClassName( 'editorSizePreview' )[ 0 ];
            domElems.editorPrintSizePreview = document.getElementsByClassName( 'editorPrintSizePreview' )[ 0 ];
            domElems.canvasChosen = document.getElementsByClassName( 'canvasChosen' )[ 0 ];
            domElems.editImgBtn = document.querySelector( '.optsBtn[data-action="startEditor"]' );
            domElems.addToCartBtn = document.querySelector( '.optsBtn[data-action="termsAgree"]' );
            domElems.editImgCloseBtn = document.getElementsByClassName( 'hideEditor' )[ 0 ];
            domElems.gapLines = document.getElementsByClassName( 'gap' );
            domElems.finishLines = document.getElementsByClassName( 'finish' );
            domElems.mainLine = document.getElementsByClassName( 'mainArea' )[ 0 ];
            domElems.borderStyler = document.getElementsByClassName( 'borderStyler' )[ 0 ];
            domElems.borderStyleHolder = document.getElementsByClassName( 'borderStyleHolder' )[ 0 ];
            
            domElems.step1 = document.querySelector( '.mobileStep[data-step="1"]' );
            domElems.step2 = document.querySelector( '.mobileStep[data-step="2"]' );
            domElems.step3 = document.querySelector( '.mobileStep[data-step="3"]' );
            
            domElems.step1Loading = document.getElementById( 'loadS1' );
            
            domElems.content.addEventListener( eventTypes.click, contClick );
            domElems.content.addEventListener( eventTypes.touchend, contClick );
            window.addEventListener( eventTypes.resize, windowResize );
            
            
            if( opts.cartEditId ){
                util.cartEdit = JSON.parse( opts.cartEdit );
                util.cartEditId = opts.cartEditId;
                
                editExistingFile( util.cartEdit.imgSrc, util.cartEdit.uploadSrc );
            }
            
            if( domElems.uploadFileInput.disabled ){
                document.querySelector( '.uploadBtn[data-action="startUploadDevice"]' ).style.display = 'none';
            }
            
            if( utilFunct.getUrlParam( 'code' ) ){
                instagram.accessCode = utilFunct.getUrlParam( 'code' );
                domElems.uploadList.style.display = 'none';
                domElems.step1Loading.style.display = 'block';
                instagramUpload();
            }
            
            /* editor events */
            hammerTime = new Hammer(domElems.editorPrintSizePreview);
            hammerTime.get('pan').set({ direction: Hammer.DIRECTION_ALL });
            hammerTime.get('pinch').set({ enable: true });
            
            hammerTime.on('pan', handlePan);
            hammerTime.on('pinchstart', handlePinchStart);
            hammerTime.on('pinch', handlePinch);
            hammerTime.on('pinchend', handlePinchStart);
        };
    return{ init:init };
}();