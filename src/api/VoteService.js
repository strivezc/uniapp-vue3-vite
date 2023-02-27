import request from '@/utils/request';
import { requestPort } from '@/utils/requestPort';

export default {
  queryActivityStatistics() {
    return request({
      url: `${requestPort.market}/userVote/queryActivityStatistics`,
      method: 'get',
      hideMessage: true,
    });
  },
  queryActivityDetails() {
    return request({
      url: `${requestPort.market}/userVote/queryActivityDetails`,
      method: 'get',
    });
  },
  checkQualificationsGetInfo() {
    return request({
      url: `${requestPort.market}/userVote/checkQualificationsGetInfo`,
      method: 'get',
      hideMessage: true,
    });
  },
  queryActivityContestants(data) {
    return request({
      url: `${requestPort.market}/userVote/queryActivityContestants`,
      method: 'post',
      data,
    });
  },
  signUpActivity(data) {
    return request({
      url: `${requestPort.market}/userVote/signUpActivity`,
      method: 'post',
      data,
    });
  },
  getInfoCanvass(voteId) {
    return request({
      url: `${requestPort.market}/userVote/getInfoCanvass/${voteId}`,
      method: 'get',
    });
  },
  queryContestantInfo(voteId) {
    return request({
      url: `${requestPort.market}/userVote/queryContestantInfo/${voteId}`,
      method: 'get',
    });
  },
  userToVote(voteId) {
    return request({
      url: `${requestPort.market}/userVote/userToVote/${voteId}`,
      method: 'get',
      hideMessage: true,
    });
  },
  queryUserVoteId() {
    return request({
      url: `${requestPort.market}/userVote/queryUserVoteId`,
      method: 'get',
      hideMessage: true,
    });
  },
  queryVoteRecord() {
    return request({
      url: `${requestPort.market}/userVote/queryVoteRecord`,
      method: 'post',
    });
  },
};
