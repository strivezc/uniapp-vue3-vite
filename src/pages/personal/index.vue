<template>
  <view class="personal-wrap">
    <view class="personal-bg">
      <view class="personal-info" @click="needLogin">
        <image
          :src="userImg === 'default.jpg' || !userImg ? defaultImage : userImg"
          class="left"
        ></image>
        <view class="right">
          <text class="name">{{ token ? userName : '请点击登录' }}</text>
          <text class="phone" v-if="phone">{{ token ? phone : '' }}</text>
        </view>
      </view>
    </view>
    <view class="setting-wrap">
      <view class="block">
        <view class="item" v-for="(item, index) in list" :key="index" @click="navigateTo(item.url)">
          <view class="left">
            <image mode="widthFix" :src="item.icon" class="icon"></image>
            <text class="text">{{ item.text }}</text>
          </view>
          <image mode="widthFix" src="@img/arrow.png" class="right"></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  // import { getToken, getUserName, getUserImg, getUserPhone } from '@/utils/auth';
  import { mapState, mapActions } from 'pinia';
  import { useUserStore } from '@/store';
  import gift from '@img/gift.png';
  import invitationRecord from '@img/invitationRecord.png';
  import votingRecord from '@img/votingRecord.png';
  import set from '@img/set.png';
  import defaultImage from '@img/default.png';

  export default {
    name: 'personal',
    components: {},
    data() {
      return {
        list: [
          { icon: gift, text: '邀请有礼', url: '/subPackagesA/personal/invitationGift' },
          {
            icon: invitationRecord,
            text: '邀请记录',
            url: '/subPackagesA/personal/invitationRecord',
          },
          { icon: votingRecord, text: '投票记录', url: '/subPackagesB/voteActivity/voteRecord' },
          { icon: set, text: '设置', url: '/subPackagesA/personal/setting' },
        ],
        defaultImage,
      };
    },
    computed: {
      ...mapState(useUserStore, ['token', 'userName', 'userImg', 'phone']),
    },
    methods: {
      navigateTo(url) {
        uni.navigateTo({ url });
      },
      needLogin() {
        if (!this.token) {
          this.navigateTo('/subPackagesA/personal/chooseLoginType');
        }
      },
    },
    // 页面周期函数--监听页面加载
    onLoad() {
      uni.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage'],
      });
    },
    // 页面周期函数--监听页面初次渲染完成
    onReady() {},
    // 页面周期函数--监听页面显示(not-nvue)
    onShow() {},
    // 页面周期函数--监听页面隐藏
    onHide() {},
    // 页面周期函数--监听页面卸载
    onUnload() {},
  };
</script>

<style lang="scss" scoped>
  .personal-wrap {
    .personal-bg {
      width: 100%;
      height: 341rpx;
      background: url(@img/centerBg.png) center no-repeat;
      background-size: cover;

      .personal-info {
        display: flex;
        align-items: center;
        padding-top: 145rpx;
        margin-left: 46rpx;

        .left {
          width: 120rpx;
          height: 120rpx;
          border-radius: 100%;
          margin-right: 20rpx;
        }

        .right {
          display: flex;
          flex-direction: column;
          .name {
            font-size: 36rpx;
            font-weight: bold;
            color: #ffffff;
            line-height: 42rpx;
          }
          .phone {
            margin-top: 10rpx;
            font-size: 28rpx;
            font-weight: 400;
            color: #ffffff;
            line-height: 26rpx;
          }
        }
      }
    }

    .setting-wrap {
      display: flex;
      justify-content: center;
      margin-top: -50rpx;

      .block {
        display: flex;
        flex-direction: column;
        background: #ffffff;
        width: 100%;
        border-radius: 16rpx 16rpx 16rpx 16rpx;
        margin-left: 26rpx;
        margin-right: 38rpx;
        padding-left: 45rpx;
        padding-right: 30rpx;

        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100rpx;

          .left {
            display: flex;
            align-items: center;

            .icon {
              width: 48rpx;
              height: 48rpx;
              margin-right: 20rpx;
            }

            .text {
              font-size: 32rpx;
              font-weight: 500;
              color: #333333;
              line-height: 38rpx;
            }
          }

          .right {
            width: 16rpx;
            height: 25rpx;
          }
        }
      }
    }
  }
</style>
