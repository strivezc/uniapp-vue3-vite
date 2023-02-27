<template>
  <view class="accountLogoff">
    <text class="title">说客英语注销须知</text>
    <view class="content">
      <view class="mt-40 flex">
        <text class="spot"></text>
        <text class="label">一、注销前，请您先做好以下准备，否则可能无法完成注销。</text>
      </view>
      <view class="normal-text">1.前往「我的-已约课程」中取消已约待上的课程；</view>
      <view class="normal-text">2.前往「我的- VIP课表」中取消全部VIP课表；</view>
      <view class="mt-40 flex">
        <text class="spot"></text>
        <text class="label">二、注销将产生以下风险，请您知悉，即在您提交注销后：</text>
      </view>
      <view class="normal-text">1.您将无法再次登录、使用本账号；</view>
      <view class="normal-text yellow"
        >2.您将面临无法使用与本账号绑定的相同手机号再次注册的风险；</view
      >
      <view class="normal-text"
        >3.本账号在说客英语平台的所有信息将在提交注销的7天后被抹除，包括但不限于课时、积分、已约课程、个人资料、学习记录、关联的第三方绑定等；</view
      >
      <view class="mt-40 flex">
        <text class="spot"></text>
        <view class="label"
          >三、提交注销后，<span class="yellow">如果您希望继续使用本账号</span
          >，可在提交注销后的7天内，通过联系说客英语客服，并提供能证明您是该账号的所有者的资料来申请恢复该账号正常使用，否则您的账号将被永久性注销。</view
        >
      </view>
    </view>
    <button type="default" class="logout" @click="logout">我已了解以上风险，开始注销</button>
  </view>
</template>

<script>
  import UserService from '@/api/UserService';
  export default {
    name: 'accountLogoff',
    data() {
      return {};
    },
    methods: {
      async logout() {
        try {
          const { resultData } = await UserService.checkLoginOffNum();
          console.log(resultData, 'resultData');
          if (resultData) {
            if (resultData.sign == 0) {
              uni.showToast({
                title: resultData.message,
                icon: 'none',
                duration: 3000,
              });
            } else if (resultData.sign == 1) {
              uni.navigateTo({ url: '/subPackagesA/personal/authentication' });
            }
          } else {
            uni.navigateTo({ url: '/subPackagesA/personal/authentication' });
          }
        } catch (e) {
          console.log(e, 'error');
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  .accountLogoff {
    .title {
      display: block;
      font-size: 40rpx;
      font-weight: 500;
      color: #333333;
      line-height: 47px;
      margin-left: 32rpx;
      margin-top: 34rpx;
    }
    .content {
      margin-top: 52rpx;
      margin-left: 32rpx;
      margin-right: 32rpx;
      padding-bottom: 200rpx;
      .flex {
        display: flex;
        align-items: baseline;
      }
      .spot {
        display: inline-block;
        border-radius: 50%;
        width: 16rpx;
        height: 16rpx;
        background: #0087ff;
        margin-right: 20rpx;
        line-height: 33rpx;
        flex-shrink: 0;
      }
      .label {
        font-size: 30rpx;
        font-weight: 500;
        color: #333333;
        line-height: 42rpx;
        margin-bottom: 12rpx;
      }
      .normal-text {
        font-size: 26rpx;
        font-weight: 400;
        color: #666666;
        line-height: 40rpx;
        margin-top: 8rpx;
        margin-left: 36rpx;
      }
      .yellow {
        color: #ff5c01;
      }
      .mt-40 {
        margin-top: 40rpx;
      }
    }
    .logout {
      position: fixed;
      bottom: env(safe-area-inset-bottom);
      margin-bottom: 32rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 670rpx;
      height: 88rpx;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
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
