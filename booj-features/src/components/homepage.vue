<template>
  <div>
    <div v-for="(slice, index) in this.fields.homeSlice" v-bind:key="index">
      {{index}} - {{slice.primary.side_menu_title}}
      <div v-if="">
        
      </div>
    </div>
  </div>
</template>
 
<script>
export default {
  data () {
    return {
      fields: {
        homeSlice: null
      }
    };
  },
  methods: {
    getContent () {
      this.$prismic.client.getSingle('homepage')
        .then((document) => {
          this.fields.homeSlice = document.data.body
          window.console.log(this.fields.homeSlice)
        })
    }
  },
  created () {
    this.getContent();
  }
}
</script>