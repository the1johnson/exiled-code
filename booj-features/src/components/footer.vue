<template>
  <footer>
    <prismic-rich-text v-if=fields.footerText :field="fields.footerText"/>
  </footer>
</template>
 
<script>
export default {
  data () {
    return {
      fields: {
        footerText: null
      }
    }
  },
  methods: {
    getContent () {
      this.$prismic.client.getSingle('footer_info')
        .then((document) => {
          this.fields.footerText = document.data.footer_text
        })
    }
  },
  created () {
    this.getContent()
  }
}
</script>