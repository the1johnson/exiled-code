<template>
  <div id="tourSection">
    <div class="tourWrapper" v-if="tourInfo">
      <div class="title">{{tourInfo.title}}</div>
      <div class="tourImgWrap">
        <prismic-image v-if="tourInfo.graphic" :field="tourInfo.graphic"/>
        <div class="sectionInfo">
          <div class="bbTitle" v-if="tourInfo.bb_title">{{tourInfo.bb_title}}</div>
          <div class="bbDescritpion">{{tourInfo.bb_text}}</div>
        </div>
      </div>
      
      <div class="tabsWrapper">
        <div class="tab" v-for="(tabInfo, index) in tourInfo.tabs" v-bind:key="index" v-bind:class="[tabInfo.isActive ? 'active' : '']">
          <div class="tabHead" v-on:click="setActiveTab(index)">
            <div class="closeWrapper">
              <img src="@/assets/cta-arrow-white.svg">
            </div>
            <div class="thWrapper">
              <div class="tabTitle">{{tabInfo.tab_title}}</div>
              <div class="tabDescription">{{tabInfo.tab_description}}</div>
            </div>
          </div>
          <div class="tabBody">
            <div class="tabBodyWrap">
              <div :id="index+'_'+tabInfo.tab_video.video_id" class="vimeoVid"></div>
              <prismic-rich-text class="tabExtraContent" v-if="tabInfo.tab_extra_content" :field="tabInfo.tab_extra_content" />
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import Vue from 'vue'
import Player from '@vimeo/player'
export default {
  data () {
    return {
      tourInfo: null,
      player: null,
      activeTabVid: {
        index: null,
        vidID: null
      },
      baseVideoSize: {
        height: 0,
        width: 0
      }
    };
  },
  props: {
    tid: String
  },
  methods: {
    loadVideo (tabIndex, videoID) {
      window.console.log('meh', tabIndex, videoID, document.getElementById(tabIndex+'_'+videoID))
      this.player = new Player(tabIndex+'_'+videoID, {
        id: videoID,
        autoplay: false
      })

      this.activeTabVid.index = tabIndex
      this.activeTabVid.vidID = videoID
      this.player.on('loaded', this.saveBaseVideoSize)
    },
    setCurrentTour () {
      let self = this
      Vue.prototype.$tourSectionInfo.forEach((tourSection) => {
        if(tourSection.uid === this.tid){
          this.tourInfo = tourSection.data
          
          setTimeout(function(){
              self.setActiveTab(0)
          }, 100)
        }
      })
    },
    setActiveTab (tabIndex) {
      let self = this
      this.tourInfo.tabs = this.tourInfo.tabs.filter(function(tabInfo, index){
        tabInfo.isActive = (index === tabIndex && !tabInfo.isActive) ? true : false
        if(self.player !== null){
          self.player.destroy()
        }
        if(tabInfo.isActive){
          self.loadVideo(index, tabInfo.tab_video.video_id)
        }
        return tabInfo
      })
    },
    saveBaseVideoSize () {
      if(this.player == null){
        return false
      }
      let vidIframe = document.querySelector('.tab.active .tabBodyWrap iframe')
      this.baseVideoSize.height = parseInt(vidIframe.getAttribute('height'), 10)
      this.baseVideoSize.width = parseInt(vidIframe.getAttribute('width'), 10)
      
      this.setResponsiveVideoSize()
    },
    setResponsiveVideoSize () {
      if(this.player == null){
        return false
      }
      let containerWidth = document.querySelector('.tab.active .tabBodyWrap').offsetWidth
      let ratioMulti = containerWidth/this.baseVideoSize.width
      let newHeight = this.baseVideoSize.height*ratioMulti
      let vidIframe = document.querySelector('.tab.active .tabBodyWrap iframe')

      vidIframe.setAttribute('height', newHeight)
    }
  },
  mounted () {
    if(Vue.prototype.$tourSectionInfo.length){
      this.setCurrentTour()
    }else{
      this.$prismic.client.query(
        [this.$prismic.Predicates.at('document.type', 'tour_section')]
      ).then((response) => {
        Vue.prototype.$tourSectionInfo = response.results
        this.setCurrentTour()
      })
    }
    window.addEventListener('resize', this.setResponsiveVideoSize)
  },
}
</script>