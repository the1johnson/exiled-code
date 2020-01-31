<template>
  <div class="sliceCRM">
    <div class="container slide-wrapper">
      <div class="top-text">
        <div class="title">{{title}}</div>
        <div class="description">{{description}}</div>
      </div>
      
      <div class="galleryWrap">
        <ul class="gallery">
          <li v-for="(slide, index) in gallerySlides" v-bind:key="index" v-bind:class="[index === galleryKeys.active ? 'active' : '', index === galleryKeys.next ? 'galNext' : '', index === galleryKeys.prev ? 'galPrev' : '']">
            <prismic-image v-if="slide.graphic" :field="slide.graphic"/>
            <div class="slideInfoWrapper">
              <div class="bbTitle">{{slide.blue_box_title}}</div>
              <prismic-rich-text v-if="slide.blue_box_description" :field="slide.blue_box_description" class="bbDescritpion" />

              <div class="tourButton"><span>Take a</span> Tour <span>of</span> {{slide.slide_name}}</div>
            </div>
          </li>
        </ul>
        <div class="galleryBg"></div>
      </div>
    </div>
  </div>
</template>
 
<script>
export default {
  props: ['title', 'description', 'gallerySlides'],
  data () {
    return {
      galleryKeys: {
        active: null,
        next: null,
        prev: null
      }
    }
  },
  created () {
    this.galleryKeys.active = 0
    this.galleryKeys.next = 1
    this.galleryKeys.prev = this.gallerySlides.length - 1
    window.console.log(this.galleryKeys, this.gallerySlides.length)
  }
}
</script>