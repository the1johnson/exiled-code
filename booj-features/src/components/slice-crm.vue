<template>
  <div class="sliceCRM">
    <div class="container slide-wrapper">
      <div class="top-text">
        <div class="title">{{title}}</div>
        <div class="description">{{description}}</div>
      </div>
      
      <div class="galleryWrap">
        <carousel-3d ref="carousel" :perspective="carouOpts.perspective" :space="carouOpts.space" :display="carouOpts.display" :controls-visible="carouOpts.controlsVisible" :controls-prev-html="carouOpts.galleryPrevTitle" :controls-next-html="carouOpts.galleryNextTitle" @after-slide-change="onAfterSlideChange">
          <slide v-for="(slide, index) in gallerySlides" v-bind:key="index" :index="index" >
            <prismic-image v-if="slide.graphic" :field="slide.graphic"/>
          </slide>
        </carousel-3d>
        <div class="galleryBg"></div>
        
      </div>

    </div>
  </div>
</template>

<script>
import { Carousel3d, Slide } from 'vue-carousel-3d';

export default {
  props: ['title', 'description', 'gallerySlides'],
  data () {
    return {
      galleryNextTitle: "<div>Next</div>",
      galleryPrevTitle: "<div>Prev</div>",
      carouOpts: {
        space: 500,
        display: 3,
        perspective: 0,
        controlsVisible: false
      }
    }
  },
  methods: {
    galNextSlide () {
      this.$refs.carousel.goNext()
    },
    galPrevSlide () {
      this.$refs.carousel.goPrev()
    },
    onAfterSlideChange (index) {
      window.console.log('sooooo', index, this.gallerySlides[index])
    }
  },
  mounted () {
    //this.galleryNextTitle = "<div>Next Text</div>"
    //this.galleryPrevTitle = 'Prev Text'
    //this.$refs.carousel.onSlideChange()
  },
  components: {
    Carousel3d,
    Slide
  }
}
</script>