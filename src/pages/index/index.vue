<template>
  <view class="content">
    <myHeader></myHeader>
    <!--    <image class="logo" src="/static/logo.png"></image>-->
    <view class="text-area">
      <input type="text" v-model="title" />
      <text class="title">{{ title }}</text>
    </view>

    <uni-section title="一般用法" type="line" padding>
      <uni-countdown :day="1" :hour="1" :minute="12" :second="40" />
    </uni-section>

    <div class="name">用户名:{{ userStore.getName }}</div>
    <button type="primary" @click="updateName(true)"> action修改store中的name </button>
    <button @click="updateName(false)">patch修改store中的name</button>
  </view>
</template>

<script setup>
  import { useUserStore } from '@/store';
  import myHeader from '@/components/header';

  const userStore = useUserStore();
  console.log(userStore, 'userStore');
  const updateName = (isAction) => {
    if (isAction) {
      // action 修改 store 中的数据
      userStore.setName('userStore.updateName方式');
    } else {
      // 未定义 action 时可以用 $patch 方法直接更改状态属性
      // $patch 修改 store 中的数据
      userStore.$patch({
        name: 'userStore.$patch方式',
      });
    }
  };
  const title = ref('我的标题');
</script>

<style scoped lang="scss">
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .logo {
    height: 200 rpx;
    width: 200 rpx;
    margin-top: 200 rpx;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 50 rpx;
  }

  .text-area {
    display: flex;
    justify-content: center;
  }

  .title {
    font-size: 36 rpx;
    color: $blue;
  }
</style>
