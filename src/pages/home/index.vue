<template>
  <view class="container">
    <view class="title" :style="'padding-top:' + titleHeight + 'px'">说客英语</view>
    <view class="swiper-wrap" :style="{ paddingTop: titleHeight + 'px', marginTop: '104rpx' }">
      <swiper
        class="swiper"
        circular
        :indicator-dots="indicatorDots"
        :autoplay="autoplay"
        :interval="interval"
        :duration="duration"
      >
        <swiper-item v-for="item in bannerList" :key="item.id">
          <image
            mode="scaleToFill"
            :src="item.imgUrl"
            class="swiper-item"
            @click="clickBanner(item.linkUrl, item.id, item.title)"
          ></image>
        </swiper-item>
        <swiper-item v-if="bannerList.length === 0">
          <image mode="scaleToFill" src="@img/banner-app.png" class="swiper-item"></image>
        </swiper-item>
      </swiper>
    </view>
    <image
      mode="scaleToFill"
      v-if="voteTopImg"
      :src="voteTopImg"
      class="voteTopImg"
      @click="toVoteActivity"
    ></image>
    <text class="title2">了解说客英语</text>
    <view class="content-wrap">
      <view class="img-wrap" @click="navigateTo('selfTextbook')">
        <img src="@img/textbook.png" class="item-img" alt="" />
        <text class="text">自研教材</text>
      </view>
      <view class="img-wrap" @click="navigateTo('fixedTeacher')">
        <img src="@img/teacher.png" class="item-img" alt="" />
        <text class="text">固定老师</text>
      </view>
    </view>
    <text class="title2">优秀外教</text>
    <view class="content-wrap">
      <view class="img-wrap" @click="navigateTo('globalTeacher')">
        <img src="@img/globalTeacher.png" class="item-img" alt="" />
        <text class="text">全球师资</text>
      </view>
      <view class="img-wrap">
        <img src="@img/withCertificate.png" class="item-img" alt="" />
        <text class="text">持证外教</text>
      </view>
    </view>

    <uni-popup ref="popup" type="center" @maskClick="close" :animation="false">
      <view class="popup-wrap">
        <image
          mode="widthFix"
          :src="popUpInfo.imgUrl"
          class="popup-img"
          @click="clickBanner(popUpInfo.linkUrl, popUpInfo.id, popUpInfo.title, popUpInfo.position)"
        ></image>
        <image
          mode="widthFix"
          src="@img/common/close.png"
          class="popup-close"
          @click="close"
        ></image>
      </view>
    </uni-popup>
  </view>
</template>

<script>
  import { getToken, getRecommendCode, setRecommendCode } from '@/utils/auth';
  import VoteService from '@/api/VoteService';
  import CommonService from '@/api/CommonService';
  import { mapActions } from 'pinia';
  import { useUserStore } from '@/store';

  export default {
    data() {
      return {
        titleHeight: '',
        containerTop: '',
        indicatorDots: false,
        autoplay: true,
        interval: 5000,
        duration: 500,
        voteTopImg: '', //投票活动顶部图片
        bannerList: [],
        popUpInfo: {},
      };
    },
    onLoad(query) {
      console.log(query, 'query');
      let recommendCode = query.recommendCode || getRecommendCode();
      console.log(recommendCode, 'recommendCode');
      if (recommendCode) {
        setRecommendCode(recommendCode);
        this.setRecommendCode(recommendCode);
      }
      this.getHeight();
      uni.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage'],
      });
    },
    onShow() {
      this.getActivityStatistics();
      this.getBanner();
      if (getToken()) {
        this.popUpPage();
      }
    },
    methods: {
      ...mapActions(useUserStore, ['setRecommendCode']),
      close() {
        this.$refs.popup.close();
      },
      clickBanner(imgUrl, id, title, position = 13) {
        if (imgUrl) {
          this.clickBannerRecord(id, title, position);
          let url = encodeURIComponent(imgUrl);
          uni.navigateTo({
            url: `/components/webview/index?url=${url}`,
          });
          if (position === 14) {
            this.close();
          }
        }
      },
      async clickBannerRecord(id, title, position) {
        try {
          await CommonService.clickBanner({ id, title, position });
        } catch (e) {
          console.log(e, 'error');
        }
      },
      async getActivityStatistics() {
        try {
          const { resultData } = await VoteService.queryActivityStatistics();
          this.voteTopImg = resultData.voteTopImg;
        } catch (e) {
          console.log(e, 'error');
        }
      },
      async getBanner() {
        try {
          const { resultData } = await CommonService.banner();
          this.bannerList = resultData;
        } catch (e) {
          console.log(e, 'error');
        }
      },
      async popUpPage() {
        try {
          if (!uni.getStorageSync('popUp')) {
            const { resultData } = await CommonService.popUpPage();
            if (resultData.imgUrl) {
              this.popUpInfo = resultData;
              this.$refs.popup.open();
              uni.setStorageSync('popUp', 'yes', 24 * 60 * 60);
            }
          }
        } catch (e) {
          console.log(e, 'error');
        }
      },
      toVoteActivity() {
        uni.navigateTo({
          url: '/subPackagesB/voteActivity/activityDetail',
        });
      },
      getHeight() {
        let res = wx.getMenuButtonBoundingClientRect();
        this.titleHeight = res.top;
      },
      navigateTo(name) {
        uni.navigateTo({
          url: `/subPackagesA/home/${name}`,
        });
      },
    },
  };
</script>

<style scode lang="scss">
  .container {
    margin: 0 31rpx;
    padding-bottom: 100rpx;
    .title {
      position: fixed;
      top: 0;
      z-index: 99;
      width: 100%;
      background: #ffffff;
      font-size: 48rpx;
      font-weight: 500;
      color: #333333;
      line-height: 64rpx;
      margin-left: -31rpx;
      padding-left: 31rpx;
    }

    .swiper-wrap {
      margin-bottom: 48rpx;
      width: 100%;
      height: 304rpx;

      .swiper-item {
        width: 100%;
        height: 304rpx;
        width: 686rpx;
        border-radius: 16rpx;
      }
    }

    .voteTopImg {
      width: 100%;
      height: 304rpx;
      width: 686rpx;
      border-radius: 16rpx;
      margin-bottom: 48rpx;
    }

    .title2 {
      display: block;
      margin-bottom: 20rpx;
      font-size: 36rpx;
      font-weight: 500;
      color: #333333;
      line-height: 42rpx;
    }

    .content-wrap {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-bottom: 48rpx;
      .img-wrap {
        display: flex;
        flex-direction: column;

        .item-img {
          width: 330rpx;
          height: 200rpx;
        }

        .text {
          margin-top: 20rpx;
          font-size: 32rpx;
          font-weight: 400;
          color: #333333;
          line-height: 32rpx;
        }
      }

      &:last-child {
        padding-bottom: 200rpx;
      }
    }

    .popup-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .popup-img {
        width: 750rpx;
      }

      .popup-close {
        margin-top: 56rpx;
        width: 44rpx;
      }
    }
  }
</style>
