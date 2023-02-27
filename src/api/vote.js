import request from "@/utils/request";
import { requestPort } from "@/utils/requestPort";

export function queryActivityStatistics() {
  return request({
    url: `${requestPort.market}/userVote/queryActivityStatistics`,
    method: "get",
    hideMessage: true,
  });
}
export function queryActivityDetails() {
  return request({
    url: `${requestPort.market}/userVote/queryActivityDetails`,
    method: "get",
  });
}
export function checkQualificationsGetInfo() {
  return request({
    url: `${requestPort.market}/userVote/checkQualificationsGetInfo`,
    method: "get",
    hideMessage: true,
  });
}
export function queryActivityContestants(data) {
  return request({
    url: `${requestPort.market}/userVote/queryActivityContestants`,
    method: "post",
    data,
  });
}
export function signUpActivity(data) {
  return request({
    url: `${requestPort.market}/userVote/signUpActivity`,
    method: "post",
    data,
  });
}
export function getInfoCanvass(voteId) {
  return request({
    url: `${requestPort.market}/userVote/getInfoCanvass/${voteId}`,
    method: "get",
  });
}
export function queryContestantInfo(voteId) {
  return request({
    url: `${requestPort.market}/userVote/queryContestantInfo/${voteId}`,
    method: "get",
  });
}
export function userToVote(voteId) {
  return request({
    url: `${requestPort.market}/userVote/userToVote/${voteId}`,
    method: "get",
    hideMessage: true,
  });
}
export function queryUserVoteId() {
  return request({
    url: `${requestPort.market}/userVote/queryUserVoteId`,
    method: "get",
    hideMessage: true,
  });
}
export function queryVoteRecord() {
  return request({
    url: `${requestPort.market}/userVote/queryVoteRecord`,
    method: "post",
  });
}
