<template>
  <view class="authentication">
    <text class="title">为了保障你的账号安全</text>
    <text class="label">验证密码</text>
    <input type="password" v-model="password" placeholder="请输入密码" class="input" />
    <button class="btn-submit position" @click="logout">确认注销</button>
  </view>
</template>

<script>
  import UserService from '@/api/UserService';
  import { getToken } from '@/utils/auth';
  export default {
    name: 'authentication',
    data() {
      return {
        password: '',
      };
    },
    methods: {
      async logout() {
        if (!this.password) {
          uni.showToast({
            title: '请输入您的密码！',
            icon: 'none',
            duration: 3000,
          });
          return;
        }
        try {
          await UserService.checkUserPassword(this.password);
          this.logoff();
        } catch (e) {
          console.log(e, 'error');
        }
      },
      async logoff() {
        try {
          const params = {
            // appPlatform:2,
            token: getToken(),
            isApp: 3,
          };
          await UserService.logoff(params);
          uni.navigateTo({ url: '/subPackagesA/personal/logoffResult' });
        } catch (e) {
          console.log(e, 'error');
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  .authentication {
    .title {
      display: block;
      font-size: 40rpx;
      font-weight: 500;
      color: #333333;
      line-height: 47px;
      margin-left: 60rpx;
      margin-top: 60rpx;
    }
    .label {
      margin-left: 60rpx;
      margin-top: 30rpx;
      font-size: 32rpx;
      font-weight: 400;
      color: #303133;
      line-height: 38rpx;
    }
    .input {
      width: 590rpx;
      height: 88rpx;
      margin-left: 60rpx;
      margin-top: 30rpx;
      padding: 0 20rpx;
      background: #ffffff;
      border-radius: 8rpx 8rpx 8rpx 8rpx;
      border: 1rpx solid #dedfde;
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
