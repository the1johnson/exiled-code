<template>
  <div>
    <div>Gallery</div>
    <div>
      Desc Cont
    </div>
    <BoojersComponent />
    <SocialComponent />

  </div>
</template>

<script>
  import BoojersComponent from '@/components/boojer.vue'
  import SocialComponent from '@/components/social.vue'
  export default {
    name: 'Homepage',
    components: {
      BoojersComponent,
      SocialComponent,
    }
  }
</script>