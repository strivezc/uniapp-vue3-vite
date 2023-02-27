<template>
  <view class="logoutResult">
    <view class="title-wrap">
      <image mode="widthFix" src="@img/success.png" class="success"></image>
      <text class="title">账号注销成功！</text>
    </view>
    <text class="label">如需再次使用说客英语，请重新注册</text>
    <button class="btn-submit position" @click="logoff">确定</button>
  </view>
</template>

<script>
  import { mapActions } from 'pinia';
  import { useUserStore } from '@/store';
  export default {
    name: 'logoffResult',
    data() {
      return {};
    },
    onLoad() {
      this.resetToken();
    },
    methods: {
      ...mapActions(useUserStore, ['resetToken']),
      logoff() {
        uni.switchTab({ url: '/pages/personal/index' });
      },
    },
  };
</script>

<style scoped lang="scss">
  .logoutResult {
    .title-wrap {
      display: flex;
      align-items: center;
      margin-left: 60rpx;
      margin-top: 60rpx;

      .success {
        width: 48rpx;
        height: 48rpx;
        margin-right: 6rpx;
      }

      .title {
        display: block;
        font-size: 40rpx;
        font-weight: 500;
        color: #333333;
        line-height: 47px;
      }
    }

    .label {
      margin-left: 60rpx;
      margin-top: 30rpx;
      font-size: 32rpx;
      font-weight: 400;
      color: #303133;
      line-height: 38rpx;
    }

    .position {
      position: fixed;
      bottom: env(safe-area-inset-bottom);
      margin-bottom: 32rpx;
      left: 50%;
      transform: translateX(-50%);
    }
  }
</style>
