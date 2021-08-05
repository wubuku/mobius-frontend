<template>
  <div class="grid">
    {{ layout }}
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    components: {},
    setup() {
      const layout = ref([
        { x: 0, y: 0, w: 2, h: 2, i: '0' },
        { x: 2, y: 0, w: 2, h: 4, i: '1' },
      ]);

      return {
        layout,
      };
    },
  });
</script>

<style lang="less" scoped>
  .grid {
  }
</style>
