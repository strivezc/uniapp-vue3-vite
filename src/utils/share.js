import { getRecommendCode } from '@/utils/auth';

export default {
  onShow() {
    let pages = getCurrentPages();
    if (pages.length >= 1) {
      this.pageRouter = pages[pages.length - 1].route;
      if (this.pageRouter) {
        this.mpShare = {
          title: '找外教、练口语，就上"说客英语"',
          path: `/pages/home/index?recommendCode=${getRecommendCode()}`,
          imageUrl: '../../static/images/common/share.png',
        };
      }
      return;
    }
  },
  // 分享到好友
  onShareAppMessage() {
    return this.mpShare;
  },
};
