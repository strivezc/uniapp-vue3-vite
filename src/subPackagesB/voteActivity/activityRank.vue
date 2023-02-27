<template>
  <uni-transition ref="ani" custom-class="transition" mode-class="fade" :show="show">
    <view class="activityRank">
      <view class="background">
        <image mode="widthFix" src="@img/rankBg.png" class="bg"></image>
        <!--      <image mode="widthFix" src="@img/bg.png" class="bg"></image>-->
        <view class="bg" style="background: #d02b33; height: 900rpx"></view>
      </view>
      <view class="info-wrap">
        <template v-if="list[1]">
          <text class="rank1-id">{{ list[1] ? list[1].voteId : '' }}号</text>
          <text class="rank1-name">{{ list[1] ? list[1].userName : '' }}</text>
          <text class="rank1-num">{{ list[1] ? list[1].voteNums : 0 }}票</text>
        </template>
        <template v-if="list[0]">
          <text class="rank2-id">{{ list[0] ? list[0].voteId : '' }}号</text>
          <text class="rank2-name">{{ list[0] ? list[0].userName : '' }}</text>
          <text class="rank2-num">{{ list[0] ? list[0].voteNums : 0 }}票</text>
        </template>
        <template v-if="list[2]">
          <text class="rank3-id">{{ list[2] ? list[2].voteId : '' }}号</text>
          <text class="rank3-name">{{ list[2] ? list[2].userName : '' }}</text>
          <text class="rank3-num">{{ list[2] ? list[2].voteNums : 0 }}票</text>
        </template>
      </view>
      <scroll-view
        class="scroll"
        scroll-y="true"
        :show-scrollbar="false"
        :lower-threshold="50"
        @scrolltolower="scrollLower"
      >
        <view class="content">
          <li class="li">
            <view class="label1">编号</view>
            <view class="label2">用户名</view>
            <view class="label3">票数</view>
            <view class="label4">排名</view>
          </li>
          <li class="li" v-for="item in list" :key="item.voteId">
            <view class="label1">{{ item.voteId }}号</view>
            <view class="label2">{{ item.userName }}</view>
            <view class="label3">{{ item.voteNums ? item.voteNums : '0' }}票</view>
            <view class="label4">{{ item.rank }}</view>
          </li>
        </view>
        <uni-load-more :status="status" color="#FF8086"></uni-load-more>
      </scroll-view>
    </view>

    <view class="tabBar-wrap">
      <view class="left">
        <view class="item-wrap">
          <view class="icon-text" @click="changePage">
            <image mode="widthFix" src="@img/activityIconGray.png" class="icon"></image>
            <text class="text gray">活动</text>
          </view>
          <view class="icon-text rank">
            <image mode="widthFix" src="@img/rankIcon.png" class="icon"></image>
            <text class="text">排名</text>
          </view>
        </view>
      </view>
      <view class="right" @click="enterActivity">立即报名</view>
    </view>
  </uni-transition>
</template>

<script>
  import { getToken } from '@/utils/auth';

  export default {
    name: 'activityRank',
    data() {
      return {
        show: false,
        status: 'more',
        list: [],
        allPage: 10,
        formData: {
          voteId: '',
          pageType: 1,
        },
        listQuery: {
          currPage: 1,
          pageSize: 10,
        },
      };
    },
    created() {
      this.getData();
      this.$nextTick(() => {
        this.show = !this.show;
      });
    },
    methods: {
      changePage() {
        uni.redirectTo({
          url: '/subPackagesB/voteActivity/activityDetail',
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
      scrollLower() {
        if (this.listQuery.currPage >= this.allPage) {
          this.status = 'noMore';
          return;
        } else {
          this.status = 'loading';
        }
        this.listQuery.currPage++;
        this.getData();
        console.log('我滚动到底部了');
      },
      async getData() {
        try {
          const params = {
            ...this.formData,
            ...this.listQuery,
          };
          const { resultData, totalCount } = await this.$http.vote.queryActivityContestants(params);
          if (this.listQuery.currPage === 1) {
            this.list = resultData;
          } else {
            this.list = this.list.concat(resultData);
          }
          this.allPage = Math.ceil(totalCount / this.listQuery.pageSize);
          if (this.allPage <= 1) {
            this.status = 'noMore';
          }
        } catch (e) {
          console.log(e, 'error');
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  .activityRank {
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

    .info-wrap {
      position: relative;
      width: 750rpx;
      height: 493rpx;
      font-size: 28rpx;
      font-weight: 400;
      color: #fee8b8;
      line-height: 28rpx;

      .rank1-id,
      .rank2-id,
      .rank3-id {
        position: absolute;
        top: 225rpx;
        left: 87rpx;
        display: block;
        text-align: center;
        width: 106rpx;
        font-size: 28rpx;
        font-weight: 500;
        color: #8d8d8d;
        line-height: 28rpx;
      }
      .rank2-id {
        position: absolute;
        top: 186rpx;
        left: 322rpx;
        color: #e98319;
        font-size: 36rpx;
      }
      .rank3-id {
        position: absolute;
        top: 225rpx;
        left: 559rpx;
        color: #cf8a5e;
        font-size: 28rpx;
      }
      .rank1-name {
        position: absolute;
        top: 326rpx;
        left: 32rpx;
        display: block;
        text-align: center;
        width: 218rpx;
      }

      .rank1-num {
        position: absolute;
        top: 359rpx;
        left: 85rpx;
        display: block;
        text-align: center;
        width: 129rpx;
      }

      .rank2-name {
        position: absolute;
        top: 289rpx;
        left: 268rpx;
        display: block;
        text-align: center;
        width: 218rpx;
      }

      .rank2-num {
        position: absolute;
        top: 322rpx;
        left: 313rpx;
        display: block;
        text-align: center;
        width: 129rpx;
      }

      .rank3-name {
        position: absolute;
        top: 326rpx;
        left: 505rpx;
        display: block;
        text-align: center;
        width: 218rpx;
      }

      .rank3-num {
        position: absolute;
        top: 359rpx;
        left: 566rpx;
        display: block;
        text-align: center;
        width: 96rpx;
      }
    }

    .scroll {
      min-height: 500rpx;
      max-height: 740rpx;
      /*margin-top: 40rpx;*/
    }

    .content {
      padding: 24rpx;
      margin-left: 26rpx;
      margin-right: 32rpx;
      background: #f9f9f9;
      border-radius: 16rpx;

      .li {
        display: flex;
        align-items: center;
        font-size: 28rpx;
        font-weight: 400;
        color: #333333;
        line-height: 28rpx;
        height: 88rpx;

        .label1 {
          width: 123rpx;
        }

        .label2 {
          width: 300rpx;
        }

        .label3 {
          width: 134rpx;
        }

        .label4 {
          width: 75rpx;
          text-align: center;
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
