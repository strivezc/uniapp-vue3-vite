<template>
  <view class="activityInfo">
    <image mode="widthFix" src="@img/reel.png" class="reel"></image>
    <view class="content">
      <text class="title">一、活动时间</text>
      <text class="text">活动时间：{{ detail.activityTime }}</text>
      <text class="text">投票时间：{{ detail.voteTime }}</text>
      <text class="title">二、投票规则</text>
      <text class="text"
        >每个账号有
        {{ detail.voteRuleNum }} 张票，在投票时间内投票即可。不限制每日的投票数量，投完为止。</text
      >
      <text class="title">三、活动奖励</text>
      <rich-text :nodes="detail.activityRewards" class="text"></rich-text>
      <text class="title">四、活动详情</text>
      <rich-text :nodes="detail.activityExplain" class="text"></rich-text>
    </view>
    <image mode="widthFix" src="@img/reel.png" class="reel deviation"></image>
  </view>
</template>

<script>
  export default {
    name: 'activityInfo',
    props: {
      detail: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    data() {
      return {};
    },
  };
</script>

<style scoped lang="scss">
  .activityInfo {
    /*margin-top: 88rpx;*/
    margin-bottom: 160rpx;
    background: #d02b33;
    .reel {
      width: 750rpx;
      display: block;
      vertical-align: top;
      font-size: 0rpx;
    }
    .deviation {
      margin-top: -62rpx;
      padding-bottom: 160rpx;
    }
    .content {
      padding: 46rpx;
      padding-top: 0;
      margin: 0 46rpx;
      background: #ffebc0;
      margin-top: -42rpx;
      .title {
        display: block;
        font-size: 36rpx;
        color: #d02b33;
        line-height: 42rpx;
        font-weight: bold;
        padding-top: 46rpx;
      }
      .text {
        display: block;
        font-size: 28rpx;
        line-height: 38rpx;
        color: #000000;
        margin-top: 8rpx;
        word-break: break-all;
        white-space: pre-line;
      }
    }
  }
</style>
