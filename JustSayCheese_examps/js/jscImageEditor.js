var jscImageEditor = function(){
    
    var uploadBtns = { device:null, facebook:null, instagram:null, picassa:null, flikr:null, google:null },
        uploadBtnIDs = { device:'deviceUpload', facebook:'facebookUpload', instagram:'instagramUpload', picassa:'picassaUpload', flikr:'flikrUpload', google:'googleUpload' },
        util = { key:'', imgUploadID:'jscImgUpload', editorIDs:[ '1', '2', '3' ], i:0, k:0, returnData:null, client:null, uploadsDir:'./uploads/' },
        instagram = { container:null, selectedImg:null, accessToken:null, accessCode:null, clientID:'ee39118432ec4583a9ee7f2260aa0b5e', userInfo:null, redirectUrl:'https://justsaycheese.com/?pg=order&response_type=code' },
        facebook = { container:null, selectedImg:null },
        scripts = { uploadImg:'assets/php/jscImgEditor/uploadImg.php', uploadImgFromUrl:'assets/php/jscImgEditor/uploadImgFromUrl.php', uploadImgFromExisting:'assets/php/jscImgEditor/uploadImgFromExisting.php', instagramCode:'assets/php/jscImgEditor/instagramCode.php', flickrPhotos:'assets/php/jscImgEditor/flickrPhotos.php', rotateImage:'assets/php/jscImgEditor/rotateImage.php' },
        uploadProg = { progBar:null, percentTxt:null },
        imgUploaded = { uploadSrc:null, height:null, width:null, res:null, source:null },
        editToolOpts = { activeEditor:null, editAction:null, drag:false, dragTarg:null, dragSnap:1, orientation:'horiz', zoomInBtn:null, zoomOutBtn:null, zoomSlider:null, zoomMin:0, zoomMax:125, rotateUp:null, rotateDwn:null, rotateHalf:null, rotateVal:0, offsetX:null, offsetY:null, coordX:null, coordY:null, coordXf:null, coordYf:null, coordXs:null, coordYs:null, coordXt:null, coordYt:null },
        acceptedFileTypes = [ 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG' ],
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
        uploadProgress = function( evt ){
            var percent = (( evt.loaded / evt.total ) * 100).toFixed(2),
                perceTxt = percent+'%';
            uploadProg.percentTxt.innerHTML = perceTxt;
            TweenLite.to( uploadProg.progBar, animOpts.speed, { width:perceTxt, ease:animOpts.ease } );
        },
        readURL = function( file ){
            var reader = new FileReader(),
                targImg = document.getElementById( 'uploadPreview' );
            reader.onload = function( evt ){
                targImg.src = evt.target.result;
            }
            reader.readAsDataURL( file );
        },
        uploadComplete = function(){
            orderTool.setRoomView();
            orderTool.sizeFilter();
            orderTool.nextStep( imgUploaded );

            //mobilehack
            var uploadArea = document.querySelector('.uploadArea');
            uploadArea.className = uploadArea.className.replace(/mobileHide/, '' );
        },
        toggleFBselect = function( targElem ){
            var parentElem = targElem.parentNode,
                currActive = facebook.container.getElementsByClassName( 'active' )[0],
                imgSrc = parentElem.querySelector( 'img' ).dataset.src;
            if( currActive ){ currActive.className = currActive.className.replace(/\bactive\b/,''); }
            parentElem.className = ( parentElem.className.length > 0 ) ? parentElem.className+' active' : 'active';
            facebook.selectedImg = imgSrc;
        },
        toggleInstagramSelect = function( targElem ){
            var parentElem = targElem.parentNode,
                currActive = instagram.container.getElementsByClassName( 'active' )[0],
                imgSrc = parentElem.querySelector( 'img' ).dataset.src;
            if( currActive ){ currActive.className = currActive.className.replace(/\bactive\b/,''); }
            parentElem.className = ( parentElem.className.length > 0 ) ? parentElem.className+' active' : 'active';
            instagram.selectedImg = imgSrc;
        },
        loadFBimgs = function( targElem ){
            var scriptUrl = targElem.dataset.script,
                ajax = new XMLHttpRequest();
                
            ajax.open( 'GET', scriptUrl );
            ajax.onreadystatechange = function() {
                if( ajax.readyState == 4 && ajax.status == 200 ) {
                    var modalHTML = '',
                        imgSrc = '',
                        altTag = '',
                        dataSrc = '';
                    util.returnData = JSON.parse( ajax.responseText );
                    if( util.returnData.paging.next ){
                        targElem.dataset.script = util.returnData.paging.next;
                    }else{
                        var elemParent = targElem.parentNode;
                        elemParent.removeChild( targElem );
                    }
                    for( util.i = 0, util.k=util.returnData.data.length; util.i<util.k; util.i++ ){
                        imgSrc = util.returnData.data[ util.i ].source;
                        altTag = ( util.returnData.data[ util.i ].name ) ? util.returnData.data[ util.i ].name : 'User Photo';
                        dataSrc = util.returnData.data[ util.i ].images[0].source;
                        modalHTML += '<li><div class="selectedOverlay"></div><img src="'+imgSrc+'" alt="Facebook Image: '+altTag+'" data-src="'+dataSrc+'" /></li>';
                    }
                    facebook.container.innerHTML = facebook.container.innerHTML+modalHTML;
                }
            }
            ajax.send();
        },
        loadInstagramImgs = function( targElem ){
            var scriptUrl = targElem.dataset.script;
            
            $.ajax({
                type: "GET",
                dataType: "jsonp",
                cache: false,
                url: scriptUrl,
                success: function ( data ) {
                    var modalHTML = '',
                        imgSrc = '',
                        altTag = '',
                        dataSrc = '';
                    util.returnData = data;
                    
                    if( util.returnData.pagination.next_url ){
                        targElem.dataset.script = util.returnData.pagination.next_url;
                    }else{
                        var elemParent = targElem.parentNode;
                        elemParent.removeChild( targElem );
                    }
                    for( util.i = 0, util.k=util.returnData.data.length; util.i<util.k; util.i++ ){
                        imgSrc = util.returnData.data[ util.i ].images.thumbnail.url;
                        dataSrc = util.returnData.data[ util.i ].images.standard_resolution.url;
                        altTag = ( util.returnData.data[ util.i ].caption ) ? util.returnData.data[ util.i ].caption.text : 'User Photo';
                        modalHTML += '<li><div class="selectedOverlay"></div><img src="'+imgSrc+'" alt="Instagram Image: '+altTag+'" data-src="'+dataSrc+'" /></li>';
                    }
                    instagram.container.innerHTML = instagram.container.innerHTML+modalHTML;
                }
            });
        
        },
        uploadFBimg = function( targ ){
            if( facebook.selectedImg == null ){ return ; }
            var formData = new FormData(),
                ajax = new XMLHttpRequest();
                
            formData.append( 'imgUrl', facebook.selectedImg );
            formData.append( 'uploadFrom', 'facebook' );
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
            if( instagram.selectedImg == null ){ return ; }
            var formData = new FormData(),
                ajax = new XMLHttpRequest();
                
            formData.append( 'imgUrl', instagram.selectedImg );
            formData.append( 'uploadFrom', 'instagram' );
            //targ.className = targ.className+' disabled';
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
        facebookModalClick = function( evt ){
            var targElem = evt.target;
            if( targElem.className.match(/\bselectedOverlay\b/) ){ 
                toggleFBselect( targElem );
                uploadFBimg( targElem );
             }else if( targElem.className.match(/\bviewMoreFacebook\b/) ){
                 loadFBimgs( targElem );
             }else if( targElem.className.match(/\bchooseImage\b/) && !targElem.className.match(/\bdisabled\b/) ){
                 uploadFBimg( targElem );
             }else{
                 return ;
             }
        },
        instagramModalClick = function( evt ){
            var targElem = evt.target;
            if( targElem.className.match(/\bselectedOverlay\b/) ){ 
                toggleInstagramSelect( targElem );
                uploadInstagramImg( targElem );
             }else if( targElem.className.match(/\bviewMoreInstagram\b/) ){
                 loadInstagramImgs( targElem );
             }else if( targElem.className.match(/\bchooseImage\b/) && !targElem.className.match(/\bdisabled\b/) ){
                 uploadInstagramImg( targElem );
             }else{
                 return ;
             }
             
        }
        deviceUpload = function(){
            var modalHTML = '<div class="deviceUploadContent"><div id="uploadHolder"><div id="'+util.imgUploadID+'"></div><div class="modalBtns"><div id="jscUploadInputBtn" class="button modalBtn dark bRadMD">Choose File</div><div id="supportedInfo"><br/><ol><li>Max file size is 50mb</li><li>File Types allowed are .jpg and .png</li><li>Rotate your image to the proper orientation prior to uploading.</li></ol></div></div><input id="jscUploadInput" type="file" /></div><div id="uploadPevHolder"><div class="imgHolder"><img src="#" id="uploadPreview" /></div><div class="uploadProgress bRadLG" id="uploadProgress"><div class="uploadProgressBar" id="uploadProgressBar"></div></div><div class="uploadProgText"><div class="uploadFileName">Uploading: <span id="uploadFileName"></span></div><div class="uploadFileProg"><span id="uploadPercentComplete">0%</span> of <span id="uploadFileSize"></span>kB</div></div></div></div>',
                formData = new FormData(),
                ajax = new XMLHttpRequest();
            /* open modal and set ajax events */
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
            modalHandler.showModal( 'default', modalHTML );
            
            var uploadArea = document.getElementById( util.imgUploadID ),
                uploadBtn = document.getElementById( 'jscUploadInputBtn' ),
                uploadInput = document.getElementById( 'jscUploadInput' ),
                uploadProgName = document.getElementById( 'uploadFileName' ),
                uploadProgSize = document.getElementById( 'uploadFileSize' ),
                uploadHolder = document.getElementById( 'uploadHolder' ),
                progHolder = document.getElementById( 'uploadPevHolder' );
                
            uploadProg.progBar = document.getElementById( 'uploadProgressBar' );
            uploadProg.percentTxt = document.getElementById( 'uploadPercentComplete' );
            /* add drag/drop file upload */
            uploadArea.addEventListener( eventTypes.dragover, function( evt ) {
                if (evt.preventDefault){ evt.preventDefault(); }
                if (evt.stopPropagation){ evt.stopPropagation(); }
                evt.dataTransfer.dropEffect = 'copy';
            } );
            
            uploadArea.addEventListener( eventTypes.dragenter, function( evt ) {
                this.className = "over";
            } );
            
            uploadArea.addEventListener( eventTypes.dragleave, function( evt ) {
                this.className = "";
            } );
            
            uploadArea.addEventListener( eventTypes.drop, function( evt ) {
                if (evt.preventDefault){ evt.preventDefault(); }
                if (evt.stopPropagation){ evt.stopPropagation(); }
                
                this.className = "";
                var fileList = evt.dataTransfer.files,
                    fileNameSplit = fileList[0].name.split('.');
                
                /* if file dropped is acceptable then set uploadProg text and upload */
                if( fileList.length > 0 && validFileType( fileNameSplit[ fileNameSplit.length-1 ] ) ) {
                    uploadProgName.innerHTML = fileList[0].name;
                    uploadProgSize.innerHTML = (fileList[0].size/1000).toFixed(2);
                    readURL( fileList[0] );
                    formData.append( 'jscImage', fileList[0] );
                    /* show prog bar */
                    uploadHolder.style.display = 'none';
                    progHolder.style.display = 'block';
                    ajax.send( formData );
                }
            } );
            
            /* upload file click events */
            uploadInput.addEventListener( eventTypes.change, function(){
                var fileList = uploadInput.files,
                    fileNameSplit = fileList[0].name.split('.');
                /* if file chosen through input is acceptable then set uploadProg text and upload */
                if( fileList.length > 0 && validFileType( fileNameSplit[ fileNameSplit.length-1 ] ) ) {
                    uploadProgName.innerHTML = fileList[0].name;
                    uploadProgSize.innerHTML = (fileList[0].size/1000).toFixed(2);
                    readURL( fileList[0] );
                    formData.append( 'jscImage', fileList[0] );
                    /* show prog bar */
                    uploadHolder.style.display = 'none';
                    progHolder.style.display = 'block';
                    ajax.send(formData);
                }
            } );
            
            uploadBtn.addEventListener( eventTypes.click, function(){
                uploadInput.click();
            } );
        },
        facebookUpload = function(){
            var modalHTML = '<h2>Device Upload</h2>';
            FB.login( function( response ){
                FB.api(
                    'me/photos/uploaded',
                    function( response ){
                        if( response && !response.error ){
                            /* photos are in response */
                            var modalHTML = '<ul class="facbookPicList">',
                                imgSrc = '',
                                dataSrc = '',
                                altTag = '',
                                viewMoreBtn = ( response.paging.next ) ? '<div class="viewMoreFacebook button modalBtn dark bRadMD" data-script="'+response.paging.next+'">View More</div>' : '';
                            if( response.data.length === 0 ){
                                modalHTML += '<li class="noSocial">You have no Facebook photos.</li>'
                            }else{
                                for( util.i = 0, util.k=response.data.length; util.i<util.k; util.i++ ){
                                    imgSrc = response.data[ util.i ].source;
                                    dataSrc = response.data[ util.i ].images[0].source;
                                    altTag = ( response.data[ util.i ].name ) ? response.data[ util.i ].name : 'User Photo';
                                    modalHTML += '<li><div class="selectedOverlay"></div><img src="'+imgSrc+'" alt="Facebook Image: '+altTag+'" data-src="'+dataSrc+'" /></li>';
                                }
                            }
                            /*modalHTML += '</ul><div class="modalBtns">'+viewMoreBtn+'<div class="chooseImage button modalBtn dark">Choose Image</div></div>';*/
                            modalHTML += '</ul><div class="modalBtns">'+viewMoreBtn+'</div>';
                            modalHandler.showModal( 'default', modalHTML );
                            var modalContent = document.querySelector( '.modal[data-modalid="default"] .modalContent' );
                            facebook.container = document.querySelector( '.modal[data-modalid="default"] .facbookPicList' );
                            modalContent.addEventListener( eventTypes.click, facebookModalClick );
                        }
                    }
                );
            }, { scope:'email,user_photos' } );
        },
        instagramUpload = function(){
            if( instagram.accessCode !== null ){
                var ajax = new XMLHttpRequest(),
                    formData = new FormData(),
                    modalHTML = '<ul class="instagramPicList">';
                formData.append( 'code', instagram.accessCode );
                ajax.open( 'POST', scripts.instagramCode );
                ajax.onreadystatechange = function() {
                    if( ajax.readyState == 4 && ajax.status == 200 ) {
                        util.returnData = JSON.parse( ajax.responseText );
                        instagram.accessToken = util.returnData.access_token;
                        instagram.userInfo = util.returnData.user;
                        
                        
                        /* GET USER IMAGES this can be done better so you should do it better */
                        if( instagram.userInfo == null ){
                            window.location.href = './?pg=order';
                        }
                        var instUrl = "https://api.instagram.com/v1/users/"+instagram.userInfo.id+"/media/recent/?access_token="+instagram.accessToken+"&callback=instagramCallback";

                        $.ajax({
                          type: "GET",
                          dataType: "jsonp",
                          cache: false,
                          url: instUrl,
                          success: function (data) {
                            util.returnData = data;
                            var imgSrc = '',
                                dataSrc = '',
                                altTag = '',
                                viewMoreBtn = ( util.returnData.pagination.next_url ) ? '<div class="viewMoreInstagram button modalBtn bRadMD dark" data-script="'+util.returnData.pagination.next_url+'">View More</div>' : '';
                                
                                if( util.returnData.data.length === 0 ){
                                    modalHTML += '<li class="noSocial">You have no Instagram photos.</li>'
                                }else{
                                    for( util.i = 0, util.k = util.returnData.data.length; util.i<util.k; util.i++ ){
                                        imgSrc = util.returnData.data[ util.i ].images.thumbnail.url;
                                        dataSrc = util.returnData.data[ util.i ].images.standard_resolution.url;
                                        altTag = ( util.returnData.data[ util.i ].caption ) ? util.returnData.data[ util.i ].caption.text : 'User Photo';
                                        modalHTML += '<li><div class="selectedOverlay"></div><img src="'+imgSrc+'" alt="Instagram Image: '+altTag+'" data-src="'+dataSrc+'" /></li>';
                                    }
                                }
                            /*modalHTML += '</ul><div class="modalBtns">'+viewMoreBtn+'<div class="chooseImage button modalBtn dark">Choose Image</div></div>';*/
                            modalHTML += '</ul><div class="modalBtns">'+viewMoreBtn+'</div>';
                            modalHandler.showModal( 'default', modalHTML );
                            var modalContent = document.querySelector( '.modal[data-modalid="default"] .modalContent' );
                            instagram.container = document.querySelector( '.modal[data-modalid="default"] .instagramPicList' );
                            modalContent.addEventListener( eventTypes.click, instagramModalClick );
                          }
                        });

                        /*
                        ajax.open( 'GET', 'https://api.instagram.com/v1/users/'+instagram.userInfo.id+'/media/recent/?access_token='+instagram.accessToken+'&callback=instagramCallback' );
                        ajax.onreadystatechange = function() {
                            if( ajax.readyState == 4 && ajax.status == 200 ) {
                                util.returnData = JSON.parse( ajax.responseText );
                                
                                /*
                                
                            }
                        }
                        ajax.send();
                        */
                    }
                }
                ajax.send( formData  );
                
            }else{
                window.location.href = 'https://api.instagram.com/oauth/authorize/?client_id='+instagram.clientID+'&redirect_uri='+instagram.redirectUrl;
            }
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
        picassaUpload = function(){
            
        },
        flikrUpload = function(){
            
        },
        googleUpload = function(){
            
        },
        setEvents = function(){
            
            /* click events for upload buttons */
            for( util.key in uploadBtns ){
                if( uploadBtns[ util.key ] !== null ){
                    switch( util.key ){
                        case 'device':
                            uploadBtns[ util.key ].addEventListener( eventTypes.click, deviceUpload );
                            break;
                        case 'facebook':
                            uploadBtns[ util.key ].addEventListener( eventTypes.click, facebookUpload );
                            break;
                        case 'instagram':
                            uploadBtns[ util.key ].addEventListener( eventTypes.click, instagramUpload );
                            break;
                        case 'picassa':
                            uploadBtns[ util.key ].addEventListener( eventTypes.click, picassaUpload );
                            break;
                        case 'flikr':
                            uploadBtns[ util.key ].addEventListener( eventTypes.click, flikrUpload );
                            break;
                        case 'google':
                            uploadBtns[ util.key ].addEventListener( eventTypes.click, googleUpload );
                            break;
                        default:
                            uploadBtns[ util.key ].addEventListener( eventTypes.click, deviceUpload );
                    }
                }
            }
            
        },
        setupPrintArea = function( editorHolderDom ){
            var editArea = editorHolderDom.querySelector( '.editArea' ),
                editImg = editorHolderDom.querySelector( '.editArea img' ),
                mainArea = editorHolderDom.querySelector( '.printArea .mainArea' ),
                margin = { height: 80, width: 80 },
                maxHeight = editorHolderDom.clientHeight - margin.height,
                maxWidth = editorHolderDom.clientWidth - margin.width,
                canvasSize = orderTool.canvasInfo.size.split( 'x' ),
                canvasSizeMax = ( canvasSize[0] > canvasSize[1] ) ? canvasSize[0] : canvasSize[1],
                canvasSizeMin = ( canvasSize[0] > canvasSize[1] ) ? canvasSize[1] : canvasSize[0],
                canvasWidth = ( orderTool.canvasInfo.orient === 'horiz' ) ? canvasSizeMax : canvasSizeMin,
                canvasHeight = ( orderTool.canvasInfo.orient === 'horiz' ) ? canvasSizeMin : canvasSizeMax;
                
            
            editArea.style.width = size.w+'px';
            editArea.style.height = size.h+'px';
            
            editImg.src = util.uploadsDir+imgUploaded.uploadSrc;
            editorHolderDom.dataset.orient = orderTool.canvasInfo.orient;
            editorHolderDom.dataset.size = orderTool.canvasInfo.size;
        },
        setSnapPos = function( targImg ){
            var currLeft = ( targImg.style.left ) ? parseInt( targImg.style.left ) : 0;
                currTop = ( targImg.style.top ) ? parseInt( targImg.style.top ) : 0,
                borderStylerDom = editToolOpts.activeEditor.getElementsByClassName( 'borderStyler' )[0],
                minLeft = ( orderTool.util.step.tab === 'splitTab' ) ? (borderStylerDom.offsetWidth*3)-targImg.offsetWidth : borderStylerDom.offsetWidth-targImg.offsetWidth,
                minTop = borderStylerDom.offsetHeight-targImg.offsetHeight,
                imgF = ( orderTool.util.step.tab === 'splitTab' ) ? document.querySelector( '.canvasEditor[data-editor="'+util.editorIDs[ 0 ]+'"] img' ) : null,
                imgS = ( orderTool.util.step.tab === 'splitTab' ) ? document.querySelector( '.canvasEditor[data-editor="'+util.editorIDs[ 1 ]+'"] img' ) : null,
                imgT = ( orderTool.util.step.tab === 'splitTab' ) ? document.querySelector( '.canvasEditor[data-editor="'+util.editorIDs[ 2 ]+'"] img' ) : null;

                if( orderTool.util.step.tab === 'splitTab' ){
                    currLeft = parseInt(imgF.style.left);
                }
                /* snap to editor sides */
                //console.log(editToolOpts.activeEditor.getElementsByClassName( 'borderStyler' )[0]);
                //console.log( 'borderStyle: '+borderStylerDom.offsetWidth+' tarImg: '+targImg.offsetWidth );
                //console.log( currLeft+' > 0 :'+(currLeft > 0) );
                //console.log( currLeft+' < '+minLeft+': '+(currLeft < minLeft) );
                
                if( currLeft > 0 ){
                    if( orderTool.util.step.tab === 'splitTab' ){
                        TweenLite.to( imgF, animOpts.speed, { left:-( orderTool.util.editorCanvSize*(parseInt(util.editorIDs[ 0 ])-1) )+'px', ease:animOpts.ease } );
                        TweenLite.to( imgS, animOpts.speed, { left:-( orderTool.util.editorCanvSize*(parseInt(util.editorIDs[ 1 ])-1) )+'px', ease:animOpts.ease } );
                        TweenLite.to( imgT, animOpts.speed, { left:-( orderTool.util.editorCanvSize*(parseInt(util.editorIDs[ 2 ])-1) )+'px', ease:animOpts.ease } );
                    }else{
                        TweenLite.to( targImg, animOpts.speed, { left:'0px', ease:animOpts.ease } );
                    }
                }else if( currLeft < minLeft ){
                    if( orderTool.util.step.tab === 'splitTab' ){
                        TweenLite.to( imgF, animOpts.speed, { left:( minLeft + -( orderTool.util.editorCanvSize*(parseInt(util.editorIDs[ 0 ])-1) ) )+'px', ease:animOpts.ease } );
                        TweenLite.to( imgS, animOpts.speed, { left:( minLeft + -( orderTool.util.editorCanvSize*(parseInt(util.editorIDs[ 1 ])-1) ) )+'px', ease:animOpts.ease } );
                        TweenLite.to( imgT, animOpts.speed, { left:( minLeft + -( orderTool.util.editorCanvSize*(parseInt(util.editorIDs[ 2 ])-1) ) )+'px', ease:animOpts.ease } );
                    }else{
                        TweenLite.to( targImg, animOpts.speed, { left:minLeft+'px', ease:animOpts.ease } );
                    }
                }
            
                if( currTop > 0 ){
                    if( orderTool.util.step.tab === 'splitTab' ){
                        TweenLite.to( imgF, animOpts.speed, { top:'0px', ease:animOpts.ease } );
                        TweenLite.to( imgS, animOpts.speed, { top:'0px', ease:animOpts.ease } );
                        TweenLite.to( imgT, animOpts.speed, { top:'0px', ease:animOpts.ease } );
                    }else{
                        TweenLite.to( targImg, animOpts.speed, { top:'0px', ease:animOpts.ease } );
                    }
                }else if( currTop < minTop ){
                    if( orderTool.util.step.tab === 'splitTab' ){
                        TweenLite.to( imgF, animOpts.speed, { top:minTop+'px', ease:animOpts.ease } );
                        TweenLite.to( imgS, animOpts.speed, { top:minTop+'px', ease:animOpts.ease } );
                        TweenLite.to( imgT, animOpts.speed, { top:minTop+'px', ease:animOpts.ease } );
                    }else{
                        TweenLite.to( targImg, animOpts.speed, { top:minTop+'px', ease:animOpts.ease } );
                    }
                }
        },
        setImgZoom = function(){
            var targImg = editToolOpts.activeEditor.querySelector( 'img' ),
                leftPos = parseInt(editToolOpts.zoomSlider.style.left),
                percentVal = ( orderTool.util.step.tab === 'splitTab' && targImg.dataset.sizeby === 'width' ) ? 300 : 100,
                scalePercent = ( leftPos/editToolOpts.zoomMax )*100,
                imgF = ( orderTool.util.step.tab === 'splitTab' ) ? document.querySelector( '.canvasEditor[data-editor="'+util.editorIDs[ 0 ]+'"] img' ) : null,
                imgS = ( orderTool.util.step.tab === 'splitTab' ) ? document.querySelector( '.canvasEditor[data-editor="'+util.editorIDs[ 1 ]+'"] img' ) : null,
                imgT = ( orderTool.util.step.tab === 'splitTab' ) ? document.querySelector( '.canvasEditor[data-editor="'+util.editorIDs[ 2 ]+'"] img' ) : null;
                
            if( orderTool.util.step.tab === 'splitTab' ){
                if( targImg.dataset.sizeby === 'width' ){
                    imgF.style.height = 'auto';
                    imgF.style.width = percentVal+parseFloat( scalePercent )+'%';
                    
                    imgS.style.height = 'auto';
                    imgS.style.width = percentVal+parseFloat( scalePercent )+'%';
                    
                    imgT.style.height = 'auto';
                    imgT.style.width = percentVal+parseFloat( scalePercent )+'%';
                }else{
                    imgF.style.height = percentVal+parseFloat( scalePercent )+'%';
                    imgF.style.width = 'auto';
                    
                    imgS.style.height = percentVal+parseFloat( scalePercent )+'%';
                    imgS.style.width = 'auto';
                    
                    imgT.style.height = percentVal+parseFloat( scalePercent )+'%';
                    imgT.style.width = 'auto';
                }
            }else{
                if( targImg.dataset.sizeby === 'width' ){
                    targImg.style.height = 'auto';
                    targImg.style.width = percentVal+parseFloat( scalePercent )+'%';
                }else{
                    targImg.style.height = percentVal+parseFloat( scalePercent )+'%';
                    targImg.style.width = 'auto';
                }
            }
            
            var editorActive = parseInt( editToolOpts.activeEditor.dataset.editoractive );
            if( editToolOpts.dragSnap && editorActive ){
                setSnapPos( targImg );
            }
        },
        setImgRotate = function(){
            var targImg = editToolOpts.activeEditor.querySelector( 'img' ),
                leftPos = parseInt(editToolOpts.rotateSlider.style.left),
                scalePercent = ( leftPos/editToolOpts.rotateMax ),
                rotateVal = 360*scalePercent;
            targImg.style.transform = 'rotate('+rotateVal+'deg)';
        },
        resetImg = function(){
            var targImg = editToolOpts.activeEditor.querySelector( 'img' );
            targImg.removeAttribute('style');
            editToolOpts.zoomSlider.style.left = '0px';
        },
        startDrag = function( evt ){
            var targ = evt.target,
                action = targ.dataset.action,
                pNode = targ.parentNode.parentNode;

            //editToolOpts.dragTarg = this.querySelector( 'img' );
            if( action === 'zoomSlide' ){
                editToolOpts.dragTarg = evt.target;
                editToolOpts.editAction = 'zoom';
            }else if( action === 'rotateSlide' ){
                editToolOpts.dragTarg = evt.target;
                editToolOpts.editAction = 'rotate';
            }else if( pNode && pNode.className.match(/\bcanvasEditor\b/) ){
                editToolOpts.dragTarg = pNode.querySelector( 'img' );
                editToolOpts.editAction = 'move';
                if( orderTool.util.step.tab === 'splitTab' ){
                    var currID = $(editToolOpts.dragTarg).closest('.canvasEditor').attr('data-editor'),
                        idLeft = 0,
                        idTop = 0,
                        newIdLeft = 0,
                        newIdTop = 0;
                    editToolOpts.coordXf = parseInt( $('.canvasEditor[data-editor="'+util.editorIDs[ 0 ]+'"] img').css('left') );
                    editToolOpts.coordYf = parseInt( $('.canvasEditor[data-editor="'+util.editorIDs[ 0 ]+'"] img').css('top') );
                    editToolOpts.coordXs = parseInt( $('.canvasEditor[data-editor="'+util.editorIDs[ 1 ]+'"] img').css('left') );
                    editToolOpts.coordYs = parseInt( $('.canvasEditor[data-editor="'+util.editorIDs[ 1 ]+'"] img').css('top') );
                    editToolOpts.coordXt = parseInt( $('.canvasEditor[data-editor="'+util.editorIDs[ 2 ]+'"] img').css('left') );
                    editToolOpts.coordYt = parseInt( $('.canvasEditor[data-editor="'+util.editorIDs[ 2 ]+'"] img').css('top') );
                }
            }else{
                editToolOpts.editAction = null;
                return ;
            }
            if(!editToolOpts.dragTarg.style.left){ editToolOpts.dragTarg.style.left="0px"; }
            if(!editToolOpts.dragTarg.style.top && editToolOpts.editAction === 'move'){ editToolOpts.dragTarg.style.top="0px"; }
            
            editToolOpts.offsetX = evt.clientX;
            editToolOpts.offsetY = evt.clientY;
            
            editToolOpts.coordX = parseInt( editToolOpts.dragTarg.style.left );
            editToolOpts.coordY = parseInt( editToolOpts.dragTarg.style.top );
            
            editToolOpts.drag = true;
        },
        endDrag = function( evt ){
            var editorActive = parseInt( editToolOpts.activeEditor.dataset.editoractive );
                
            if( editToolOpts.dragSnap && editToolOpts.editAction === 'move' && editorActive ){
                setSnapPos( editToolOpts.dragTarg );
            }
            
            editToolOpts.editAction = null;
            editToolOpts.drag = false;
        },
        dragElem = function( evt ){
            var editorActive = parseInt( editToolOpts.activeEditor.dataset.editoractive );
            if( !editToolOpts.drag || !editorActive ){ return ; }
            var currLeft = editToolOpts.coordX+evt.clientX-editToolOpts.offsetX,
                currTop = editToolOpts.coordY+evt.clientY-editToolOpts.offsetY;
                
            if( currLeft < editToolOpts.zoomMin && editToolOpts.editAction === 'zoom' ){
                currLeft = editToolOpts.zoomMin;
            }else if( currLeft > editToolOpts.zoomMax && editToolOpts.editAction === 'zoom' ){
                currLeft = editToolOpts.zoomMax;
            }else if( currLeft < editToolOpts.rotateMin && editToolOpts.editAction === 'rotate' ){
                currLeft = editToolOpts.rotateMin;
            }else if( currLeft > editToolOpts.rotateMax && editToolOpts.editAction === 'rotate' ){
                currLeft = editToolOpts.rotateMax;
            }
            
            if( orderTool.util.step.tab === 'splitTab' && editToolOpts.editAction === 'move' ){
                $('.canvasEditor[data-editor="'+util.editorIDs[ 0 ]+'"] img').css({
                    left:editToolOpts.coordXf+evt.clientX-editToolOpts.offsetX,
                    top:editToolOpts.coordYf+evt.clientY-editToolOpts.offsetY
                });
                $('.canvasEditor[data-editor="'+util.editorIDs[ 1 ]+'"] img').css({
                    left:editToolOpts.coordXs+evt.clientX-editToolOpts.offsetX,
                    top:editToolOpts.coordYs+evt.clientY-editToolOpts.offsetY
                });
                $('.canvasEditor[data-editor="'+util.editorIDs[ 2 ]+'"] img').css({
                    left:editToolOpts.coordXt+evt.clientX-editToolOpts.offsetX,
                    top:editToolOpts.coordYt+evt.clientY-editToolOpts.offsetY
                });
            }else{
                editToolOpts.dragTarg.style.left = currLeft+'px';
                //console.log('jscImgEdit: '+currLeft)
            
                if( editToolOpts.editAction === 'move' ){
                    editToolOpts.dragTarg.style.top = currTop+'px';
                }else if( editToolOpts.editAction === 'zoom' ){
                    setImgZoom();
                }else if( editToolOpts.editAction === 'rotate' ){
                    setImgRotate();
                }
            }
            return false;
        },
        zoomClick = function( evt ){
            var zoomAction = this.dataset.action,
                leftPos = parseInt(editToolOpts.zoomSlider.style.left),
                incAmt = 5,
                currLeft = ( zoomAction === 'zoomIn' ) ? leftPos+incAmt : leftPos-incAmt;
            if( currLeft <= editToolOpts.zoomMin ){
                currLeft = editToolOpts.zoomMin;
            }else if( currLeft >= editToolOpts.zoomMax ){
                currLeft = editToolOpts.zoomMax;
            }
            editToolOpts.zoomSlider.style.left = currLeft+'px';
            setImgZoom();
        },
        rotateClick = function( evt ){
            var rotateAction = this.dataset.action,
                targImg = editToolOpts.activeEditor.querySelector( 'img' ),
                formData = new FormData(),
                ajax = new XMLHttpRequest(),
                date = new Date();
            /*if( rotateAction === 'rotateDwn90' ){
                editToolOpts.rotateVal = editToolOpts.rotateVal - 90;
            }else if( rotateAction === 'rotateUp90' ){
                editToolOpts.rotateVal = editToolOpts.rotateVal + 90;
            }else if( rotateAction === 'rotate180' ){
                editToolOpts.rotateVal = editToolOpts.rotateVal + 180;
            }
                
            if( editToolOpts.rotateVal >= 360 || editToolOpts.rotateVal <= (-360) ){
                editToolOpts.rotateVal = 0;
            }
            */
            
            if( rotateAction === 'rotateDwn90' ){
                editToolOpts.rotateVal = (-90);
            }else if( rotateAction === 'rotateUp90' ){
                editToolOpts.rotateVal = 90;
            }else if( rotateAction === 'rotate180' ){
                editToolOpts.rotateVal = 180;
            }
            formData.append( 'imgSrc', imgUploaded.uploadSrc );
            formData.append( 'rotateVal', editToolOpts.rotateVal );
            ajax.open( 'POST', scripts.rotateImage, false );
            ajax.onreadystatechange = function() {
                if( ajax.readyState == 4 && ajax.status == 200 ) {
                    //util.returnData = JSON.parse( ajax.responseText );
                    targImg.src = util.uploadsDir+imgUploaded.uploadSrc+'?'+date.getTime();
                }
            }
            ajax.send( formData );
            
            //targImg.style.transform = 'rotate('+editToolOpts.rotateVal+'deg)';
        },
        editToolInit = function( opts ){
            /* take options sent by user and update */
             for( util.key in opts ){
                 editToolOpts[ util.key ] = opts[ util.key ];
             }
             //setupPrintArea( editToolOpts.activeEditor );
             
             /* SET UP EDIT ACTIONS */
             editToolOpts.zoomInBtn.addEventListener( eventTypes.click, zoomClick );
             editToolOpts.zoomOutBtn.addEventListener( eventTypes.click, zoomClick );
             
             /*editToolOpts.rotateUp.addEventListener( eventTypes.click, rotateClick );
             editToolOpts.rotateDwn.addEventListener( eventTypes.click, rotateClick );
             editToolOpts.rotateHalf.addEventListener( eventTypes.click, rotateClick );*/
            /*Touchscreen event conversion
            if ('ontouchstart' in window) {
                eventTypes.mouseDown = 'touchstart';
                eventTypes.mouseUp = 'touchend';
                eventTypes.mouseMove = 'touchmove';

            }
            */
             
             document.addEventListener( eventTypes.mouseDown, startDrag );
             document.addEventListener( eventTypes.mouseUp, endDrag );
             document.addEventListener( eventTypes.mouseMove, dragElem );
        },
        init = function( opts ){
            
            /* if user is edit their cart item 
            if( opts.cartEdit ){
                var editItem = JSON.parse( opts.cartEdit );
                //console.log(editItem)
                editExistingFile( editItem.imgSrc, editItem.uploadSrc );
                orderTool.goToProcess( 'singleCanvas' );
            }

            */
            
            /* place all upload buttons in an object */
            /*for( util.key in uploadBtnIDs ){
                uploadBtns[ util.key ] = document.getElementById( uploadBtnIDs[ util.key ] );
            }*/
            
            /* set image editor events 
            setEvents();*/
            
            /* check for access token - instagram 
            instagram.accessCode = getUrlParam( 'code' );
            if( instagram.accessCode ){
                instagramUpload();
            }*/
            
            /* check for client - flickr 
            util.client = getUrlParam( 'client' );
            if( util.client === 'flickr' ){
                flikrUpload();
            }*/
        };
    
    return{ init:init, deviceUpload:deviceUpload, facebookUpload:facebookUpload, instagramUpload:instagramUpload, imgUploaded:imgUploaded, setupPrintArea:setupPrintArea, resetImg:resetImg, editToolInit:editToolInit, editToolOpts:editToolOpts, instagram:instagram, setSnapPos:setSnapPos, editExistingFile:editExistingFile };
    
}();