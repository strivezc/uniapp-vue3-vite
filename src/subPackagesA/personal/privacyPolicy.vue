<template>
  <div class="content privacyPolicy">
    <div v-html="content">{{ content }}</div>
  </div>
</template>

<script>
  import UserService from '@/api/UserService';
  export default {
    name: 'privacyPolicy',
    data() {
      return {
        content: '',
        resourceType: '35',
      };
    },
    created() {
      this.getContent();
    },
    methods: {
      async getContent() {
        try {
          const { resultData } = await UserService.getComplianceContent({
            resourceType: this.resourceType,
            platformType: 6, // 6 说客英语小程序
          });
          if (resultData && resultData.content) {
            this.content = resultData.content;
          }
        } catch (e) {
          console.log(e, 'error');
        }
      },
    },
  };
</script>

<style>
  .privacyPolicy img {
    max-width: 100%;
  }
</style>

<style scoped>
  .content {
    font-size: 30px;
    padding: 20px;
    word-break: break-word;
  }
</style>
