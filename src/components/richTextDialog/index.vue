<template>
  <uni-popup ref="popup" @maskClick="close" type="center" :animation="false">
    <view class="content">
      <text class="title">{{ title }}</text>
      <rich-text :nodes="content" class="text-wrap"></rich-text>
      <button class="btn-login btn" @click="handleAction">
        {{ buttonText }}
      </button>
    </view>
  </uni-popup>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
      },
      content: {
        type: String,
      },
      buttonText: {
        type: String,
      },
    },
    data() {
      return {};
    },
    methods: {
      open() {
        this.$refs.popup.open();
      },
      close() {
        this.$emit('close');
        this.$refs.popup.close();
      },
      handleAction() {
        this.close();
        this.$emit('handleAction');
      },
    },
  };
</script>

<style scoped lang="scss">
  .content {
    position: relative;
    /*width: 100%;*/
    max-height: 1013rpx;
    background: #ffffff;
    border-radius: 24rpx;
    padding-left: 32rpx;
    padding-right: 32rpx;
    padding-bottom: 32rpx;
    margin: 0 55rpx;
    .title {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 32rpx;
      font-size: 32rpx;
      font-weight: 500;
      color: #000000;
    }
    .text-wrap {
      display: block;
      overflow-y: auto;
      margin-top: 16rpx;
      margin-bottom: 32rpx;
      font-size: 28rpx;
      font-weight: 400;
      color: #999999;
      line-height: 40rpx;
      max-height: 760rpx;
    }
    .btn {
      width: 576rpx;
      background: #0087ff !important;
    }
  }
</style>
