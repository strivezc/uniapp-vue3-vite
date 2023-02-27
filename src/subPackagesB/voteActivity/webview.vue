<template>
  <view>
    <web-view :src="src"></web-view>
  </view>
</template>

<script>
import { getToken} from "@/utils/auth";
export default {
  data() {
    return {
      src:`${process.env.NODE_ENV==='production'?'https://www.talk915.com':'https://test.talk915.com'}/h5/learnReportCover?registerFrom=learnReport&wxApplet=y&token=${getToken()}`
    }
  }
}
</script>
