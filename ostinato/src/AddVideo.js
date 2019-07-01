import React, {Component} from 'react';

class AddVideo extends Component {
  
  invalidLinkMessage = () => {
    if(this.props.invalidUserLink){
      return <div class="invalidLinkMsg">invalid link</div>;
    }
  }
  render(){
    return (
      <main id="addVideo">
        <p>If you need to loop a specific portion of a youtube video then you have found the correct website. Posting a youtube video id or url below will present you with the options to create loops on that video that can be repeated infinitely or a specific amount of times. You can even set a delay between loops.</p>
        <p>For an example of Ostinato in action check out this example<br /><button onClick={this.props.loadExample}>The Seatbelts - Spokey Dokey.</button></p>
        <div className={"addVideoWrap"+(this.props.invalidUserLink ? ' invalid' : '')}>
          {linkSvg}
          <input type="text" placeholder="youtube link" onChange={this.props.videoLinkAdded} />
        </div>
        {this.invalidLinkMessage()}
        
        <ul>
          {this.props.videoList.map( (userVideo) => <li key={userVideo.id}><button onClick={() => this.props.setActiveVideo(userVideo.id)}>{userVideo.name}</button></li> )}
        </ul>
      </main>
    );
  }
}

const linkSvg = (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>);

export default AddVideo;