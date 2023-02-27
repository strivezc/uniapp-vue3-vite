<template>
  <view class="activityEnter">
    <view class="background">
      <image mode="scaleToFill" src="@img/enterBg.png" class="bg"></image>
    </view>
    <image mode="widthFix" src="@img/enterReel.png" class="img"></image>
    <view class="content">
      <view class="item flex-row">
        <text class="label">您的参赛名 </text>
        <text class="name">{{ userName }}</text>
      </view>
      <view class="item flex-column" style="border-bottom: none">
        <text class="label">参赛图片 </text>
        <image mode="widthFix" :src="form.contestImg" class="activityImg"></image>
      </view>
      <!--      <view class="item flex-column border-none">-->
      <!--        <text class="label">参赛介绍 </text>-->
      <!--        <textarea v-model="form.contestIntroduce" placeholder="选填，请输入参赛自我介绍（最多100字）" :maxlength="100" class="textarea"/>-->
      <!--      </view>-->
      <button class="btn-submit btn" @click="submit">提交报名</button>
    </view>
  </view>
</template>

<script>
  import { getUserName } from '@/utils/auth';
  export default {
    name: 'activityEnter',
    data() {
      return {
        userName: getUserName(),
        form: {
          contestImg: '',
          contestIntroduce: '说客英语',
        },
      };
    },
    onShow() {
      this.getInfo();
    },
    methods: {
      async getInfo() {
        try {
          const { resultData } = await this.$http.vote.checkQualificationsGetInfo();
          if (resultData === 1) {
            // 没有看年度报告
            uni.showModal({
              title: '报名提示',
              content: '参与投票报名，需要先查看您的2022年度学习报告',
              confirmColor: '#0087FF',
              cancelColor: '#0087FF',
              success: function (res) {
                if (res.confirm) {
                  console.log('查看报告');
                  uni.navigateTo({ url: '/subPackagesB/voteActivity/webview' });
                }
              },
            });
          } else {
            this.form.contestImg = resultData.tagTypeImg;
          }
        } catch (e) {
          if (e.resultCode === 3) {
            let resultMessage = e.resultMessage;
            uni.showModal({
              title: '报名提示',
              content: resultMessage,
              confirmColor: '#0087FF',
              cancelColor: '#0087FF',
              success(res) {
                if (res.confirm) {
                  if (resultMessage.indexOf('您目前已经投票报名成功，不可再次进行投票报名') > -1) {
                    uni.navigateTo({ url: '/subPackagesB/voteActivity/individualDetail' });
                  } else if (resultMessage.indexOf('报名条件') > -1) {
                    uni.reLaunch({
                      url: '/subPackagesB/voteActivity/activityDetail',
                    });
                  } else if (resultMessage.indexOf('活动报名时间已过') > -1) {
                    uni.switchTab({
                      url: '/pages/home/index',
                    });
                  }
                }
              },
            });
          } else if (e.resultCode === -1) {
            uni.$emit('refreshInfo');
            this.$store.dispatch('user/resetToken').then(() => {
              uni.showModal({
                title: '提示',
                content: '登录失效，请重新登录',
                confirmColor: '#0087FF',
                cancelColor: '#0087FF',
                success: function (res) {
                  if (res.confirm) {
                    uni.navigateTo({
                      url: '/subPackagesA/personal/chooseLoginType?redirect=/subPackagesB/voteActivity/activityEnter',
                    });
                  }
                },
              });
            });
          }
        }
      },
      async submit() {
        if (!this.form.contestImg) {
          uni.showModal({
            title: '报名提示',
            content: '参与投票报名，需要先查看您的2022年度学习报告生成参赛图片！',
            confirmColor: '#0087FF',
            cancelColor: '#0087FF',
            success: function (res) {
              if (res.confirm) {
                console.log('查看报告');
                uni.navigateTo({ url: '/subPackagesB/voteActivity/webview' });
              }
            },
          });
          return;
        }
        if (!this.form.contestIntroduce) {
          uni.showToast({
            title: '请填写参赛介绍！',
            icon: 'none',
            duration: 3000,
          });
          return;
        }
        try {
          const { resultData } = await this.$http.vote.signUpActivity(this.form);
          uni.navigateTo({
            url: `/subPackagesB/voteActivity/enterResult?userName=${resultData.userName}&voteId=${resultData.voteId}`,
          });
        } catch (e) {
          if (e.resultCode === 3) {
            let resultMessage = e.resultMessage;
            uni.showModal({
              title: '报名提示',
              content: resultMessage,
              confirmColor: '#0087FF',
              cancelColor: '#0087FF',
              success(res) {
                if (res.confirm) {
                  if (resultMessage.indexOf('您目前已经投票报名成功，不可再次进行投票报名') > -1) {
                    uni.navigateTo({ url: '/subPackagesB/voteActivity/individualDetail' });
                  }
                }
              },
            });
          }
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  .activityEnter {
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
    .content {
      padding-left: 70rpx;
      padding-right: 70rpx;
      padding-top: 20rpx;
      padding-bottom: 0;
      .item {
        margin-top: 30rpx;
        padding-bottom: 30rpx;
        border-bottom: 1rpx solid #e7606c;
        .label {
          font-size: 32rpx;
          line-height: 36rpx;
          font-weight: 500;
          color: #fff0cc;
        }
        .name {
          font-size: 36rpx;
          font-weight: 500;
          color: #fff0cc;
          line-height: 36rpx;
          margin-left: 45rpx;
        }
        .activityImg {
          width: 500rpx;
          border: 5rpx solid #fff0cc;
          border-radius: 24rpx;
          margin: auto;
          margin-top: 50rpx;
        }
        .textarea {
          margin-top: 22rpx;
          height: 340rpx;
          background: #ffffff;
          border-radius: 8rpx 8rpx 8rpx 8rpx;
          padding: 24rpx;
          width: 562rpx;
        }
      }
      .border-none {
        border: none;
      }
      .flex-column {
        display: flex;
        flex-direction: column;
      }
      .flex-row {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      .btn {
        position: absolute;
        bottom: 50rpx;
        width: 610rpx;
        background: #fff0cc !important;
        color: #9f1a25;
        border-radius: 50rpx 50rpx 50rpx 50rpx;
        margin-top: 124rpx;
      }
    }
  }
</style>
