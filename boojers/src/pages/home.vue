<template>
  <div>
    <div>Gallery</div>
    <div>
      Desc Cont
    </div>
    <BoojersComponent />

  </div>
</template>

<script>
import BoojersComponent from '@/components/boojer.vue'
export default {
  name: 'Homepage',
  components: {
    BoojersComponent
  }
}
</script>