import { getCategoryList, comparedList, comparedJoin } from '@/api/personnel/recruitmentWall'
import { userAuthInfo, createUserAuthenticate } from '@/api/personnel/personnelConsole.js'
const state = {
    resultData: null, //扫码授权返回的数据
    applyData: null,    // 申请认证信息
    applyStatus: 0,
    formData: null,
    categoryList: [],
    quickSelections: [],
}

const mutations = {
    set_form_data(state, formData) {
        state.formData = formData;
    },
    set_result_data(state, resultData) {
        state.resultData = resultData;
    },
    set_apply_data(state, applyData) {
        state.applyData = applyData;
    },
    set_apply_status(state, applyStatus) {
        state.applyStatus = applyStatus;
    },
    set_category_list(state, categoryList) {
        state.categoryList = categoryList
    },
    set_quick_selection(state, quickSelections) {
        state.quickSelections = quickSelections;
    }
}

const actions = {
    // 获取发布表单
    getFormData({ state, commit, rootState, dispatch }) {
        return new Promise(async (resolve, reject) => {
            let formData = state.formData;
            if (!formData) {
                const userId = rootState.user.userId;
                const data = window.localStorage.getItem(`${userId}-formData`);
                formData = data ? JSON.parse(data) : null;
            }
            if (formData && (formData.title || formData.content || formData.endDate || formData.sourceIdItems.length || formData.categoryItems.length)) {
                commit('set_form_data', formData)
                resolve(formData)
            } else {
                await dispatch('delFormData');
                resolve(null)
            }
        })
    },
    // 设置表单
    setFormData({ commit, rootState }, formData) {
        return new Promise((resolve, reject) => {
            const userId = rootState.user.userId;
            window.localStorage.setItem(`${userId}-formData`, JSON.stringify(formData));
            commit('set_form_data', formData);
            resolve(formData)
        })
    },
    // 删除保存的表单
    delFormData({ commit, rootState }) {
        return new Promise((resolve, reject) => {
            const userId = rootState.user.userId;
            window.localStorage.removeItem(`${userId}-formData`);
            commit('set_form_data', null)
            resolve()
        })
    },
    // 获取工种快捷选择列表
    async getComparedList({ commit }) {
        const result = await comparedList();
        commit('set_quick_selection', result.rows)
    },

    // 删除/加入对比
    async handlecoCmparedDele({ state, commit }, data) {
        const id = data.userAuthenticateId || data.id;
        await comparedJoin(id);
        const list = [].concat(state.quickSelections);
        const index = list.findIndex((item) => {
            return item.userAuthenticateId == id;
        });
        if (index > -1) {
            list.splice(index, 1);
            commit('set_quick_selection', list);
            return 0;
        } else {
            const listItem = {
                avatar: data.avatar,
                categoryTitle: data.categoryTitle,
                comparedId: data.compared,
                nickName: data.nickName,
                userAuthenticateId: id,
                userId: data.userId,
            }
            list.push(listItem);
            commit('set_quick_selection', list);
            return 1;
        }
    },
    // 获取认证详情
    async getUserAuthInfo({ state, commit , rootState},id) {
        const result = await userAuthInfo(id);
        commit('set_apply_data', result.data);
        commit('set_apply_status', result.data?.status || 0);
        if(result.data?.status == 1 && rootState.user.workNum === 0){
            commit('SET_WORK_NUM',1, {root:true})
        }
        return result
    },
    // 获取认证草稿详细
    async getUserAuthDraft({ state, commit , rootState}) {
        const result = await createUserAuthenticate();
        const data = window.localStorage.getItem(`${result.data.id}-AuthDraft`);
        if(data){
            return JSON.parse(data)
        }
        return result.data;
    },
    // 保存草稿
    setUserAuthDraft({},data){
        window.localStorage.setItem(`${data.id}-AuthDraft`,JSON.stringify(data));
    },

    // 获取工种列表
    async getCategoryList({ commit }) {
        const res = await getCategoryList();
        commit('set_category_list', res.data);
        return res
    },
    // 获取技能表单
    getSkillFormData({ rootState }) {
        return new Promise(async (resolve, reject) => {
            const userId = rootState.user.userId;
            const data = window.localStorage.getItem(`${userId}-skillFormData`);
            if(data){
                resolve(JSON.parse(data))
            }else{
                resolve(null)
            }
        })
    },
    // 设置表单
    setSkillFormData({ rootState }, formData) {
        return new Promise((resolve, reject) => {
            const userId = rootState.user.userId;
            window.localStorage.setItem(`${userId}-skillFormData`, JSON.stringify(formData));
            resolve(formData)
        })
    },
    // 删除保存的表单
    delSkillFormData({ rootState }) {
        return new Promise((resolve, reject) => {
            const userId = rootState.user.userId;
            window.localStorage.removeItem(`${userId}-skillFormData`);
            resolve()
        })
    },

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
