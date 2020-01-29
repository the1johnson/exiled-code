<template>
  <div>
    <full-page v-if="this.fields.homeSlice" ref="fullpage" v-bind:options="this.fields.fpopts">
      <div v-for="(slice, index) in this.fields.homeSlice" v-bind:key="index" v-bind:class="slice.primary.background_image" class="section fp-auto-height-responsive">
        <SliceSimple v-if="slice.slice_type === 'simple_slide'" v-bind:graphic="slice.primary.graphic" v-bind:title="slice.primary.title" v-bind:description="slice.primary.description" />

        <SliceApp v-else-if="slice.slice_type === 'app_slide'" v-bind:graphic="slice.primary.graphic" v-bind:title="slice.primary.title" v-bind:description="slice.primary.description" v-bind:contentRightTitle="slice.primary.content_right_title" v-bind:contentRightImage="slice.primary.content_right_image" v-bind:contentRightDescription="slice.primary.content_right_description" v-bind:appleStoreLink="slice.primary.apple_store_link" v-bind:googleStoreLink="slice.primary.google_store_link" v-bind:buttonTxt="slice.primary.button_text" v-bind:buttonLink="slice.primary.button_link" />

        <SliceList v-else-if="slice.slice_type === 'list_slide'" v-bind:graphic="slice.primary.graphic" v-bind:title="slice.primary.title" v-bind:description="slice.primary.description" v-bind:preListDescription="slice.primary.pre_list_description" v-bind:buttonTxt="slice.primary.button_text" v-bind:buttonLink="slice.primary.button_link" v-bind:checkList="slice.items" />

        <SliceCRM v-else-if="slice.slice_type === 'crm_slide'" />

        <SliceSupport v-else-if="slice.slice_type === 'support_slide'" v-bind:title="slice.primary.title" v-bind:description="slice.primary.description" v-bind:whiteBoxTitleTop="slice.primary.white_box_title_top" v-bind:whiteBoxDescriptionTop="slice.primary.white_box_description_top" v-bind:whiteBoxTitleBottom="slice.primary.white_box_title_bottom" v-bind:whiteBoxDescriptionBottom="slice.primary.white_box_description_bottom" v-bind:buttonLink="slice.primary.button_link" v-bind:buttonTxt="slice.primary.button_text" v-bind:checkList="slice.items" />
      </div>
      <div class="section fp-auto-height">
        <FooterComponent id="footer" />
      </div>
    </full-page>
  </div>
</template>

<script>
import SliceSimple from './slice-simple.vue'
import SliceApp from './slice-app.vue'
import SliceList from './slice-list.vue'
import SliceCRM from './slice-crm.vue'
import SliceSupport from './slice-support.vue'
import FooterComponent from './footer.vue'

export default {
  data () {
    return {
      fields: {
        homeSlice: null,
        fpopts: {
          licenseKey: 'DBE56275-4E7F4563-B1EC41D0-77DDCB26',
          navigation: true,
          navigationPosition: 'right',
          // navigationTooltips: ['First page', 'Second page', 'Third and last page'],
          responsiveWidth: 1200,
          scrollingSpeed: 700,
        }
      }
    }
  },
  methods: {
    getContent () {
      this.$prismic.client.getSingle('homepage')
        .then((document) => {
          this.fields.homeSlice = document.data.body
        })
    },
  },
  created () {
    this.getContent();
  },
  components: {
    SliceSimple,
    SliceApp,
    SliceList,
    SliceCRM,
    SliceSupport,
    FooterComponent
  }
}
</script>