<template>
  <view>
    <web-view :src="url"></web-view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        url: '',
      };
    },
    onLoad: function (options) {
      this.url = decodeURIComponent(options.url);
      console.log(this.url, 'url');
    },
  };
</script>
