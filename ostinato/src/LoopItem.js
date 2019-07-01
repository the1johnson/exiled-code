import React, {Component} from 'react';
import PropTypes from 'prop-types';


class LoopItem extends Component {
  renderPausePlay = () => {
    return (this.props.videoIsPlaying) ? <button className="loopAction pausePlay" onClick={this.props.togglePlayState}>{pauseSvg}</button> : <button className="loopAction pausePlay" onClick={this.props.togglePlayState}>{playSvg}</button>;
  }
  render(){
    const {id, name, delay, loopForever, loopCount, startTime, endTime} = this.props.loop
    return(
      <li className={this.props.loopIsActive ? 'active' : ''} onClick={() => this.props.changeActiveLoop(id)}>
      {this.renderPausePlay()}
        <button onClick={() => {this.props.changeLoopType(true)}} className={'loopAction forever loopType '+(loopForever ? 'active' : '')}>{loopSvg}</button>
        <button onClick={() => {this.props.changeLoopType(false)}} className={'loopAction loopType '+(!loopForever ? 'active' : '')}><input className="repeatCount" type="number" placeholder="" defaultValue={loopCount} onChange={this.props.updateLoopCount} />{repeatSvg}</button>
        <div className="loopDetails">
          <input className="loopName" type="text" placeholder="" defaultValue={name} onChange={(e) => this.props.updateLoopName(e)} />
          <div className="loopRange">
            -
            <input className="timeControl hour" type="number" placeholder="" defaultValue={startTime.hour} onChange={(e) => this.props.updateLoopTime(e, true, 'hour')} />:<input className="timeControl minute" type="number" placeholder="" defaultValue={startTime.minute} onChange={(e) => this.props.updateLoopTime(e, true, 'minute')} />:<input className="timeControl second" type="number" placeholder="" defaultValue={startTime.second} onChange={(e) => this.props.updateLoopTime(e, true, 'second')} />
            <span className="timeTo">to</span>
            <input className="timeControl hour" type="number" placeholder="" defaultValue={endTime.hour} onChange={(e) => this.props.updateLoopTime(e, false, 'hour')} />:<input className="timeControl minute" type="number" placeholder="" defaultValue={endTime.minute} onChange={(e) => this.props.updateLoopTime(e, false, 'minute')} />:<input className="timeControl second" type="number" placeholder="" defaultValue={endTime.second} onChange={(e) => this.props.updateLoopTime(e, false, 'second')} />
          </div>
          <div className="loopDelay">Delay <input className="timeControl delay" type="number" placeholder="" defaultValue={delay} onChange={this.props.updateDelay} />s</div>
        </div>
      </li>
    );
  }
}

const loopSvg = (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/><path d="M0 0h24v24H0z" fill="none"/></svg>);
const pauseSvg = (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>);
const playSvg = (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/><path d="M0 0h24v24H0z" fill="none"/></svg>);
const repeatSvg = (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>);

LoopItem.propTypes = {
  loop: PropTypes.object.isRequired
}

export default LoopItem;