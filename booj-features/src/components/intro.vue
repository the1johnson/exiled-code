<template>
  <div id="introOverlay" v-bind:class="[this.hiddenIntro ? 'hide' : '']">
    <div>
      <div class="skipIntro" v-on:click="hideIntro(true)">Skip Intro</div>
      <div class="logBomax"><img src="@/assets/remax-booj-horiz.svg"></div>
      <div v-if="this.videos">
        <div class="vidtitle" v-if="this.selectedVideo.title">{{this.selectedVideo.title}}</div>
        
        <div id="vimeoVid"></div>

        <div>
           <div class="vidDescription" v-if="this.selectedVideo.description">
            <prismic-rich-text v-if="this.selectedVideo.description" :field="this.selectedVideo.description" />
          </div>
          <ul class="vidTooltips" v-else-if="this.selectedVideo.tooltip"></ul>
        </div>

        <ul class="vidList">
          <li v-for="(videoInfo, index) in this.videos" v-bind:key="index" v-bind:class="[videoInfo.isActive ? 'active' : '']" v-on:click="setActiveVid(index)">
            <div class="thumbnail"></div>
            <div class="thumbTitle">{{videoInfo.primary.thumbnail_title}}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
 
<script>
import Player from '@vimeo/player';
export default {
  data () {
    return {
      hiddenIntro: false,
      testd: null,
      selectedVideo: {
        title: null,
        description: null,
        tooltip: null
      },
      player: null,
      videos: [],
      slides: []
    }
  },
  methods: {
    getContent () {
      this.$prismic.client.getSingle('intro_overlay')
        .then((document) => {
          document.data.body.forEach((slice) => {

            if(slice.slice_type === 'intro_video' || slice.slice_type === 'intro_video1'){
              slice.isActive = false
              this.videos.push(slice)
            }else if(slice.slice_type === 'intro_slide'){
              this.slides.push(slice)
            }
          })
          this.setActiveVid(0)
        })
    },
    hideIntro (hide) {
      this.hiddenIntro = hide
    },
    setActiveVid (vidId) {
      let selectedVidInfo = null;
      this.videos = this.videos.filter(function(videoInfo, index){
        videoInfo.isActive = (index === vidId) ? true :false
        if(videoInfo.isActive){
          selectedVidInfo = videoInfo
        }
        return videoInfo
      })

      this.selectedVideo.title = selectedVidInfo.primary.full_title
      this.selectedVideo.description = selectedVidInfo.primary.description
      window.console.log(this.selectedVideo.description,selectedVidInfo)

      if(this.player !== null){
        this.player.destroy();
      }
      this.player = new Player('vimeoVid', {
        id: selectedVidInfo.primary.video.video_id,
        autoplay: true
      })
      this.player.setVolume(0);

    }
  },
  created () {
    this.getContent()
  }
}
</script>