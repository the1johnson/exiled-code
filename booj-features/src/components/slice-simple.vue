<template>
  <div class="sliceSimple">
    <prismic-image v-if="graphic" :field="graphic"/>
    <div class="contentWrap">
      <div class="title" v-if="title">{{title}}</div>
      <prismic-rich-text v-if="description" :field="description" class="description" />
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