<template>
  <footer>
    <prismic-rich-text class="footer-left" v-if=footerTextLeft :field="footerTextLeft"/>
    <div class="footer-right">
      <ul v-if="socialIcons" class="custom-bullet check">
        <li v-for="(item, index) in socialIcons" v-bind:key="index">
          <img :src='item.social_name.url'>
        </li>
      </ul>
      <prismic-rich-text v-if=footerTextRight :field="footerTextRight"/>
    </div>  
  </footer>
</template>
 
<script>
export default {
  data () {
    return {
      footerTextLeft: null,
      footerTextRight: null,
      socialIcons: null,
    }
  },
  methods: {
    getContent () {
      this.$prismic.client.getSingle('footer_info')
        .then((document) => {
          this.footerTextLeft = document.data.footer_text_left
          this.footerTextRight = document.data.footer_text_right
          this.socialIcons = document.data.social_icons
        })
    }
  },
  created () {
    this.getContent()
  }
}
</script>