import request from "@/utils/request";
import { requestPort } from "@/utils/requestPort";

export function banner() {
  return request({
    url: `${requestPort.config}/learningHall/banner/2`,
    method: "get",
  });
}
export function popUpPage() {
  return request({
    url: `${requestPort.users}/personCenter/popUpPage/3`,
    method: "get",
  });
}
export function clickBanner(data) {
  return request({
    url: `${requestPort.config}/officalHome/click`,
    method: "post",
    data,
  });
}
