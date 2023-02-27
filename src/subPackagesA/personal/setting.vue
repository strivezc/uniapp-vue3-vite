<template>
  <view class="setting">
    <text class="title">设置</text>
    <view class="list-wrap">
      <view
        class="item"
        v-for="(item, index) in list"
        :key="index"
        @click="navigateTo(item.url, item.type)"
      >
        <text class="left">{{ item.text }}</text>
        <image mode="widthFix" src="@img/arrow.png" class="right"></image>
      </view>
    </view>
    <button type="default" class="logout" @click="logout">退出登录</button>
  </view>
</template>

<script setup>
  import { useUserStore } from '@/store';

  const uerStore = useUserStore();
  console.log(uerStore, 'uerStore');
  const list = [
    // {text: '登录测试',type:'login',url: '/subPackagesB/voteActivity/webview'},
    { text: '隐私政策', url: '/subPackagesA/personal/privacyPolicy' },
    { text: '用户协议', url: '/subPackagesA/personal/userAgreement' },
    { text: '注销账号', url: '/subPackagesA/personal/accountLogoff' },
  ];
  console.log(list, 'list');
  const navigateTo = async (url, type) => {
    if (type === 'login') {
      uni.navigateTo({ url });

      // const params={
      //   loginId:'13682377623',
      //   password:'123456',
      //   isApp: "1",
      //   appPlatform: 2,
      //   loginMode: 1,
      // }
      //   this.$store.dispatch('user/login', params).then((res) => {
      //     uni.$emit('refreshInfo');
      //   });
    } else {
      uni.navigateTo({ url });
    }
  };
  const logout = async () => {
    uni.showModal({
      title: '温馨提示',
      content: '是否退出账号！',
      confirmColor: '#0087FF',
      cancelColor: '#0087FF',
      success(res) {
        if (res.confirm) {
          try {
            uerStore.logout().then(() => {
              uni.switchTab({ url: '/pages/personal/index' });
            });
          } catch (e) {
            console.log(e, 'error');
          }
        }
      },
    });
  };
</script>

<style scoped lang="scss">
  .setting {
    /*padding-bottom: env(safe-area-inset-bottom);*/
    .title {
      display: block;
      font-size: 56rpx;
      font-weight: 500;
      color: #333333;
      line-height: 56rpx;
      margin-left: 32rpx;
      margin-top: 34rpx;
    }

    .list-wrap {
      margin-top: 72rpx;
      margin-left: 32rpx;
      margin-right: 42rpx;
      padding-bottom: 100rpx;

      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 120rpx;

        .left {
          font-size: 32rpx;
          font-weight: 400;
          color: #333333;
        }

        .right {
          width: 16rpx;
          height: 25rpx;
        }
      }
    }

    .logout {
      position: fixed;
      bottom: env(safe-area-inset-bottom);
      margin-bottom: 32rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 686rpx;
      height: 88rpx;
      border-radius: 50rpx 50rpx 50rpx 50rpx;
      border: 1rpx solid #ff5e01;
      font-size: 32rpx;
      font-weight: 400;
      color: #ff5c01;
      line-height: 88rpx;
      background: #ffffff;

      &::after {
        border: none;
      }
    }
  }
</style>
