<template>
  <view class="chooseLoginType">
    <image mode="widthFix" src="@img/logo.png" class="logo"></image>
    <template v-if="env === 'production'">
      <button
        class="btn-login"
        open-type="getPhoneNumber"
        @getphonenumber="decryptPhoneNumber"
        v-show="checked && checkGetPhoneVersion"
      >
        微信一键登录
      </button>
      <button class="btn-login" v-show="!checked || !checkGetPhoneVersion" @click="weChatLogin"
        >微信一键登录</button
      >
    </template>
    <button class="btn-login register" @click="phoneLogin">手机号登录/注册</button>
    <view class="agreement-wrap">
      <checkbox-group @change="changeCheck">
        <checkbox :value="true" color="#ffffff" class="myRadioCheck right">
          我已阅读并同意说客英语
        </checkbox>
      </checkbox-group>
      <view class="right">
        <text class="blue" @click="navigateTo('/subPackagesA/personal/privacyPolicy')"
          >《隐私协议》、</text
        >
        <text class="blue" @click="navigateTo('/subPackagesA/personal/userAgreement')"
          >《用户协议》</text
        >
      </view>
    </view>
    <view class="tip"
      >如果您已有说客英语账号，在使用微信一键登录功能时，请确定微信绑定手机号与说客英语APP的手机号保持一致，否则年度称号生成数据不一致。</view
    >
  </view>
</template>

<script>
  import { checkGetPhoneVersion } from '@/utils';
  import { mapState, mapActions } from 'pinia';
  import { useUserStore } from '@/store';
  import UserService from '@/api/UserService';

  export default {
    name: 'chooseLoginType',
    data() {
      return {
        checked: false,
        redirect: '',
        form: {
          loginCode: '',
          getPhoneCode: '',
          status: 0,
          recommendCode: '',
        },
        // recommendCode:'',
        voteId: '',
        env: import.meta.env.MODE,
        checkGetPhoneVersion: true,
      };
    },
    onLoad(option) {
      console.log(option, 'option');
      this.redirect = option.redirect;
      // this.recommendCode=option.recommendCode;
      this.voteId = option.voteId;
      this.checkGetPhoneVersion = checkGetPhoneVersion();
    },
    computed: {
      ...mapState(useUserStore, ['recommendCode']),
    },
    methods: {
      ...mapActions(useUserStore, [
        'setToken',
        'setUserId',
        'setUserType',
        'setUserName',
        'setUserImg',
        'setUserPhone',
        'setRecommendCode',
      ]),
      weChatLogin() {
        if (!this.checkGetPhoneVersion) {
          uni.showModal({
            title: '提示',
            content:
              '当前微信版本过低，无法使用该功能，请使用短信登录方式或升级到最新微信版本后重试',
            confirmColor: '#0087FF',
            showCancel: false,
            success: (res) => {},
          });
          return;
        }
        if (!this.checked) {
          uni.showToast({
            title: '请阅读并勾选用户协议',
            icon: 'none',
            duration: 3000,
          });
        }
      },
      decryptPhoneNumber(val) {
        console.log(val, 'val');
        if (val.detail.errMsg === 'getPhoneNumber:ok') {
          uni.showLoading({
            title: '登录中',
          });
          uni.login({
            provider: 'weixin',
            success: (loginRes) => {
              this.form.loginCode = loginRes.code;
              this.form.getPhoneCode = val.detail.code;
              const params = {
                ...this.form,
                recommendCode: this.recommendCode,
              };
              console.log(params, 'params-login');
              UserService.appletLogin(params).then(async (res) => {
                uni.hideLoading();
                let resultData = res.resultData;
                const token = resultData.token;
                if (!token) {
                  uni.showModal({
                    title: '提示',
                    content: '登录失效，请重新登录！',
                    confirmColor: '#0087FF',
                    cancelColor: '#0087FF',
                    success: function (res) {
                      if (res.confirm) {
                      }
                    },
                  });
                  return;
                }
                this.setToken(token);
                this.setUserId(resultData.userId);
                this.setUserType(resultData.userType);
                this.setUserName(resultData.userName);
                this.setUserPhone(resultData.phone);
                this.setUserImg(resultData.userImg);
                this.setRecommendCode(resultData.recommendCode);
                // uni.$emit('refreshInfo');
                if (this.redirect && this.redirect !== 'undefined') {
                  uni.redirectTo({
                    url: `${this.redirect}?voteId=${this.voteId}&recommendCode=${this.recommendCode}`,
                  });
                } else {
                  uni.switchTab({ url: '/pages/personal/index' });
                }
                console.log(res, 'appletLogin-res');
              });
            },
          });
        }
      },
      phoneLogin() {
        if (!this.checked) {
          uni.showToast({
            title: '请阅读并勾选用户协议',
            icon: 'none',
            duration: 3000,
          });
          return;
        }
        uni.navigateTo({
          url: `/subPackagesA/personal/phoneLogin?redirect=${this.redirect}&voteId=${this.voteId}&recommendCode=${this.recommendCode}`,
        });
      },
      changeCheck(e) {
        if (e.detail.value.length > 0) {
          this.checked = e.detail.value[0];
        } else {
          this.checked = false;
        }
      },
      navigateTo(url) {
        uni.navigateTo({ url });
      },
    },
  };
</script>

<style scoped lang="scss">
  .chooseLoginType {
    .logo {
      display: block;
      margin: auto;
      margin-top: 140rpx;
      margin-bottom: 140rpx;
      width: 150rpx;
      height: 150rpx;
    }

    .register {
      border: 1px solid #0087ff;
      color: #0087ff;
      background: #ffffff !important;
      margin-top: 25rpx;
    }

    .agreement-wrap {
      display: flex;
      align-items: baseline;
      justify-content: center;
      margin-top: 40rpx;

      .left {
        flex-shrink: 0;
      }

      .right {
        font-size: 24rpx;
        font-weight: 400;
        color: #909399;
      }

      .blue {
        color: #0087ff;
      }
    }
    .tip {
      margin: 40rpx;
      padding: 20rpx;
      font-size: 24rpx;
      line-height: 40rpx;
      font-weight: 400;
      color: #ff5c01;
      background: #fffbf2;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
    }
  }
</style>
