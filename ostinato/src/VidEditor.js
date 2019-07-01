import React, {Component} from 'react';
import Loops from './Loops';
import PropTypes from 'prop-types';


class VidEditor extends Component {
  componentDidMount(){
    this.props.setYtPlayer();
  }
  render(){
    return(
      <main id="videoEditor">
        <div className="ytVidWrap">
          <div id="ytVid"></div>
          <input type="text" defaultValue={this.props.video.name} onChange={(e) => this.props.updatedVideoName(e)} />
        </div>
        <Loops loopList={this.props.video.loopList} videoIsPlaying={this.props.videoIsPlaying} changeActiveLoop={this.props.changeActiveLoop} activeLoopId={this.props.video.activeLoop} updateLoopName={this.props.updateLoopName} togglePlayState={this.props.togglePlayState} changeLoopType={this.props.changeLoopType} updateLoopCount={this.props.updateLoopCount} updateDelay={this.props.updateDelay} updateLoopTime={this.props.updateLoopTime} />
      </main>

    );
  }
}

VidEditor.propTypes = {
  video: PropTypes.object.isRequired
}

export default VidEditor;