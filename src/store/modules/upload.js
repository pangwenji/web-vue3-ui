const states = {
    listData:[],
    popovreVisible:false,
    
}

const getters = {
    listData: (state)=> state.listData,
}

const mutations = {
    // 保存到列表
    addFileList(state,data){
        const list = Object.assign([],state.listData)
        list.push(data);
        state.listData = list;
    },

    delFileList(state,index){
        var list = Object.assign([],state.listData);
        list.splice(index,1);
        state.listData = list;
        console.log(state.listData,index)
    },
    // 全部取消上传
    cancelAllUpload(state,list){
        state.listData = list;
    },
    POPOVER_CLOSE(state){
        if(state.popovreVisible){
            state.popovreVisible = false;
        }
    },
    POPOVER_OPEN(state){
        if(!state.popovreVisible){
            state.popovreVisible = true;
        }
    },
    SET_LIST_DATA(state, listData) {
        state.listData = listData;
    },
    
}

const actions = {
    uploadNext({state}){
        for(var item of state.listData){
            if(item.state == 'waiting'){
                item.uploadFile();
            }
        }
    }
}

export default {
    namespaced: true,
    state:states,
    getters,
    mutations,
    actions
}