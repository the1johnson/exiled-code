<template>
  <div>
    <prismic-image v-if="graphic" :field="graphic"/>
    <h1 v-if="title">{{title}}</h1>
    <prismic-rich-text v-if="description" :field="description"/>
    <h4 v-if="preLinkTitle">{{preLinkTitle}}</h4>
    <prismic-rich-text v-if="preLinkDescription" :field="preLinkDescription"/>
    <prismic-link v-if="appleStoreLink" :field="appleStoreLink">
      Apple Store Link
    </prismic-link>
    <prismic-link v-if="googleStoreLink" :field="googleStoreLink">
      Google Store Link
    </prismic-link>
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