<template>
  <div class="sliceApp">
    <div class="container slide-wrapper">
      <div class="top-text">
        <h1 v-if="title" class="title">{{title}}</h1>
        <prismic-rich-text v-if="description" :field="description" class="description" />
      </div>
      <div class="two-column">
        <div class="img-wrapper">
          <prismic-image v-if="graphic" :field="graphic"/>
        </div>
        <div class="contentWrap"> 
          <div class="txt-wrapper">
            <prismic-image v-if="contentRightImage" :field="contentRightImage"/> 
            <h4 v-if="contentRightTitle" class="content-right-title">{{contentRightTitle}}</h4>
            <prismic-rich-text class="content-right-description" v-if="contentRightDescription" :field="contentRightDescription"/>
          </div>
          <div class="download-buttons">
            <prismic-link v-if="appleStoreLink.url" :field="appleStoreLink" class="apple-link">
                <img src="@/assets/apple-download-badge.svg">
            </prismic-link>
            <prismic-link v-if="googleStoreLink.url" :field="googleStoreLink" class="google-link">
              <img src="@/assets/google-play-badge.svg">
            </prismic-link>
          </div>  
          <prismic-link v-if="buttonLink && buttonTxt" :field="buttonLink" class="tour-button">
            {{buttonTxt}}
          </prismic-link>
        </div>  
      </div>  
    </div>
  </div>
</template>
 
<script>
export default {
  props: ['graphic', 'title', 'description', 'contentRightImage' ,'contentRightTitle', 'contentRightDescription', 'appleStoreLink', 'googleStoreLink', 'buttonTxt', 'buttonLink'],
  data () {
    return {
    }
  }
}
</script>