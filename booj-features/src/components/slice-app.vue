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
          <h4 v-if="preLinkTitle">{{preLinkTitle}}</h4>
          <prismic-rich-text v-if="preLinkDescription" :field="preLinkDescription"/>
          <prismic-link v-if="appleStoreLink" :field="appleStoreLink">
            Apple Store Link
          </prismic-link>
          <prismic-link v-if="googleStoreLink" :field="googleStoreLink">
            Google Store Link
          </prismic-link>
        </div>  
      </div>  
    </div>
  </div>
</template>
 
<script>
export default {
  props: ['graphic', 'title', 'description', 'preLinkTitle', 'preLinkDescription', 'appleStoreLink', 'googleStoreLink'],
  data () {
    return {
    }
  }
}
</script>