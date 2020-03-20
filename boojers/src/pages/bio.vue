<template>
  <div>
    <AwardsComponent />
    <FactsComponent />
    <GalleryComponent />
    <HobbiesComponent />
    <SocialComponent />
  </div>
</template>

<script>
  import AwardsComponent from '@/components/bio/awards.vue'
  import FactsComponent from '@/components/bio/facts.vue'
  import GalleryComponent from '@/components/bio/gallery.vue'
  import HobbiesComponent from '@/components/bio/hobbies.vue'
  import SocialComponent from '@/components/social.vue'
  export default {
    name: 'Bio',
    components: {
      AwardsComponent,
      FactsComponent,
      GalleryComponent,
      HobbiesComponent,
      SocialComponent,
    }

  }
</script>