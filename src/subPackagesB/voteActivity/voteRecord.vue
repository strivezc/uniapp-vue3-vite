<template>
  <scroll-view class="voteRecord" scroll-y="true" :show-scrollbar="false"
               :lower-threshold="50" @scrolltolower="scrollLower"
               refresher-enabled="true" :refresher-triggered="triggered"
               :refresher-threshold="50" refresher-background="transparent"
               @refresherrefresh="onRefresh" @refresherrestore="onRestore"
              >
    <view class="li" v-for="(item,index) in list" :key="index">
      <view class="title">{{item.voteName}}</view>
      <view class="text-wrap">
        <view class="left">手机号</view>
        <view class="right">{{item.voteUserPhone}}</view>
      </view>
      <view class="text-wrap">
        <view class="left">投票</view>
        <view class="right">{{item.voteNums}}票</view>
      </view>
    </view>
    <uni-load-more :status="status" color="#999999"></uni-load-more>
  </scroll-view>
</template>

<script>
export default {
  name: "voteRecord",
  data() {
    return {
      status: 'more',
      _freshing:false,
      triggered: false,
      list: [],
      listQuery: {
        currPage: 1,
        pageSize: 10
      }
    };
  },
  onLoad() {
    this._freshing = false;
    setTimeout(() => {
      this.triggered = true;
    })
  },
  methods: {
    onRefresh() {
      if (this._freshing) return;
      this._freshing = true;

      this.listQuery.currPage=1;
      this.getData(true);
    },
    onRestore() {
      this.triggered = 'restore';
      console.log("onRestore");
    },
    scrollLower() {
      if (this.listQuery.currPage >= this.allPage) {
        this.status = "noMore";
        return
      } else {
        this.status = "loading";
      }
      this.listQuery.currPage++
      this.getData();
      console.log('我滚动到底部了')
    },
    async getData(refresh) {
      try {
        const params = {
          ...this.listQuery
        }
        const {resultData, totalCount} = await this.$http.vote.queryVoteRecord(params);
        if (this.listQuery.currPage === 1) {
          this.list = resultData;
          if (refresh) { //刷新完重置状态
            this.triggered = false;
            this._freshing = false;
          }
        } else {
          this.list = this.list.concat(resultData)
        }
        this.allPage = Math.ceil(totalCount / this.listQuery.pageSize);
        if (this.allPage <= 1) {
          this.status = "noMore";
        }
      } catch (e) {
        console.log(e, 'error');
        if (refresh) { //刷新完重置状态
          this.triggered = false;
          this._freshing = false;
        }
      }
    },
  }
}
</script>

<style scoped lang="scss">
  .voteRecord {
    padding: 0 32rpx;
    height: 95vh;
    box-sizing: border-box;

    .li {
      display: flex;
      flex-direction: column;
      padding: 32rpx;
      box-shadow: 0 6rpx 32rpx 0 rgba(69, 104, 124, 0.04);
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      margin-top: 21rpx;

      .title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
        line-height: 40rpx;
        padding-bottom: 24rpx;
        border-bottom: 1px solid #EEEEEF;
      }

      .text-wrap {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 28rpx;
        line-height: 28rpx;
        margin-top: 30rpx;
        font-weight: 400;

        .left {
          width: 84rpx;
          color: #999999;
        }

        .right {
          margin-left: 30rpx;
          color: #000000;
        }
      }
    }
  }
</style>
