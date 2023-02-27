<template>
  <view class="individualDetail" :class="mask ? 'tl-show' : ''">
    <view class="rules" @click="openRules">活动介绍</view>
    <view class="background">
      <image mode="scaleToFill" src="@img/enterBg.png" class="bg"></image>
    </view>
    <image mode="widthFix" src="@img/enterReel.png" class="img"></image>
    <scroll-view class="scroll" scroll-y="true" :show-scrollbar="false">
      <view class="content">
        <view class="voteId">编号：{{ contestantInfo.voteId || '' }}</view>
        <view class="name">{{ contestantInfo.userName || '' }}</view>
        <view class="rank-wrap">
          <view class="left">当前第 {{ contestantInfo.rank || '' }} 名</view>
          <view class="right">
            <view class="top">{{ contestantInfo.voteNums || '' }}票</view>
            <view class="bottom">距离前一名{{ contestantInfo.upOneVoteNums || '' }}票</view>
          </view>
        </view>
        <image mode="widthFix" :src="contestantInfo.contestImg" class="shareImage"></image>
      </view>
    </scroll-view>

    <my-painter :template="template" @getImageUrl="getImageUrl"></my-painter>
    <image mode="widthFix" v-show="showPoster" :src="imageUrl" class="poster"></image>
    <view class="btn-group">
      <button class="btn left" @click="toShare"> 为Ta拉票</button>
      <button class="btn right" @click="userToVote">为Ta投票</button>
    </view>
    <uni-popup ref="share" type="share" @maskClick="close" safeArea backgroundColor="#fff">
      <popupShare @close="close" @select="selectType" :shareType="[0, 2]"></popupShare>
    </uni-popup>
    <richTextDialog
      ref="richTextDialog"
      @close="mask = false"
      title="活动详情"
      :content="rulesContent"
      button-text="确定"
    >
    </richTextDialog>
  </view>
</template>

