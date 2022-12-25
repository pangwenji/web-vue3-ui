import {ElMessage} from 'element-plus'
import {comparedJoin} from "@/api/personnel/recruitmentWall";

const state = {
    tabName: 'newToday',
    contrast: [],
    config: {rate: "0%"}
}


const mutations = {
    SET_TAB_NAME(state, tabName) {
        state.tabName = tabName;
    },
    SET_CONTRAST(state, contrast) {
        let index = state.contrast.findIndex(res => {
            return contrast.id === res.userAuthenticateId;
        })
        if (index === -1) {
            // ElMessage({
            //     showClose: true,
            //     message: '该工种用户已经存在对比中！',
            //     type: 'warning',
            // })
            // return;
            // 加入对比接口
            comparedJoin(contrast.id);
            state.contrast.push(contrast);
        } else {
            state.contrast.splice(index, 1);
        }
        contrast.userAuthenticateId = contrast.id;

    },
    DELETE_CONTRAST(state, data) {
        console.log(data)
        // 加入对比接口
        comparedJoin(data.userAuthenticateId);
        state.contrast.splice(data.index, 1);
    },
    SET_CONTRASTS(state, list) {
        state.contrast = list;
    },
    SET_CONFIG(state, config) {
        state.config = config
    }
}

const actions = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}