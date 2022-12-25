const state = {
    tabName:'newToday',
    dragData: {},
    toolMenu:[],
}


const mutations = {
    SET_TAB_NAME(state,tabName){
        state.tabName = tabName;
    },
    SET_DRAG_DATA(state, data) {
        state.dragData=data;
    },
    SET_TOOL_MENU(state,data){
        state.toolMenu=data;
    }
}

const actions = {

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
