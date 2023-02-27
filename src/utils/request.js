import { getToken } from "@/utils/auth";
import { useUserStore } from "@/store";

let baseUrl = import.meta.env.VITE_APP_API_BASE_URL;
const request = ({
  url = "",
  data = {},
  method = "POST",
  header = { token: getToken() },
  hideLoading,
  hideMessage,
}) => {
  const userStore = useUserStore();

  return new Promise((resolve, reject) => {
    // if (!hideLoading) {
    //   uni.showLoading({});
    // }
    uni.request({
      timeout: 60000,
      method,
      url: baseUrl + url,
      data,
      header,
      success(response) {
        // if (!hideLoading) {
        // 	uni.hideLoading();
        // }
        let res = response.data;

        if (res.resultCode !== 0) {
          if (hideMessage) {
            reject(res || "Error");
          } else {
            if (res.resultCode === 3 || res.resultCode === -5) {
              // hideMessage 是否隐藏错误提示
              uni.showToast({
                title: res.resultMessage,
                icon: "none",
                duration: 3000,
              });
            } else if (res.resultCode === -4) {
              //
            } else {
              if (res.resultCode === -1) {
                // to re-login
                uni.showModal({
                  title: "提示",
                  content: "登录失效，请重新登录！",
                  confirmColor: "#0087FF",
                  cancelColor: "#0087FF",
                  success: function (res) {
                    if (res.confirm) {
                      //*清空缓存重新登录
                      userStore.resetToken().then(() => {
                        uni.$emit("refreshInfo");
                        uni.navigateTo({
                          url: "/subPackagesA/personal/chooseLoginType",
                        });
                      });
                    }
                  },
                });
              } else {
                uni.showToast({
                  title: `操作异常，请联系管理员(${res.resultCode})!`,
                  icon: "none",
                  duration: 3000,
                });
              }
            }
            reject(res || "Error");
          }
        } else {
          resolve(res);
        }
      },
      fail(err) {
        reject(err);
      },
    });
  });
};
export default request;
