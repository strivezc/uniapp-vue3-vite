<template>
  <uni-transition ref="ani" custom-class="transition" mode-class="fade" :show="show">
    <view class="activityDetail">
      <view class="background">
        <image mode="widthFix" src="@img/top-bg.png" class="bg"></image>
        <image mode="widthFix" src="@img/bg.png" class="bg"></image>
      </view>
      <view class="content">
        <image :src="activityStatistics.voteCoverImg" class="banner"></image>
        <image mode="widthFix" src="@img/logo-icon.png" class="logo"></image>
        <text class="title">{{ activityStatistics.voteSubheading }}</text>
        <!--      <text class="title2">{{activityStatistics.voteSubheading}}</text>-->
        <view class="statistic-wrap">
          <view class="item-wrap">
            <text class="text1">选手</text>
            <text class="text2">{{
              activityStatistics.playerNums ? activityStatistics.playerNums : '0'
            }}</text>
            <image mode="widthFix" src="@img/data-bg.png" class="img"></image>
          </view>
          <view class="item-wrap">
            <text class="text1">累计投票</text>
            <text class="text2">{{
              activityStatistics.totalVoteNums ? activityStatistics.totalVoteNums : '0'
            }}</text>
            <image mode="widthFix" src="@img/data-bg.png" class="img"></image>
          </view>
          <view class="item-wrap">
            <text class="text1">累计访问</text>
            <text class="text2">{{
              activityStatistics.activityVisits ? activityStatistics.activityVisits : '0'
            }}</text>
            <image mode="widthFix" src="@img/data-bg.png" class="img"></image>
          </view>
        </view>
        <image mode="scaleToFill" src="@img/splitLine.png" class="split-line"></image>
        <view class="logo-wrap">
          <image src="@img/element1.png" class="element"></image>
          <text class="text">距离投票结束</text>
          <image src="@img/element2.png" class="element"></image>
        </view>
        <view class="countdown-wrap">
          <text class="num" v-if="countdown.dayTime">{{ countdown.dayTime }}</text>
          <text class="text" v-if="countdown.dayTime">天</text>
          <text class="num" v-if="countdown.hourTime">{{ countdown.hourTime }}</text>
          <text class="text" v-if="countdown.hourTime">时</text>
          <text class="num" v-if="countdown.minuteTime">{{ countdown.minuteTime }}</text>
          <text class="text" v-if="countdown.minuteTime">分</text>
        </view>
        <view class="tab-wrap">
          <view class="left active" v-show="activeTab === 1" @click="changeActiveTab(1)"
            >参赛选手</view
          >
          <view class="right" v-show="activeTab === 1" @click="changeActiveTab(2)">活动介绍</view>
          <view class="left" v-show="activeTab === 2" @click="changeActiveTab(1)">参赛选手</view>
          <view class="right active" v-show="activeTab === 2" @click="changeActiveTab(2)"
            >活动介绍</view
          >
        </view>
      </view>

      <activityInfo :detail="activityDetail" v-show="activeTab === 2"></activityInfo>
      <contestant v-show="activeTab === 1"></contestant>
    </view>
    <view class="tabBar-wrap">
      <view class="left">
        <view class="item-wrap">
          <view class="icon-text">
            <image mode="widthFix" src="@img/activityIcon.png" class="icon"></image>
            <text class="text">活动</text>
          </view>
          <view class="icon-text rank" @click="changePage">
            <image mode="widthFix" src="@img/rankIconGray.png" class="icon"></image>
            <text class="text gray">排名</text>
          </view>
        </view>
      </view>
      <view class="right" @click="enterActivity">立即报名</view>
    </view>
  </uni-transition>
</template>

<script>
  import { formatSeconds } from '@/utils';
  import activityInfo from './components/activityInfo';
  import contestant from './components/contestant';
  import { getToken } from '@/utils/auth';

  export default {
    name: 'activityDetail',
    components: {
      activityInfo,
      contestant,
    },
    data() {
      return {
        activityDetail: {},
        activityStatistics: {},
        countdown: {
          dayTime: '',
          hourTime: '',
          minuteTime: '',
        },
        timer: null,
        secondTime: 0,
        activeTab: 1,
        show: false,
      };
    },
    onLoad(option) {
      console.log(option, 'option');
      if (option.activeTab) {
        this.activeTab = Number(option.activeTab);
      }
    },
    created() {
      this.getActivityDetail();
      this.getActivityStatistics();
      this.$nextTick(() => {
        this.show = !this.show;
      });
    },
    methods: {
      changePage() {
        uni.redirectTo({
          url: '/subPackagesB/voteActivity/activityRank',
        });
      },
      enterActivity() {
        if (!getToken()) {
          uni.navigateTo({
            url: '/subPackagesA/personal/chooseLoginType?redirect=/subPackagesB/voteActivity/activityEnter',
          });
        } else {
          uni.navigateTo({
            url: '/subPackagesB/voteActivity/activityEnter',
          });
        }
      },
      changeActiveTab(val) {
        this.activeTab = val;
      },
      async getActivityDetail() {
        try {
          const { resultData } = await this.$http.vote.queryActivityDetails();
          this.activityDetail = resultData;
        } catch (e) {
          console.log(e, 'error');
        }
      },
      async getActivityStatistics() {
        try {
          const { resultData } = await this.$http.vote.queryActivityStatistics();
          this.activityStatistics = resultData;
          uni.setNavigationBarTitle({
            title: this.activityStatistics.voteName,
          });
          // 倒计时
          let voteEndTime = resultData.voteEndTime.replace(/-/g, '/');
          this.secondTime = (new Date(voteEndTime).getTime() - new Date().getTime()) / 1000;
          if (this.secondTime > 60) {
            this.countdown = formatSeconds(this.secondTime);
            this.timer = setInterval(() => {
              if (this.secondTime > 60) {
                this.secondTime = this.secondTime - 60;
                this.countdown = formatSeconds(this.secondTime);
              } else {
                clearInterval(this.timer);
                this.timer = null;
                this.countdown = {
                  dayTime: '0',
                  hourTime: '0',
                  minuteTime: '0',
                };
              }
            }, 60000);
          } else {
            this.countdown = {
              dayTime: '0',
              hourTime: '0',
              minuteTime: '0',
            };
          }
        } catch (e) {
          uni.showToast({
            title: e.resultMessage,
            icon: 'none',
            duration: 3000,
          });
        }
      },
    },
    onUnload() {
      clearInterval(this.timer);
    },
  };
