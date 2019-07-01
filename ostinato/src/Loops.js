import React from 'react';
import LoopItem from './LoopItem';

const  Loops = (props) => {
  return (
     <ul className="loopList">
        {props.loopList.map( (loop) => (<LoopItem key={loop.id} loop={loop} videoIsPlaying={props.videoIsPlaying} changeActiveLoop={props.changeActiveLoop} loopIsActive={props.activeLoopId === loop.id} togglePlayState={props.togglePlayState} changeLoopType={props.changeLoopType} updateLoopCount={props.updateLoopCount} updateDelay={props.updateDelay} updateLoopTime={props.updateLoopTime} updateLoopName={props.updateLoopName} />) )}
      </ul>
  );
}

export default Loops;