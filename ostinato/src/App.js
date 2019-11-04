import React, {Component} from 'react';
import Header from './Header';
import AddVideo from './AddVideo';
import VidEditor from './VidEditor';
let loadYT

class App extends Component {
  constructor(props){
    super(props);
    let localStorageActive = false
    let storageVidList = false
    if (this.storageAvailable('localStorage')) {
      localStorageActive = true;
      storageVidList = JSON.parse(localStorage.getItem('ostinatoVideoList'));
    }

    this.state = {
      localStorageActive: localStorageActive,
      activeVideo: false,
      ytPlayer: false,
      ytScript: false,
      videoIsPlaying: false,
      invalidUserLink: false,
      playLoopCount: 0,
      deleteCountdown: 0,
      deleteCountdownTarget: 850,
      minDeleteCountdownDisplay: 120,
      vidList: (storageVidList) ? storageVidList : []
    }
  }

  addNewVideo = event => {
    let match = event.target.value.match(/^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?v(?:i)?=|v(?:i)?=))([^#]*).*/)

    if(match && match[1]){
      let newVidList = JSON.parse(JSON.stringify(this.state.vidList))
      let newVidId = newVidList.length
      newVidList.push({
        id: newVidId,
        name: 'New vid',
        ytId: match[1],
        activeLoop: 0,
        loopList: [
          {
            id: 0,
            name: 'Loop Name',
            delay: 0,
            loopForever: false,
            loopCount: 5,
            startTime:{
              hour: 0,
              minute: 0,
              second: 1
            },
            endTime:{
              hour: 0,
              minute: 0,
              second: 3
            }
          }
        ]
      });
      this.setState({invalidUserLink: false})
      this.setState({vidList:newVidList})
      this.setState({activeVideo:newVidId})
      this.storeVidList();
    }else{
      this.setState({invalidUserLink: true});
    }

    
  }

  storeVidList = () => {
    if(this.state.localStorageActive){
      localStorage.setItem('ostinatoVideoList', JSON.stringify(this.state.vidList));
    }
  }

  setActiveVideo = newActiveVideoId => {
    this.setState({activeVideo: newActiveVideoId});
  }

  updatedVideoName = event => {
    let newVidList = JSON.parse(JSON.stringify(this.state.vidList));
    newVidList[this.state.activeVideo].name = event.target.value;
    this.setState({vidList:newVidList});
    this.storeVidList();
  }

  updateLoopTime = (event, isStartTime, timeType) => {
    let newVidList = JSON.parse(JSON.stringify(this.state.vidList));
    let activeLoopId = this.state.vidList[this.state.activeVideo].activeLoop;
    let timeFrame = isStartTime ? 'startTime' : 'endTime';
    newVidList[this.state.activeVideo].loopList[activeLoopId][timeFrame][timeType] = parseInt(event.target.value);
    
    this.stopVideo();
    this.resetPlayLoopCount();
    this.setState({vidList:newVidList});
    this.storeVidList();
  }

  updateLoopName = event => {
    let newVidList = JSON.parse(JSON.stringify(this.state.vidList));
    let activeLoopId = this.state.vidList[this.state.activeVideo].activeLoop;
    newVidList[this.state.activeVideo].loopList[activeLoopId].name = event.target.value;
  }

  updateDelay = event => {
    this.stopVideo();
    this.resetPlayLoopCount();

    this.setState({
      vidList: this.state.vidList.map(vid =>{
        
        if(vid.id === this.state.activeVideo){
          vid.loopList[vid.activeLoop].delay = parseInt(event.target.value, 10);
        }
        return vid;
      })
    })
    this.storeVidList();
  }

  updateLoopCount = event => {
    this.stopVideo();
    this.resetPlayLoopCount();

    this.setState({
      vidList: this.state.vidList.map(vid =>{
        
        if(vid.id === this.state.activeVideo){
          vid.loopList[vid.activeLoop].loopCount = parseInt(event.target.value, 10);
        }
        return vid;
      })
    })
    this.storeVidList();
  }

  changeLoopType = loopForever => {
    this.stopVideo();
    this.resetPlayLoopCount();

    this.setState({
      vidList: this.state.vidList.map(vid =>{
        
        if(vid.id === this.state.activeVideo){
          vid.loopList[vid.activeLoop].loopForever = loopForever;
        }
        return vid;
      })
    })
    this.storeVidList();
  }

  addNewLoop = () => {
    let newVidList = JSON.parse(JSON.stringify(this.state.vidList));
    let addNewLoopId = newVidList[this.state.activeVideo].loopList.length;
    let fauxLoop = {
            id: addNewLoopId,
            name: 'Loop '+addNewLoopId,
            delay: 0,
            loopForever: false,
            loopCount: 1,
            startTime:{
              hour: 0,
              minute: 0,
              second: 1
            },
            endTime:{
              hour: 0,
              minute: 0,
              second: 3
            }
          };

    newVidList[this.state.activeVideo].loopList.push(fauxLoop);
    this.setState({vidList:newVidList});
    this.storeVidList();
  }

  changeActiveLoop = newActiveLoopId => {
    let newVidList = JSON.parse(JSON.stringify(this.state.vidList));
    let activeLoopId = this.getActiveLoopId();

    if(activeLoopId !== newActiveLoopId){
      newVidList[this.state.activeVideo].activeLoop = newActiveLoopId;
      this.setState({vidList:newVidList});
      this.stopVideo();
      this.resetPlayLoopCount();
    }
    this.storeVidList();
  }

  getActiveLoopId = () => {
    let activeLoopId = this.state.vidList[this.state.activeVideo].activeLoop

    return activeLoopId
  }

  deleteActiveLoop = () => {
    if (window.confirm('Are you sure you wish to delete this item?')){
      let newVidList = JSON.parse(JSON.stringify(this.state.vidList))
      let activeLoopId = this.getActiveLoopId()
      let activeVideoLoopList = newVidList[this.state.activeVideo].loopList
      activeVideoLoopList.splice(activeLoopId, 1)
      activeVideoLoopList = this.arrayKeyToObjId(activeVideoLoopList)

      newVidList[this.state.activeVideo].loopList = activeVideoLoopList
      this.setState({vidList:newVidList})
      this.storeVidList();
    }
  }

  arrayKeyToObjId = (arrayOfObjs) =>{
    arrayOfObjs.map((obj, index)=>{
      obj.id = index
      return obj
    })
    return arrayOfObjs
  }

  startPlayStateTimer = () => {
    this.playStateTimer = setInterval(this.checkIfVideoLoops, 10);
  }

  startDelayTimer = () => {
    let activeLoopId = this.getActiveLoopId();
    this.togglePlayState();
    this.delayStateTimer = setInterval(this.loopDelayed, (1000*this.state.vidList[this.state.activeVideo].loopList[activeLoopId].delay))
  }

  loopDelayed = () => {
    clearInterval(this.delayStateTimer);
    this.togglePlayState();
  }

  endPlayStateTimer = () => {
    clearInterval(this.playStateTimer);
  }

  getActiveLoopSecondCount = getStartTime => {
    let timeFrame = getStartTime ? 'startTime' : 'endTime';
    let activeLoopId = this.getActiveLoopId();
    let activeLoopHourCount = this.state.vidList[this.state.activeVideo].loopList[activeLoopId][timeFrame].hour;
    let activeLoopMinuteCount = this.state.vidList[this.state.activeVideo].loopList[activeLoopId][timeFrame].minute;
    let activeLoopSecondCount = this.state.vidList[this.state.activeVideo].loopList[activeLoopId][timeFrame].second;
    let secondCount = (activeLoopHourCount*3600) + (activeLoopMinuteCount*60) + activeLoopSecondCount;

    return secondCount;
  }

  checkIfVideoLoops = () => {
    let activeLoopId = this.getActiveLoopId();

   if(this.state.ytPlayer.getCurrentTime() >= this.getActiveLoopSecondCount(false)){
      this.incrementPlayLoopCount();
      if(!this.state.vidList[this.state.activeVideo].loopList[activeLoopId].loopForever && this.state.playLoopCount === this.state.vidList[this.state.activeVideo].loopList[activeLoopId].loopCount){
        if(this.delayStateTimer){
          clearInterval(this.delayStateTimer);
        }
        this.stopVideo();
        this.resetPlayLoopCount();
      }else if(this.state.vidList[this.state.activeVideo].loopList[activeLoopId].delay){
        this.startDelayTimer();
      }
      this.goToLoopStartTime();
    }
  }

  goToLoopStartTime = () => {
    this.state.ytPlayer.seekTo(this.getActiveLoopSecondCount(true), true);
  }

  incrementPlayLoopCount = () => {
    this.setState({
      playLoopCount: this.state.playLoopCount + 1
    })
  }

  resetPlayLoopCount = () => {
    this.setState({
      playLoopCount: 0
    })
  }

  setPlayStateOnChange = (isPlaying) => {
    this.setState({
      videoIsPlaying: isPlaying
    });
  }

  onPlayerStateChange = event => {
    
    if(event.data === 1 && !this.state.videoIsPlaying){
      //playing
      this.setPlayStateOnChange(true);
      this.goToLoopStartTime();
      this.startPlayStateTimer();
    }else if(event.data === 2 || event.data === 0){
      /*
        2: paused 
        0: ended
      */
      this.endPlayStateTimer();
      this.setPlayStateOnChange(false);
    }
  }

  stopVideo = () => {
    this.setState({
      videoIsPlaying: false
    });
    if(this.delayStateTimer){
      clearInterval(this.delayStateTimer);
    }
    this.endPlayStateTimer();
    this.state.ytPlayer.pauseVideo();
  }

  togglePlayState = () => {
    if(this.state.videoIsPlaying){
      this.endPlayStateTimer();
      this.state.ytPlayer.pauseVideo();
    }else{
      this.goToLoopStartTime();
      this.startPlayStateTimer();
      this.state.ytPlayer.playVideo();
    }
    this.setState({
      videoIsPlaying: !this.state.videoIsPlaying
    });
  }

  setYtPlayer = () => {
    if (!loadYT) {
      loadYT = new Promise((resolve) => {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        window.onYouTubeIframeAPIReady = () => resolve(window.YT);
      })
    }
    loadYT.then((YT) => {
      this.setState({
        ytPlayer: new YT.Player('ytVid', {
          height: 390,
          width: '100%',
          videoId: this.state.vidList[this.state.activeVideo].ytId,
          events: {
            onStateChange: this.onPlayerStateChange
          }
        })
      })
    })
  }

  loadExample = () => {
    let newVidList = JSON.parse(JSON.stringify(this.state.vidList))
    let newVidId = newVidList.length
    let exampleVid = {
      id: newVidId,
      name: 'Spokey Dokey',
      ytId: 'fcSuJi1b0OU',
      activeLoop: 0,
      loopList: [
        {
          id: 0,
          name: 'Intro',
          delay: 2,
          loopForever: false,
          loopCount: 3,
          startTime:{
            hour: 0,
            minute: 0,
            second: 1
          },
          endTime:{
            hour: 0,
            minute: 0,
            second: 15
          }
        },
        {
          id: 1,
          name: 'Intro Slow Down',
          delay: 1,
          loopForever: true,
          loopCount: 3,
          startTime:{
            hour: 0,
            minute: 0,
            second: 39
          },
          endTime:{
            hour: 0,
            minute: 0,
            second: 55
          }
        },
        {
          id: 2,
          name: 'Sexy Start',
          delay: 1,
          loopForever: true,
          loopCount: 10,
          startTime:{
            hour: 0,
            minute: 1,
            second: 0
          },
          endTime:{
            hour: 0,
            minute: 1,
            second: 13
          }
        }
      ]
    }
    newVidList.push(exampleVid)
    this.setState({vidList:newVidList})
    this.setState({activeVideo:newVidId})
  }

  startDeleteHold = () =>{
    this.countdownTimer = setInterval(this.deleteCountdown, 1);
  }

  deleteCountdown = () => {
    this.setState({deleteCountdown:this.state.deleteCountdown + 1})
    if(this.state.deleteCountdown >= this.state.deleteCountdownTarget){
      this.deleteActiveLoop()
      this.setState({deleteCountdown:0})
      clearInterval(this.countdownTimer)
    }
  }

  endDeleteHold = () => {
    this.setState({deleteCountdown:0})
    clearInterval(this.countdownTimer)
  }

  resetActiveVideo = () => {
    this.setState({activeVideo: false});
  }

  renderHeaderBtns = () => {
    if(this.state.activeVideo !== false){
      return <ul className="headerBtns">
                <li><button onClick={this.addNewLoop}>{addLoopSvg}</button></li>
                <li><button onClick={this.resetActiveVideo}>{addvideoSvg}</button></li>
              </ul>
    }
  }
  renderState = () => {
    if(this.state.activeVideo !== false){
      return <VidEditor video={this.state.vidList[this.state.activeVideo]} videoIsPlaying={this.state.videoIsPlaying} togglePlayState={this.togglePlayState} changeLoopType={this.changeLoopType} updatedVideoName={this.updatedVideoName} updateDelay={this.updateDelay} updateLoopTime={this.updateLoopTime} updateLoopName={this.updateLoopName} updateLoopCount={this.updateLoopCount} setYtPlayer={this.setYtPlayer}  changeActiveLoop={this.changeActiveLoop} endDeleteHold={this.endDeleteHold} startDeleteHold={this.startDeleteHold} deleteCountdown={this.state.deleteCountdown} deleteCountdownTarget={this.state.deleteCountdownTarget} minDeleteCountdownDisplay={this.state.minDeleteCountdownDisplay} />;
    }else{
      return <AddVideo videoLinkAdded={this.addNewVideo} videoList={this.state.vidList} invalidUserLink={this.state.invalidUserLink} setActiveVideo={this.setActiveVideo} loadExample={this.loadExample} deleteCountdown={this.state.deleteCountdown} deleteCountdownTarget={this.state.deleteCountdownTarget} minDeleteCountdownDisplay={this.state.minDeleteCountdownDisplay} />;
    }
  }

  storageAvailable = type => {
    let storage;
    try {
        storage = window[type];
        let x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
  }

  render(){
    return (
      <div className="App container">
        <Header activeVideo={this.state.activeVideo} renderHeaderBtns={this.renderHeaderBtns} />
        {this.renderState()}
      </div>
    );
  }
}

const addvideoSvg = (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"/></svg>)
const addLoopSvg = (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>)

export default App;