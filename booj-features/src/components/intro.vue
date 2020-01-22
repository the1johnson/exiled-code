<template>
  <div id="introOverlay">
    Intro overlay
  </div>
</template>
 
<script>
export default {
  data () {
    return {
      fields: {
        videos: [],
        slides: []
      }
    }
  },
  methods: {
    getContent () {
      this.$prismic.client.getSingle('intro_overlay')
        .then((document) => {
          document.data.body.forEach((slice) => {

            if(slice.slice_type === 'intro_video'){
              this.fields.videos.push(slice)
            }else if(slice.slice_type === 'intro_slide'){
              this.fields.slides.push(slice)
            }
          })
        })
    }
  },
  created () {
    this.getContent()
  }
}
</script>