<template>
  <footer>
    <prismic-rich-text v-if=footerText :field="footerText"/>
  </footer>
</template>
 
<script>
export default {
  data () {
    return {
      footerText: null
    }
  },
  methods: {
    getContent () {
      this.$prismic.client.getSingle('footer_info')
        .then((document) => {
          this.footerText = document.data.footer_text
        })
    }
  },
  created () {
    this.getContent()
  }
}
</script>