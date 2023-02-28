import { defineStore } from 'pinia';
import UserService from '@/api/UserService';
import { getToken, setToken, clearStorageSync } from '@/utils/auth';

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      token: getToken(),
      userName: '',
      userType: '',
      userImg: '',
      phone: '',
      userId: '',
      recommendCode: '',
    };
  },
  persist: {
    enabled: true,
    detached: true, // 设置订阅与组件分离
  },
  getters: {
    getToken: (state) => state.token,
  },
  actions: {
    setRecommendCode(recommendCode) {
      this.recommendCode = recommendCode;
    },
    setToken(token) {
      setToken(token);
      this.token = token;
    },
    setUserName(userName) {
      this.userName = userName;
    },
    setUserType(userType) {
      this.userType = userType;
    },
    setUserImg(userImg) {
      this.userImg = userImg;
    },
    setUserId(userId) {
      this.userId = userId;
    },
    setUserPhone(phone) {
      this.phone = phone;
    },
    // user logout
    logout() {
      return new Promise((resolve, reject) => {
        UserService.logout(this.token)
          .then(() => {
            this.setToken('');
            clearStorageSync();
            this.$reset();
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // remove token
    resetToken() {
      return new Promise((resolve) => {
        this.setToken('');
        this.$reset();
        clearStorageSync();
        resolve();
      });
    },
  },
});
