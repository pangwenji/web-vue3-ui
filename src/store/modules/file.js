import {
  getFileList,
  getFileDetails,
  getCommentList,
  publishComment,
  deleteComment,
} from "@/api/project/project.js";
import { getProjectMemberList } from '@/api/project/menber'
import { setReviewStatus } from '@/api/project/file'
// import { getCommentListNoPage } from '@/api/project/files'
import project from './project'

const state = {
  sortItem: 0, //排序方式
  openInfo: false, //是否展开详情
  sortType: "asc", // desc 降序  asc 升序
  layoutType: "card", //card 卡片 list 列表
  layoutSize: "base", //large  大 base中 small 小
  fileList: [], // 文件列表
  fileDetail: {}, // 文件详情
  commentList: [], // 文件评论列表
  memberList: [], // 项目成员列表
  fileType: '', // 文件类型
};
const mutations = {
  SET_FILE_LIST(state, fileList) {
    state.fileList = fileList;
  },
  SET_FILE_DETAIL(state, fileDetail) {
    state.fileDetail = fileDetail;
  },
  SET_COMMENT_LIST(state, commentList) {
    state.commentList = commentList;
  },
  SET_MEMBER_LIST(state, memberList) {
    state.memberList = memberList;
  },
  SET_FILE_TYPE(state, fileType) {
    state.fileType = fileType;
  },
};
const actions = {
  //获取项目文件列表
  getProjectFileList({ commit }, data = {}) {
    return new Promise((resolve, reject) => {
      getFileList(data)
        .then((res) => {
          commit("SET_FILE_LIST", res.data);
        })
        .catch((err) => {
          commit("SET_FILE_LIST", []);
        });
    });
  },
  //获取项目文件详情
  getProjectFileDetail({ commit }, data = {}) {
    return new Promise((resolve, reject) => {
      getFileDetails(data)
        .then((res) => {
          commit("SET_FILE_DETAIL", res.data);
          commit("SET_FILE_TYPE", res.data.fileCat);
          resolve(res);
        })
        .catch((err) => {
          commit("SET_FILE_DETAIL", {});
          reject(err);
        });
    });
  },
  //获取文件评论列表
  getFileCommentList({ commit }, data = {}) {
    return new Promise((resolve, reject) => {
      getCommentList(data)
        .then((res) => {
          commit("SET_COMMENT_LIST", res.rows);
        })
        .catch((err) => {
          commit("SET_COMMENT_LIST", []);
        });
    });
  },
  //获取项目成员列表
  getMemberList({ commit }, data = {}) {
    return new Promise((resolve, reject) => {
      getProjectMemberList(data)
        .then((res) => {
          commit("SET_MEMBER_LIST", res.data);
        })
        .catch((err) => {
          commit("SET_MEMBER_LIST", []);
        });
    });
  },
  // 新增评论
  handleAddComment({ state, commit }, {data = {}, index = null}) {
    return new Promise((resolve, reject) => {
      const attachmentArr = data.attachmentArr
      if (attachmentArr.length > 0) {
        delete data.attachmentArr
      }
      publishComment(data)
        .then((res) => {
          const resdata = res.data
          resdata.attachmentInfo = attachmentArr
          resdata.status = 0
          // if (index !== null) {
          //   if (state.commentList[index].children === null) {
          //     state.commentList[index].children = []
          //   }
          //   state.commentList[index].children?.unshift(resdata);
          // } else {
          //   state.commentList.unshift(resdata);
          // }
          // commit("SET_COMMENT_LIST", state.commentList);
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // 删除评论
  handleDeleteComment({ state, commit }, { id, index = null, index2 = null }) {
    return new Promise((resolve, reject) => {
      deleteComment(id)
        .then((res) => {
          if (index2 !== null) {
            state.commentList[index].children.splice(index2, 1);
          } else {
            state.commentList.splice(index, 1);
          }
          commit("SET_COMMENT_LIST", state.commentList);
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // 设置文件评审状态
  handleFileStatus({ state, commit }, data) {
    return new Promise((resolve, reject) => {
      setReviewStatus(data)
        .then((res) => {
          console.log('--', res);
          state.fileDetail.reviewStatus = data.reviewStatus;
          commit("SET_FILE_DETAIL", state.fileDetail);

          const pFileList = []
          project.state.fileList.forEach(el => {
            const obj = el
            if (obj.id === data.id) {
              obj.reviewStatus = data.reviewStatus
            }
            pFileList.push(obj)
          })
          project.commit('SET_FILE_LIST', pFileList)
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // 设置文件类型
  setFileType({ commit }, type = '') {
    commit("SET_FILE_TYPE", type);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
