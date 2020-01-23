<template>
  <div>
    <full-page v-if="this.fields.homeSlice" ref="fullpage" v-bind:options="this.fields.fpopts">
      <div v-for="(slice, index) in this.fields.homeSlice" v-bind:key="index" v-bind:class="slice.primary.background_image" class="section fp-auto-height-responsive">
        <SliceSimple v-if="slice.slice_type === 'simple_slide'" v-bind:graphic="slice.primary.graphic" v-bind:title="slice.primary.title" v-bind:description="slice.primary.description" />

        <SliceApp v-else-if="slice.slice_type === 'app_slide'" v-bind:graphic="slice.primary.graphic" v-bind:title="slice.primary.title" v-bind:description="slice.primary.description" v-bind:preLinkTitle="slice.primary.pre_link_title" v-bind:preLinkDescription="slice.primary.pre_link_description" v-bind:appleStoreLink="slice.primary.apple_store_link" v-bind:googleStoreLink="slice.primary.google_store_link" />

        <SliceList v-else-if="slice.slice_type === 'list_slide'" v-bind:graphic="slice.primary.graphic" v-bind:title="slice.primary.title" v-bind:description="slice.primary.description" v-bind:preListDescription="slice.primary.pre_list_description" v-bind:buttonTxt="slice.primary.button_text" v-bind:buttonLink="slice.primary.button_link" v-bind:checkList="slice.items" />

        <SliceCRM v-else-if="slice.slice_type === 'crm_slide'" />
      </div>
    </full-page>
  </div>
</template>
 
<script>
import SliceSimple from './slice-simple.vue'
import SliceApp from './slice-app.vue'
import SliceList from './slice-list.vue'
import SliceCRM from './slice-crm.vue'
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
    }
  },
  created () {
    this.getContent()
  },
  components: {
    SliceSimple,
    SliceApp,
    SliceList,
    SliceCRM
  }
}
</script>