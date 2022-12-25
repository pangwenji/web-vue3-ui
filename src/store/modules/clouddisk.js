import {
  getFolderList,
  getFileList,
  getDetails
} from "@/api/clouddisk/file.js";
import { getProjectMemberList } from '@/api/project/menber'
import { setReviewStatus } from '@/api/project/file'

const state = {
  sortItem: 0, //排序方式
  openInfo: false, //是否展开详情
  sortType: "asc", // desc 降序  asc 升序
  layoutType: "card", //card 卡片 list 列表
  layoutSize: "base", //large  大 base中 small 小
  fileList: [], // 文件列表
  fileListCat: 0, //文件列表类型 0 1 2 3 4 5
  fileDetail: {}, // 文件详情
  commentList: [], // 文件评论列表
  memberList: [], // 项目成员列表
  fileType: '', // 文件类型
  openCat: true, // 展开分类
  openFolder: false, // 展开文件夹
  deleteCount: 0, // 文件总数
  folderList: [], // 文件夹列表
  treeData: [], // 文件夹列表
  expandedKeys: [], // 打开的文件夹
  breadcrumbs: [],
  shareBreadcrumbs: [], // 分享页breadcrumb
  openFolderLoading: false,
  showInfo: false, //展示文件/夹信息
};
const mutations = {
  SET_LAYOUT_TYPE(state, layoutType) {
    state.layoutType = layoutType;
  },
  SET_FILE_LIST(state, fileList) {
    state.fileList = fileList;
  },
  SET_FILE_LIST_CAT(state, fileListCat) {
    state.fileListCat = fileListCat;
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
  SET_OPEN_CAT(state,openCat){
    state.openCat = openCat;
  },
  SET_OPEN_FOLDER(state,openFolder){
    state.openFolder = openFolder;
  },
  SET_DELETE_COUNT(state,deleteCount){
    state.deleteCount = deleteCount;
  },
  SET_FOLDER_LIST(state,folderList){
    state.folderList = folderList;
  },
  SET_EXPANDED_KEYS(state,expandedKeys){
    state.expandedKeys = expandedKeys;
  },
  SET_TREE_DATA(state,treeData){
    state.treeData = treeData;
  },
  SET_BREAD_CRUMBS(state,breadcrumbs){
    state.breadcrumbs = breadcrumbs;
  },
  SET_SHARE_BREADCRUMBS(state,shareBreadcrumbs){
    state.shareBreadcrumbs = shareBreadcrumbs;
  },
  SET_OPEN_FOLDER_LOADING(state,openFolderLoading){
    state.openFolderLoading = openFolderLoading;
  },
  SET_SHOW_INFO(state, showInfo) {
    state.showInfo = showInfo;
  }
};
const actions = {
  //获取云盘文件列表
  getCloudFileList({ commit }, data = {}) {
    return new Promise((resolve, reject) => {
      getFileList(data)
        .then((res) => {
          const newArr = []
          res.data.forEach(el => {
            const obj = el
            obj.metaData = JSON.parse(obj.metaData)
            newArr.push(obj)
          });
          commit("SET_FILE_LIST", newArr);
          resolve(res);
        })
        .catch((err) => {
          commit("SET_FILE_LIST", []);
          reject(err);
        });
    });
  },
  //获取云盘文件夹列表
  getCloudFolderList({ commit }, data = {}) {
    return new Promise((resolve, reject) => {
      getFolderList(data)
        .then((res) => {
          commit("SET_FOLDER_LIST", res.data)
          resolve(res);
        })
        .catch((err) => {
          commit("SET_FOLDER_LIST", []);
          reject(err);
        });
    });
  },
  //获取云盘文件详情
  getCloudFileDetail({ commit }, data = {}) {
    return new Promise((resolve, reject) => {
      getDetails(data)
        .then((res) => {
          const data = res.data
          data.metaData = JSON.parse(data.metaData)
          commit("SET_FILE_DETAIL", data);
          commit("SET_FILE_TYPE", res.data.fileCat);
          resolve(res);
        })
        .catch((err) => {
          commit("SET_FILE_DETAIL", {});
          reject(err);
        });
    });
  },
  // 设置文件类型
  setCloudFileType({ commit }, type = '') {
    commit("SET_FILE_TYPE", type);
  },

  // 打开文件夹
  async handleOpenFolder({state,commit,dispatch},data){
    commit('SET_OPEN_FOLDER_LOADING', true)
    try{
      const parent_id = data.id;
      if (data.fromType === 1 && data.name) {
        state.breadcrumbs.push({
            id: parent_id,
            parentId: parent_id,
            name: data.name,
        })
        commit('SET_BREAD_CRUMBS', state.breadcrumbs);
      }
      await dispatch('getCloudFolderList',{parent_id});
      await dispatch('getCloudFileList',{parent_id});
      const resultData = await getDetails({id:parent_id});
      resultData.data.path.reverse()
      const BREAD_CRUMBS = resultData.data.path.map((item)=>{
        return {
          id: item.id,
          parentId: item.id,
          name: item.name,
        }
      })
      commit('SET_BREAD_CRUMBS',BREAD_CRUMBS);
      commit('SET_OPEN_FOLDER_LOADING', false)
      return Promise.resolve();
    }catch(err){
      commit('SET_OPEN_FOLDER_LOADING', false)
      return Promise.reject(err);
    }
  },
  // 点击面包屑
  async handleClickNav({state,commit,dispatch},data){
    try{
        const project_id = data.projectId;
        const parent_id = data.parentId;
        const listData = [];
        for(var item of state.breadcrumbs){
          listData.push(item)
          if(item.parentId === parent_id){
            break;
          }
        }
        commit('SET_BREAD_CRUMBS',listData);
        await dispatch('getCloudFolderList',{parent_id});
        await dispatch('getCloudFileList',{parent_id});
        return Promise.resolve();
    }catch(err){
        return Promise.reject(err);
    }
},
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
