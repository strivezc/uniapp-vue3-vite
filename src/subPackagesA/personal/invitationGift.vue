<template>
  <view class="invitationGift" :class="mask ? 'tl-show' : ''">
    <view class="rules" @click="openRules">邀请规则</view>
    <image mode="widthFix" class="img" @error="imageError" :src="backGroundUrl"></image>
    <view class="btn-bottom">
      <!--      <button class="btn-login btn" @click="handleShare" open-type="share">一键分享</button>-->
      <button class="btn-login btn" @click="handleShare">一键分享</button>
    </view>

    <my-painter :template="template" @getImageUrl="getImageUrl"></my-painter>

    <image :src="imageUrl" mode="widthFix" class="poster" v-show="showPoster"></image>
    <uni-popup ref="share" type="share" @maskClick="close" safeArea backgroundColor="#fff">
      <popupShare @close="close" @select="selectType" :shareType="[0, 2]"></popupShare>
    </uni-popup>
    <richTextDialog
      ref="richTextDialog"
      @close="mask = false"
      @handleAction="handleShare"
      title="活动规则"
      :content="rulesContent"
      button-text="去分享"
    >
    </richTextDialog>
  </view>
</template>

<script>
  import UserService from '@/api/UserService';
  import myPainter from '@/components/painter';
  import popupShare from '@/components/popupShare/index';
  import richTextDialog from '@/components/richTextDialog';
  import { palette } from './image';

  export default {
    name: 'invitationGift',
    components: {
      myPainter,
      popupShare,
      richTextDialog,
    },
    data() {
      return {
        backGroundUrl: '',
        imageUrl: '',
        template: {},
        showPoster: false,
        mask: false,
        rulesContent: '',
        qrcode: '',
        pcImageUrl: '', // 活动顶部图
        shareLink: '', // 分享的h5链接
      };
    },
    onLoad() {
      this.getActivityInfo();
      uni.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage'],
      });
    },
    onShow() {},
    onShareAppMessage: function () {
      let path = '/components/webview/index';
      let weburl = encodeURIComponent(this.shareLink);
      path += `?url=${weburl}`;
      return {
        path: path,
        imageUrl: this.pcImageUrl,
      };
    },
    methods: {
      imageError(e) {
        if (e.detail.errMsg) {
          this.backGroundUrl =
            'https://talk915-1302759139.cos.ap-beijing.myqcloud.com/data/image/25b1471fc3744479a53ba1c7fdbe7d16.png';
          this.template = palette(this.backGroundUrl, this.qrcode);
          this.pcImageUrl = this.backGroundUrl;
        }
      },
      async openRules() {
        try {
          const { resultData } = await UserService.queryActivityAppRules();
          this.mask = true;
          this.rulesContent = resultData;
          this.$refs.richTextDialog.open();
        } catch (e) {
          console.log(e, 'error');
        }
      },
      getImageUrl(url) {
        this.imageUrl = url;
      },
      async getActivityInfo() {
        try {
          const { resultData } = await UserService.activityShareImageUrl();
          console.log(resultData, 'resultData');
          this.backGroundUrl = resultData.backGroundUrl;
          this.qrcode = resultData.shareUrl;
          this.pcImageUrl = resultData.pcImageUrl;
          this.shareLink = resultData.shareLink;
          let imageUrl = resultData.imageUrl;
          if (imageUrl) {
            imageUrl = imageUrl.replace(
              'cos.talk915.com',
              'talk915-1302759139.cos.ap-beijing.myqcloud.com'
            );
          }
          console.log(imageUrl, 'imageUrl');
          this.template = palette(imageUrl, this.qrcode);
        } catch (e) {
          console.log(e, 'error');
        }
      },
      handleShare() {
        this.$refs.share.open();
        this.mask = true;
        this.showPoster = true;
      },
      close() {
        this.$refs.share.close();
        this.mask = false;
        this.showPoster = false;
      },
      selectType(item) {
        if (item.name === 'download') {
          if (this.imageUrl) {
            this.downImage();
          }
        }
      },
      downImage() {
        uni.saveImageToPhotosAlbum({
          filePath: this.imageUrl,
          success: function () {
            uni.showToast({
              title: '下载成功！',
              icon: 'none',
              duration: 3000,
            });
          },
          fail: function (err) {
            uni.showModal({
              title: '提示',
              content: '需要您授权保存相册',
              showCancel: false,
              success() {
                uni.openSetting({
                  success(settingdata) {
                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                      //是否授权保存到相册
                      uni.showModal({
                        title: '提示',
                        content: '获取权限成功,再次保存图片即可成功',
                        showCancel: false,
                      });
                    } else {
                      uni.showModal({
                        title: '提示',
                        content: '获取权限失败，无法保存到相册',
                        showCancel: false,
                      });
                    }
                  },
                });
              },
            });
          },
        });
      },
    },
  };
</script>

<style scoped lang="scss">
  .img {
    width: 100%;
  }

  image {
    will-change: transform;
  }

  .poster {
    position: fixed;
    top: 50rpx;
    left: 50%;
    z-index: 999;
    transform: translateX(-50%);
    width: 500rpx;
  }

  .btn-bottom {
    position: fixed;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 134rpx;
    background: #ffffff;

    .btn {
      width: 654rpx;
      background: #0087ff !important;
    }
  }

  .rules {
    position: fixed;
    top: 36rpx;
    z-index: 1;
    background: #ffffff;
    border-radius: 50rpx 0rpx 0rpx 50rpx;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50rpx;
    width: 142rpx;
    font-size: 24rpx;
    font-weight: 500;
    color: #0087ff;
    line-height: 32rpx;
  }
</style>