<script>
  import { param2Obj } from '@/utils';
  import { setRecommendCode } from '@/utils/auth';
  import myPainter from '@/components/painter';
  import popupShare from '@/components/popupShare/index';
  import richTextDialog from '@/components/richTextDialog';
  import { palette } from './components/image';

  export default {
    name: 'enterResult',
    components: {
      popupShare,
      richTextDialog,
      myPainter,
    },
    data() {
      return {
        mask: false,
        voteId: '',
        recommendCode: '',
        rulesContent: '',
        imageUrl: '',
        showPoster: false,
        shareInfo: {},
        contestantInfo: {},
        template: {},
      };
    },
    onLoad(query) {
      let voteId = query.voteId;
      let recommendCode = query.recommendCode;
      if (!voteId) {
        let url = decodeURIComponent(query.q);
        const obj = param2Obj(url);
        voteId = obj.voteId;
        recommendCode = obj.recommendCode;
      }
      console.log(recommendCode, 'recommendCode');
      if (recommendCode) {
        this.recommendCode = recommendCode;
        setRecommendCode(recommendCode);
        this.$store.dispatch('user/setRecommendCode', recommendCode);
      }
      console.log(query, 'query');
      if (!voteId) {
        console.log('没有携带id');
        this.getUserVoteId();
      } else {
        console.log('有携带id');
        this.voteId = voteId;
        this.getInfoCanvass();
        this.getContestantInfo();
      }
      uni.$on('refreshIndividualData', this.refreshData);
    },
    onShareAppMessage(res) {
      if (res.from === 'button') {
        // 来自页面内分享按钮
        console.log(res.target);
      }
      return {
        title: `帮我投一票，${this.shareInfo.userName}正在参加${this.shareInfo.voteName}`,
        path: `/subPackagesB/voteActivity/individualDetail?voteId=${this.voteId}&recommendCode=${this.shareInfo.userDistributorCode}`,
        imageUrl: this.shareInfo.contestImg,
      };
    },
    methods: {
      getImageUrl(url) {
        this.imageUrl = url;
      },
      refreshData() {
        this.getContestantInfo();
        this.getInfoCanvass();
      },
      async userToVote() {
        try {
          uni.showLoading({
            title: '投票中',
          });
          const { resultData } = await this.$http.vote.userToVote(this.voteId);
          setTimeout(() => {
            uni.hideLoading();
            let upOneVoteNums = resultData.upOneVoteNums;
            let surplusVoteNums = resultData.surplusVoteNums;
            uni.navigateTo({
              url: `/subPackagesB/voteActivity/userVoteResult?voteId=${this.voteId}&upOneVoteNums=${upOneVoteNums}&surplusVoteNums=${surplusVoteNums}`,
            });
            uni.$emit('refreshIndividualData');
            uni.$emit('refreshContestantData');
          }, 1500);
        } catch (e) {
          if (e.resultCode === -1) {
            let url = `/subPackagesB/voteActivity/individualDetail`;
            uni.navigateTo({
              url: `/subPackagesA/personal/chooseLoginType?redirect=${url}&voteId=${this.voteId}&recommendCode=${this.recommendCode}`,
            });
          } else {
            uni.showToast({
              title: e.resultMessage,
              icon: 'none',
              duration: 3000,
            });
          }
          console.log(e, 'error');
        }
      },
      async getUserVoteId() {
        try {
          const { resultData } = await this.$http.vote.queryUserVoteId();
          this.voteId = resultData.voteId;
          this.getContestantInfo();
          this.getInfoCanvass();
        } catch (e) {
          console.log(e, 'error');
        }
      },
      async getContestantInfo() {
        try {
          const { resultData } = await this.$http.vote.queryContestantInfo(this.voteId);
          this.contestantInfo = resultData;
        } catch (e) {
          console.log(e, 'error');
        }
      },
      async getInfoCanvass() {
        try {
          const { resultData } = await this.$http.vote.getInfoCanvass(this.voteId);
          this.shareInfo = resultData;
          let tagType = resultData.tagType;
          let url =
            process.env.NODE_ENV === 'production'
              ? 'https://www.talk915.com'
              : 'https://test.talk915.com';
          this.template = palette({
            url: require('@img/shareBg.png'),
            code: `${url}/h5/static/?voteId=${this.shareInfo.voteId}&recommendCode=${this.shareInfo.userDistributorCode}`,
            avtar: require(`@img/0${tagType + 1}.png`),
            icon1: require('@img/element1.png'),
            icon2: require('@img/element2.png'),
            text1: `我是 ${this.shareInfo.voteId}号 选手`,
            text2: this.shareInfo.userName,
          });
          console.log(`${url}/h5/static/?voteId=${this.shareInfo.voteId}`, '分享二维码链接');
        } catch (e) {
          console.log(e, 'error');
        }
      },
      openRules() {
        uni.reLaunch({ url: '/subPackagesB/voteActivity/activityDetail?activeTab=2' });
        // this.mask = true;
        // this.rulesContent = this.contestantInfo.activityExplain;
        // this.$refs.richTextDialog.open()
      },
      close() {
        this.$refs.share.close();
        this.mask = false;
        this.showPoster = false;
      },
      toShare() {
        this.$refs.share.open();
        this.mask = true;
        this.showPoster = true;
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
          fail: function () {
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
    onUnload() {
      uni.$off('refreshIndividualData');
    },
  };
</script>

<style scoped lang="scss">
  .individualDetail {
    height: 100%;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      display: block;
      width: 100%;
      z-index: -999;

      .bg {
        display: block;
        width: 100%;
        height: 100vh;
        vertical-align: top;
        font-size: 0rpx;
      }
    }

    .img {
      width: 100%;
      margin-top: -3rpx;
    }

    .poster {
      position: fixed;
      top: 50rpx;
      left: 50%;
      z-index: 999;
      transform: translateX(-50%);
      width: 500rpx;
    }

    .scroll {
      min-height: 500rpx;
      max-height: calc(100vh - 50rpx);
    }

    .content {
      padding: 0 70rpx;

      .voteId {
        margin-top: 30rpx;
        font-size: 32rpx;
        font-weight: 500;
        color: #fee8b8;
        line-height: 32rpx;
      }

      .name {
        margin-top: 40rpx;
        font-size: 40rpx;
        font-weight: bold;
        color: #fee8b8;
        line-height: 40rpx;
      }

      .rank-wrap {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 30rpx;
        margin-top: 30rpx;
        height: 62rpx;
        background: linear-gradient(125deg, #fee8b8 0%, #fffbf3 100%);
        border-radius: 16rpx 16rpx 16rpx 16rpx;

        .left {
          font-size: 36rpx;
          font-weight: 500;
          color: #e02b33;
        }

        .right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;

          .top {
            font-size: 40rpx;
            font-weight: bold;
            color: #db262e;
          }

          .bottom {
            margin-top: 12rpx;
            font-size: 26rpx;
            font-weight: 500;
            color: #db262e;
          }
        }
      }

      .introduction {
        margin-top: 30rpx;
        width: 605rpx;
      }

      .introduction-text {
        margin-top: 30rpx;
        font-size: 28rpx;
        font-weight: 500;
        color: #fee8b8;
        line-height: 48rpx;
      }

      .shareImage {
        margin-top: 40rpx;
        width: 100%;
        padding-bottom: 200rpx;
      }
    }

    .btn-group {
      position: fixed;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      /*padding: 6rpx 30rpx;*/
      height: 100rpx;
      background: #ffffff;
      padding-bottom: env(safe-area-inset-bottom);

      .btn {
        width: 340rpx;
        height: 88rpx;
        border-radius: 64rpx 64rpx 64rpx 64rpx;
        border: 1px solid #e73d45;
        font-size: 32rpx;
        line-height: 88rpx;
        font-weight: bold;
        color: #e73d45;
        padding: 0;

        &::after {
          border: none;
        }
      }

      .left {
        background: #ffffff;
        margin-left: 30rpx;
      }

      .right {
        background: linear-gradient(180deg, #ea313a 0%, #ff6068 100%);
        color: #ffffff;
        border: none;
        margin-right: 30rpx;
      }
    }
    .rules {
      position: fixed;
      top: 70rpx;
      z-index: 1;
      background: #fee8b8;
      border-radius: 50rpx 0rpx 0rpx 50rpx;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50rpx;
      width: 142rpx;
      font-size: 24rpx;
      font-weight: 500;
      color: #e73d45;
      line-height: 32rpx;
    }
  }
</style>
