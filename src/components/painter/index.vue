<template>
  <painter @imgOK="onImgOk" @imgErr="onImgErr" widthPixels="750" :palette="template" />
</template>

<script>
  export default {
    props: {
      template: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    data() {
      return {
        path: '',
      };
    },
    methods: {
      onImgOk(e) {
        this.path = e.detail.path;
        this.$emit('getImageUrl', this.path);
      },
      onImgErr(e) {
        console.log(e);
      },
    },
  };
</script>

<style scoped></style>
