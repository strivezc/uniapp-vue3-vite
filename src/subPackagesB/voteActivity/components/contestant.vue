<template>
  <view class="contestant">
    <view class="input-wrap">
      <input type="number" v-model="formData.voteId" placeholder="输入选手编号搜索" class="input" />
      <view class="btn" @click="search">搜索</view>
    </view>
    <view class="personal-info" v-if="voteId" @click="toIndividualDetail(voteId)">
      <view class="left">
        <text>我的编号: {{ voteId }}号</text>
        <text class="ml-50">票数: {{ voteNums }}票</text>
      </view>
      <view class="right">
        <text>去拉票</text>
        <image mode="widthFix" src="@img/union.png" class="union"></image>
      </view>
    </view>
    <scroll-view
      class="scroll"
      scroll-y="true"
      :show-scrollbar="false"
      :lower-threshold="50"
      @scrolltolower="scrollLower"
    >
      <view class="item-wrap" v-for="item in list" :key="item.voteId">
        <view class="voteId">{{ item.voteId }}</view>
        <image mode="aspectFill" :src="item.contestImg" class="img"></image>
        <text class="name">{{ item.userName }}</text>
        <text class="num">{{ item.voteNums ? item.voteNums : 0 }}票</text>
        <view class="bottom-wrap" @click="toIndividualDetail(item.voteId)">
          <text class="text">为Ta拉票</text>
          <view class="vote-btn">给Ta投票</view>
        </view>
      </view>
      <uni-load-more :status="status" color="#FF8086"></uni-load-more>
    </scroll-view>
  </view>
</template>

<script>
  import { getToken } from '@/utils/auth';

  export default {
    name: 'contestant',
    data() {
      return {
        status: 'more',
        list: [],
        allPage: 10,
        formData: {
          voteId: '',
          pageType: 0,
        },
        listQuery: {
          currPage: 1,
          pageSize: 10,
        },
        voteId: '',
        voteNums: '',
      };
    },
    created() {
      this.getData();
      this.getUserVoteId();
      uni.$on('refreshContestantData', this.refreshData);
    },
    methods: {
      refreshData() {
        console.log('refreshData');
        this.getData();
        this.getUserVoteId();
      },
      async getUserVoteId() {
        if (getToken()) {
          try {
            const { resultData } = await this.$http.vote.queryUserVoteId();
            this.voteId = resultData.voteId ? resultData.voteId : '';
            this.voteNums = resultData.voteNums ? resultData.voteNums : '0';
          } catch (e) {
            console.log(e, 'error');
          }
        }
      },
      toIndividualDetail(voteId) {
        uni.navigateTo({ url: `/subPackagesB/voteActivity/individualDetail?voteId=${voteId}` });
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
      search() {
        this.listQuery.currPage = 1;
        this.getData();
      },
    },
    destroyed() {
      console.log('onUnload-refreshContestantData');
      uni.$off('refreshContestantData');
    },
  };
</script>

<style scoped lang="scss">
  .contestant {
    margin-top: 88rpx;
    padding: 0 36rpx;
    padding-bottom: 160rpx;
    background: #d02b33;
    .input-wrap {
      background: #ffffff;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      height: 88rpx;
      /*position: sticky;*/
      /*top: 0;*/
      /*overflow: visible !important;*/
      /*z-index: 2;*/
      .input {
        height: 88rpx;
        width: 100%;
      }

      .btn {
        width: 99rpx;
        padding: 0 18rpx;
        height: 68rpx;
        background: linear-gradient(180deg, #ea313a 0%, #ff6068 100%);
        border-radius: 16rpx 16rpx 16rpx 16rpx;
        font-size: 32rpx;
        font-weight: 400;
        color: #ffffff;
        line-height: 68rpx;
        text-align: center;
      }
    }
    .personal-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 88rpx;
      background: linear-gradient(125deg, #fee8b8 0%, #fffbf3 100%);
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      font-size: 28rpx;
      font-weight: 500;
      color: #e02b33;
      line-height: 32rpx;
      padding: 0 30rpx;
      margin-top: 40rpx;
      .left {
      }
      .right {
        .union {
          width: 13rpx;
          margin-left: 10rpx;
        }
      }
      .ml-50 {
        margin-left: 50rpx;
      }
    }

    .scroll {
      /*display: flex;*/
      /*flex-wrap: wrap;*/
      /*justify-content: space-between;*/
      min-height: 500rpx;
      max-height: 1150rpx;
      margin-top: 40rpx;
      position: sticky;
      top: 128rpx;
      overflow: visible !important;
      z-index: 1;
    }

    .item-wrap {
      /*display: flex;*/
      /*flex-direction: column;*/
      /*justify-content: center;*/
      position: relative;
      display: inline-block;
      margin-top: 40rpx;
      width: 300rpx;
      background: #ffffff;
      padding: 10rpx 10rpx 20rpx 10rpx;
      border-radius: 16rpx 16rpx 16rpx 16rpx;

      .voteId {
        position: absolute;
        top: 10rpx;
        left: 10rpx;
        width: 78rpx;
        height: 38rpx;
        background: #e73d45;
        font-size: 24rpx;
        font-weight: 400;
        color: #fae8ba;
        line-height: 38rpx;
        text-align: center;
        border-radius: 16rpx 0 16rpx 0;
      }

      &:nth-child(odd) {
        margin-right: 38rpx;
      }

      .img {
        width: 300rpx;
        height: 300rpx;
        border-radius: 16rpx 16rpx 16rpx 16rpx;
      }

      .name {
        margin-top: 20rpx;
        font-size: 32rpx;
        font-weight: 400;
        color: #333333;
        line-height: 24rpx;
        align-self: center;
        margin-left: 10rpx;
        margin-right: 10rpx;
        display: block;
        text-align: center;
      }

      .num {
        display: block;
        padding-bottom: 16rpx;
        font-size: 32rpx;
        font-weight: 400;
        color: #e73d45;
        line-height: 32rpx;
        border-bottom: 1px dashed #ffa9ad;
        text-align: center;
        margin: 0 10rpx;
        padding-top: 16rpx;
      }

      .bottom-wrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 22rpx;

        .text {
          font-size: 26rpx;
          font-weight: 400;
          color: #e73d45;
          line-height: 28rpx;
          margin-left: 10rpx;
          margin-right: 10rpx;
          border-bottom: 1px solid #e73d45;
        }

        .vote-btn {
          width: 145rpx;
          height: 56rpx;
          background: linear-gradient(180deg, #ea313a 0%, #ff6068 100%);
          border-radius: 60rpx 60rpx 60rpx 60rpx;
          text-align: center;
          font-size: 26rpx;
          font-weight: 400;
          color: #ffffff;
          line-height: 56rpx;
          margin-right: 10rpx;
        }
      }
    }
  }
</style>
