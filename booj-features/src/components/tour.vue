<template>
  <div>
    <h1>FAKE TOUR</h1>
    <prismic-rich-text v-if=fields.footerText :field="fields.footerText"/>
  </div>
</template>
 
<script>
export default {
  data () {
    return {
      fields: {
        footerText: null
      }
    };
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