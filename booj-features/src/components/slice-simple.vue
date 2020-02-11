<template>
  <div class="sliceSimple">
    <div class="container slide-wrapper">
      <div class="img-wrapper">
        <prismic-image v-if="graphic" :field="graphic"/>
      </div>  
      <div class="contentWrap">
        <div class="title h1" v-if="title">{{title}}</div>
        <prismic-rich-text v-if="description" :field="description" class="description h2 light" />
      </div>
    </div>
  </div>
</template>
 
<script>
export default {
  props: ['graphic', 'title', 'description'],
  data () {
    return {
    }
  }
}
</script>