</script>

<style scoped lang="scss">
  .activityDetail {
    .background {
      position: absolute;
      left: 0;
      bottom: 0;
      display: block;
      width: 100%;
      height: 100%;
      z-index: -999;

      .bg {
        display: block;
        width: 100%;
        vertical-align: top;
        font-size: 0rpx;
      }
    }

    .content {
      .banner {
        border-radius: 16rpx 16rpx 16rpx 16rpx;
        display: block;
        margin: auto;
        margin-top: 138rpx;
        width: 686rpx;
        height: 304rpx;
      }

      .logo {
        display: block;
        margin: auto;
        margin-top: 60rpx;
        width: 467rpx;
      }

      .title {
        display: block;
        margin-top: 20rpx;
        text-align: center;
        font-size: 32rpx;
        font-weight: bold;
        color: #fee8b8;
        line-height: 50rpx;
        text-shadow: 0px 4rpx 4rpx #cc171f;
        padding: 0 20rpx;
      }

      .title2 {
        display: block;
        text-align: center;
        width: 352rpx;
        padding-top: 20rpx;
        margin: auto;
        font-size: 32rpx;
        font-weight: bold;
        color: #fee8b8;
        line-height: 50rpx;
        text-shadow: 0px 4rpx 4rpx #cc171f;
      }

      .statistic-wrap {
        padding: 0 32rpx;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 30rpx;

        .item-wrap {
          position: relative;
          width: 220rpx;
          height: 207rpx;

          .img {
            position: absolute;
            z-index: -1;
            display: block;
            width: 220rpx;
            height: 207rpx;
          }

          .text1 {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: 3rpx;
            font-size: 24rpx;
            font-weight: bold;
            color: #e73d45;
            line-height: 34rpx;
          }

          .text2 {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: 69rpx;
            font-size: 42rpx;
            font-weight: bold;
            color: #fee8b8;
            line-height: 53rpx;
          }
        }
      }

      .split-line {
        margin-top: 60rpx;
        width: 100%;
        height: 6rpx;
        /*filter: blur(20px);*/
      }

      .logo-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 60rpx;

        .element {
          width: 80rpx;
          height: 68rpx;
        }

        .text {
          padding: 0 6rpx;
          font-size: 40rpx;
          font-weight: bold;
          color: #fee8b8;
          line-height: 47rpx;
        }
      }

      .countdown-wrap {
        display: block;
        margin: auto;
        margin-top: 10rpx;
        text-align: center;

        .num {
          background: #fee8b8;
          font-size: 40rpx;
          font-weight: bold;
          color: #e73d45;
          line-height: 40rpx;
          padding: 0rpx 6rpx;
          border-radius: 10rpx;
          margin-right: 8rpx;
        }

        .text {
          font-size: 40rpx;
          font-weight: bold;
          color: #fee8b8;
          margin-right: 8rpx;
        }
      }

      .tab-wrap {
        display: flex;
        align-items: center;
        border-top: 1px solid #fee8b8;
        border-bottom: 1px solid #fee8b8;
        font-size: 36rpx;
        font-weight: bold;
        color: #fee8b8;
        height: 88rpx;
        line-height: 88rpx;
        text-align: center;
        margin-top: 48rpx;

        .left {
          position: relative;
          width: 50%;
          color: #fee8b8;
        }

        .right {
          position: relative;
          width: 50%;
          color: #fee8b8;
        }

        .active {
          background: #fee8b8;
          color: #e73d45;

          &:after {
            position: absolute;
            bottom: -16rpx;
            left: 50%;
            transform: translateX(-50%);
            content: '';
            border-top: 16rpx solid #fee8b8;
            border-left: 16rpx solid transparent;
            border-right: 16rpx solid transparent;
          }
        }
      }
    }
  }
  .tabBar-wrap {
    position: fixed;
    bottom: 0;
    z-index: 99;
    height: 100rpx;
    width: 100%;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: env(safe-area-inset-bottom);

    .left {
      margin-top: 6rpx;
      display: flex;
      align-items: center;
      padding-left: 43rpx;

      .item-wrap {
        display: flex;
        /*align-items: center;*/
        /*justify-content: center;*/
        .icon-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 80rpx;

          .icon {
            width: 64rpx;
          }

          .text {
            font-size: 20rpx;
            font-weight: 400;
            color: #e73d45;
            line-height: 28rpx;
          }

          .gray {
            color: #858585;
          }
        }

        .rank {
          margin-left: 57rpx;
        }
      }
    }

    .right {
      width: 391rpx;
      height: 88rpx;
      text-align: center;
      background: linear-gradient(180deg, #ea313a 0%, #ff6068 100%);
      border-radius: 60rpx 60rpx 60rpx 60rpx;
      font-size: 32rpx;
      font-weight: bold;
      color: #ffffff;
      line-height: 88rpx;
      margin-right: 40rpx;
    }
  }
</style>
