<template>
  <view class="phoneLogin">
    <image mode="widthFix" src="@img/logo.png" class="logo"></image>
    <view class="form">
      <input type="number" v-model="form.phone" placeholder="请输入手机号" class="normal-input" />
      <view class="input-wrap">
        <input type="number" v-model="pictureCode" placeholder="请输入图片验证码" class="input" />
        <image :src="imgBase64" @click="getBase64ImgCode" class="code-img"></image>
      </view>
      <view class="input-wrap">
        <input v-model="form.captcha" type="number" placeholder="请输入验证码" class="input" />
        <text class="code" @click="sendCode" v-show="countdown === 0">获取验证码</text>
        <text class="code" @click="sendCode" v-show="countdown > 0">{{ countdown }}S</text>
      </view>
    </view>
    <view class="agreement-wrap">
      <checkbox-group @change="changeCheck">
        <checkbox :value="true" checked="true" color="#ffffff" class="myRadioCheck right">
          该手机号默认绑定小程序
        </checkbox>
      </checkbox-group>
    </view>
    <button
      class="btn-login login"
      @click="login"
      :style="disable ? 'background:rgba(0,133,255,0.3)!important' : ''"
      >登录/注册</button
    >
  </view>
</template>

<script>
  import { validateMobile } from '@/utils/validate';
  import { mapState, mapActions } from 'pinia';
  import { useUserStore } from '@/store';
  import UserService from '@/api/UserService';

  const TIME_COUNT = 60;
  export default {
    name: 'phoneLogin',
    data() {
      return {
        form: {
          phone: '',
          captcha: '',
          status: '',
          recommendCode: '',
          loginCode: '',
        },
        redirect: '',
        imgBase64: '',
        pictureCode: '',
        code: '',
        countdown: 0,
        timer: null,
        checked: true,
        // recommendCode:'',
        voteId: '',
      };
    },
    onLoad(option) {
      console.log(option, 'option');
      this.redirect = option.redirect;
      // this.recommendCode=option.recommendCode;
      this.voteId = option.voteId;
    },
    computed: {
      disable() {
        return !(this.form.phone && this.form.captcha);
      },
      ...mapState(useUserStore, ['recommendCode']),
    },
    created() {
      this.getBase64ImgCode();
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
      changeCheck(e) {
        if (e.detail.value.length > 0) {
          this.checked = e.detail.value[0];
        } else {
          this.checked = false;
        }
      },
      async getBase64ImgCode() {
        try {
          const { resultData } = await UserService.getPictureCode();
          this.imgBase64 = resultData.picture;
          this.code = resultData.code;
        } catch (e) {
          console.log(e, 'error');
        }
      },
      async sendCode() {
        if (this.timer) return;
        if (!this.form.phone) {
          uni.showToast({
            title: '手机号码不能为空！',
            icon: 'none',
            duration: 3000,
          });
          return;
        }
        if (!validateMobile(this.form.phone)) {
          uni.showToast({
            title: '手机号码格式不正确！',
            icon: 'none',
            duration: 3000,
          });
          return;
        }
        if (!this.pictureCode) {
          uni.showToast({
            title: '图形验证码不能为空！',
            icon: 'none',
            duration: 3000,
          });
          return;
        }
        try {
          uni.showLoading({});
          await UserService.sendSmsCodeByCaptcha({
            phone: this.form.phone,
            pictureCode: this.pictureCode,
            code: this.code,
          });
          uni.hideLoading();
          this.countdown = TIME_COUNT; // 短信验证码倒数
          this.timer = setInterval(() => {
            if (this.countdown > 0 && this.countdown <= TIME_COUNT) {
              this.countdown--;
            } else {
              clearInterval(this.timer);
              this.countdown = 0;
              this.timer = null;
            }
          }, 1000);
        } catch (e) {
          console.log(e, 'error');
        }
      },
      async login() {
        // appletLogin
        // this.$store.dispatch('user/login', params).then((res) => {
        //   uni.$emit('refreshInfo');
        //   if (this.redirect) {
        //     uni.redirectTo({url: this.redirect});
        //   } else {
        //     uni.switchTab({url: '/pages/personal/index'});
        //   }
        // });
        // return;

        if (this.disable || this.loading) return;
        if (!validateMobile(this.form.phone)) {
          uni.showToast({
            title: '手机号码格式不正确！',
            icon: 'none',
            duration: 3000,
          });
          return;
        }
        uni.showLoading({
          title: '登录中',
        });
        uni.login({
          provider: 'weixin',
          success: async (loginRes) => {
            this.form.loginCode = loginRes.code;
            try {
              const params = {
                ...this.form,
                status: this.checked ? 1 : 2,
                recommendCode: this.recommendCode,
              };
              console.log(params, 'params-login');
              this.loading = true;
              const { resultData } = await UserService.appletLogin(params);
              this.loading = false;
              uni.hideLoading();
              const token = resultData.token;
              this.setToken(token);
              this.setUserId(resultData.userId);
              this.setUserType(resultData.userType);
              this.setUserName(resultData.userName);
              this.setUserPhone(resultData.phone);
              this.setUserImg(resultData.userImg);
              this.setRecommendCode(resultData.recommendCode);
              if (this.redirect && this.redirect !== 'undefined') {
                uni.redirectTo({
                  url: `${this.redirect}?voteId=${this.voteId}&recommendCode=${this.recommendCode}`,
                });
              } else {
                uni.switchTab({ url: '/pages/personal/index' });
              }
            } catch (e) {
              this.loading = false;
              this.countdown = 0;
              this.timer = null;
            }
          },
        });
      },
      navigateTo(url) {
        uni.navigateTo({ url });
      },
    },
    onUnload() {
      clearInterval(this.timer);
    },
  };
</script>

<style scoped lang="scss">
  .phoneLogin {
    .logo {
      display: block;
      margin: auto;
      margin-top: 140rpx;
      width: 150rpx;
      height: 150rpx;
    }
    .form {
      margin: 50rpx 40rpx;
      margin-bottom: 0;
    }
    .login {
      color: #ffffff;
      background: #0087ff !important;
      margin-top: 25rpx;
    }
  }
  .agreement-wrap {
    display: flex;
    align-items: baseline;
    justify-content: flex-start;
    margin-top: 10rpx;
    margin-left: 40rpx;
    /*margin-bottom: 50px;*/
    .right {
      font-size: 24rpx;
      font-weight: 400;
      color: #909399;
    }
    .left {
      flex-shrink: 0;
    }
  }
</style>
