<template>
  <view class="uni-popup-share">
    <view class="uni-share-title">
      <text class="uni-share-title-text">{{ title }}</text>
    </view>
    <view class="uni-share-content">
      <view class="uni-share-content-box">
        <view
          class="uni-share-content-item"
          v-for="(item, index) in bottomData"
          :key="index"
          @click.stop="select(item)"
        >
          <image class="uni-share-image" :src="item.icon" mode="aspectFill"></image>
          <text class="uni-share-text">{{ item.text }}</text>
          <button class="shareMask" open-type="share" v-if="item.name === 'wechat'"></button>
        </view>
      </view>
    </view>
    <view class="uni-share-button-box">
      <view class="uni-share-button" @click="close">取消</view>
    </view>
  </view>
</template>

<script>
  import downloadIcon from '@img/download.png';
  import wechat from '@img/wechat.png';
  import moments from '@img/moments.png';

  const shareArr = [
    { text: '好友', icon: wechat, name: 'wechat' },
    { text: '朋友圈', icon: moments, name: 'moments' },
    { text: '下载图片', icon: downloadIcon, name: 'download' },
  ];

  export default {
    name: 'UniPopupShare',
    props: {
      title: {
        type: String,
        default: '分享到',
      },
      shareType: {
        type: Array,
        default() {
          return [2];
        },
      },
    },
    computed: {
      bottomData() {
        let arr = [];
        for (let i = 0; i < this.shareType.length; i++) {
          arr.push(shareArr[this.shareType[i]]);
        }
        return arr;
      },
    },
    methods: {
      /**
       * 选择内容
       */
      select(item) {
        this.$emit('select', item);
        this.close();
      },
      /**
       * 关闭窗口
       */
      close() {
        this.$emit('close');
      },
    },
  };
</script>
<style lang="scss">
  .uni-popup-share {
    background-color: #f4f6f8;
    border-top-left-radius: 11px;
    border-top-right-radius: 11px;
  }

  .uni-share-title {
    padding-top: 36rpx;
    margin-left: 42rpx;
  }

  .uni-share-title-text {
    font-size: 24rpx;
    font-weight: 400;
    color: #8d949b;
    line-height: 28rpx;
  }

  .uni-share-content {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: row;
    justify-content: center;
    padding-top: 36rpx;
    padding-left: 6rpx;
    padding-right: 6rpx;
  }

  .uni-share-content-box {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    padding-bottom: 36rpx;
  }

  .uni-share-content-item {
    position: relative;
    width: 120rpx;
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: column;
    justify-content: center;
    padding-right: 30rpx;
    padding-left: 30rpx;
    align-items: center;
    .shareMask {
      position: absolute;
      top: 0;
      left: 30rpx;
      width: 120rpx;
      height: 140rpx;
      background: transparent;
      &::after {
        border: none;
      }
    }
  }

  .uni-share-image {
    width: 120rpx;
    height: 120rpx;
  }

  .uni-share-text {
    margin-top: 16rpx;
    font-size: 24rpx;
    font-weight: 400;
    color: #222325;
    line-height: 28rpx;
  }

  .uni-share-button-box {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: row;
  }

  .uni-share-button {
    flex: 1;
    height: 98rpx;
    font-size: 32rpx;
    font-weight: 400;
    color: #222325;
    text-align: center;
    line-height: 98rpx;
    background: #ffffff;
  }
</style>
