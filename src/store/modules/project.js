import Cookies from 'js-cookie'
import { 
    addProject, 
    getProjects, 
    updateMyProject,
    deleteProject, 
    updateJoinProjectOrder,
    updateMyProjectOrder,
    archiveMyProject,
    getMyArchiveProject,
    updateColorTag,
    cancelProjectArchive,
    transferAndQuit,
} from "@/api/project/project.js"
import { 
    ElMessage,
    ElMessageBox,
} from 'element-plus'
import {
    quitProject,
} from "@/api/project/menber.js"

import {
    deleteFile,
    getFileList,
    createWpsFile,
    createDirectory,
    getDirectoryList,
    setFileAsVersion,
    createFileCollect,
    updateTopFileObject,
    setFileReviewStatus,
    removeFileVersion,
    removeAllFileVersion,
    getDetails,
} from "@/api/project/files.js"

const state = {
    titleName:'音效',
    uploadTime: new Date().getTime(), //更新的时间戳
    isAsc: Cookies.get('isAsc') || 1, // 2 降序  1 升序
    sortKey: Cookies.get('sortKey') || 'createTime',//排序方式
    searchKey: '',//搜索
    openInfo: true,//是否展开详情
    layoutType: 'card', //card 卡片 list 列表
    projectData: {}, //当前项目数据
    catalogues:[], //文件数据

    MyProjects:[], //我的项目列表
    InProjects:[],//参与项目列表
    SeProjects:[],//我的归档列表
    
    RightData:{
        type: 0, //1 项目 2 文件
        data: null,
    },

    fileList: [],   // 文件列表
    folderList: [], // 文件夹列表
    breadcrumbs: [], // 项目目录路径

    dragData:null, //当前拖拽的文件信息
    folderInfo: {}, // 当前文件夹信息
    isEnterDetails: false
}
const mutations = {
    SET_UPLOAD_TIME(state,uploadTime){
        state.uploadTime = uploadTime;
    },
    SET_TITLE_NAME(state,titleName){
        state.titleName = titleName;
    },
    SET_IS_ASC(state,isAsc){
        state.isAsc = isAsc;
        Cookies.set('isAsc', isAsc)
    },
    SET_SORT_KEY(state,sortKey){
        state.sortKey = sortKey;
        Cookies.set('sortKey', sortKey)
    },
    SET_SEARCH_KEY(state,searchKey){
        state.searchKey = searchKey;
    },
    SET_OPEN_INFO(state,openInfo){
        state.openInfo = openInfo;
    },
    SET_RIGHT_DATA(state,RightData){
        state.RightData = RightData;
    },
    SET_LAYOUT_TYPE(state,layoutType){
        state.layoutType = layoutType;
    },
    SET_PROJECT_DATA(state,data){
        state.projectData = data
    },
    SET_CATALOGUES(state,data){
        state.catalogues.push();
    },
    SET_MY_PROJECTS(state,projects){
        state.MyProjects = projects;
    },
    SET_JOIN_PROJECTS(state,projects){
        state.InProjects = projects;
    },
    SET_SAVE_PROJECTS(state,projects){
        state.SeProjects = projects;
    },
    SET_BREADCRUMBS(state,breadcrumbs){
        state.breadcrumbs = breadcrumbs;
    },
    SET_FILE_LIST(state,files){
        const list = files.map((item,index)=>{
            for(var option of state.fileList){
                if(item.id == option.id){
                    return Object.assign(option,item);
                }
            }
            return item;
        })
        state.fileList = list;
    },
    SET_FOLDER_LIST(state,folders){
        const list = folders.map((item,index)=>{
            for(var option of state.folderList){
                if(item.id == option.id){
                    return Object.assign(option,item);
                }
            }
            return item;
        })
        state.folderList = list
    },

    DEL_FILE_LIST(state,{id}){
        const list = state.fileList.filter(item=>item.id != data.id);
        state.fileList = list;
    },

    DEL_FOLDER_LIST(state,{id}){
        const list = state.folderList.filter(item=>item.id != data.id);
        state.folderList = list;
    },

    DEL_FOLDER_LIST(){
        
    },

    SET_DRAG_DATA(state,data){
        state.dragData = data;
    },
    SET_FOLDER_INFO(state, folderInfo) {
        state.folderInfo = folderInfo
    },
    SET_ENTER(state, isEnterDetails) {
        state.isEnterDetails = isEnterDetails
    }
}
const actions = {
    // 项目切换时
    async changeProject({state,commit},data){
        // commit('SET_PROJECT_DATA',{});
        // const projectData = await getProjectDetails({id:data.id});
        commit('SET_PROJECT_DATA',data);
        commit('SET_RIGHT_DATA',{ type: 1, data});
    },
    //获取项目列表
    getProjectsList({commit,dispatch},data = {}){
        return new Promise((resolve,reject)=>{
            getProjects(data).then(async res=>{
                const project = res.data.project || [];
                const archive = res.data.archive || [];
                const join = res.data.join || [];
                const projects = await dispatch('projectSort',{
                    datas: project,
                    orders:res.data.project_order
                })
                const joins = await dispatch('projectSort',{
                    datas: join,
                    orders:res.data.join_order
                })
                commit('SET_MY_PROJECTS',projects);
                commit('SET_JOIN_PROJECTS',joins);
                commit('SET_SAVE_PROJECTS',archive);
                resolve();
            }).catch(err=>{
                console.log(err)
                commit('SET_MY_PROJECTS',[]);
                commit('SET_JOIN_PROJECTS',[]);
                commit('SET_SAVE_PROJECTS',[]);
                reject()
            })
        })
    },
    //获取归档项目
    getMyArchiveProject({commit},data = {}){
        return new Promise((resolve,reject)=>{
            getMyArchiveProject(data).then(res=>{
                commit('SET_SAVE_PROJECTS',res.data);
                resolve();
            }).catch(err=>{
                commit('SET_MY_PROJECTS',[]);
                commit('SET_JOIN_PROJECTS',[]);
                reject()
            })
        })
    },
    //转让并退出项目
    handleTransferAndQuit({state,commit},data = {}){
        return new Promise((resolve,reject)=>{
            transferAndQuit(data).then(res=>{
                const list = state.MyProjects;
                for(var i=0;i<list.length;i++){
                    if(list[i].id == data.id){
                        list.splice(i,1);
                        break;
                    }
                }
                commit('SET_MY_PROJECTS',list)
                resolve(res);
            }).catch(err=>{
                reject(err)
            })
        })
    },
    // 删除项目
    handleDeleteProject({state,commit},{id}){
        return new Promise((resolve,reject)=>{
            const text = '确定要删除该项目吗? 一旦删除，项目文件将被清空且无法恢复。';
            const title = '删除项目'
            ElMessageBox.confirm(text, title, {
                customClass: 'messageBox-custom-warning',
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning',
                showClose:true,
                center: true,
                beforeClose: (action, instance, done)=>{
                    if(action === 'confirm'){
                        instance.confirmButtonLoading = true
                        deleteProject({id}).then(res=>{
                            const list = state.MyProjects;
                            for(var i=0;i<list.length;i++){
                                if(list[i].id == id){
                                    list.splice(i,1);
                                    break;
                                }
                            }
                            commit('SET_MY_PROJECTS',list)
                            done();
                            ElMessage.success('项目删除成功');
                            resolve(res)
                        }).catch(err=>{
                            done();
                            reject(err)
                        })
                    }else{
                        if(instance.confirmButtonLoading){ return }
                        done()
                    }
                }
            }).then(()=>{}).catch(err=>{
                reject(err)
            })
        })
    },
    // 退出项目
    handleQuitProject({state,commit,dispatch},{id}){
        return new Promise((resolve,reject)=>{
            quitProject({id}).then(res=>{
                const list = state.InProjects;
                for(var i=0;i<list.length;i++){
                    if(list[i].id == id){
                        list.splice(i,1);
                        break;
                    }
                }
                commit('SET_JOIN_PROJECTS',list)
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    // 项目归档
    handleArchiveMyProject({state,commit},data){
        return new Promise((resolve,reject)=>{
            archiveMyProject(data).then(res=>{
                const list1 = state.MyProjects;
                const list2 = state.SeProjects;
                for(const key in list1){
                    if(list1[key].id == data.id){
                        const item = list1.splice(key,1)[0];
                        item.status = 2;
                        list2.push(item);
                        break;
                    }
                }
                commit('SET_MY_PROJECTS',[].concat(list1));
                commit('SET_SAVE_PROJECTS',[].concat(list2));
                resolve();
            }).catch(err=>{
                reject();
            })
        })
    },

    // 取消归档
    handleCancelArchive({state,commit},data){
        return new Promise((resolve,reject)=>{
            cancelProjectArchive({id:data.id}).then(res=>{
                const list1 = state.SeProjects;
                const list2 = state.MyProjects;
                for(const key in list1){
                    if(list1[key].id == data.id){
                        const item = list1.splice(key,1)[0];
                        item.status = 1;
                        list2.push(item);
                        break;
                    }
                }
                commit('SET_MY_PROJECTS',[].concat(list2));
                commit('SET_SAVE_PROJECTS',[].concat(list1));
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },

    //项目排序
    projectSort({},{datas,orders}){
        try{
            orders =  JSON.parse(orders);
        }catch(err){
            orders =  [];
        }
        const array = new Array(orders.length).fill(false);
        datas.forEach(item => {
            const i = orders.indexOf(item.id);
            if(i > -1){
                array[i] = item;
            }else{
                array.push(item)
            }
        });
        return array.filter(item=>item);
    },

    /**
     * @param {String} module 模块移动的模块
     * @param {Number} current 当前移动的选项下标
     * @param {String} index 移动到模块的下标
     * @param {String} position 移动到模块的定位 top 上方， bottom 下方
     * 
     * **/
    handleSortProject({state,commit,dispatch},{module='',current=0,index=0,position=''}){
        if(current == index){
            return
        }
        if((current == index - 1 && position == 'top') || (current == index + 1 && position == 'bottom')){
            return
        }
        if(position == 'bottom'){
            index = index + 1;
        }
        return new Promise((resolve,reject)=>{
            const list = ( module == 'MyProject' ? state.MyProjects : state.InProjects).map(item=>item.id);
            const item = list[current];
            list[current] = false;
            list.splice(index,0,item);
            const array = list.filter(item=>item);
            const order = JSON.stringify(array);
            if(module == 'MyProject'){
                updateMyProjectOrder({data:order}).then(async res=>{
                    const data = await dispatch('projectSort',{datas: state.MyProjects, orders:order })
                    commit("SET_MY_PROJECTS",data);
                    resolve(res);
                }).catch(err=>{
                    reject(err)
                })
            }else{
                updateJoinProjectOrder({data:JSON.stringify(order)}).then(async res=>{
                    const data = await dispatch('projectSort',{datas: state.InProjects, orders:order })
                    commit("SET_JOIN_PROJECTS",data);
                    resolve(res);
                }).catch(err=>{
                    reject(err)
                })
            }
        })

    },
    // 创建项目
    handleAddProject({state,dispatch},data = {}){
        return new Promise((resolve,reject)=>{
            addProject(data).then(async res=>{
                await dispatch('getProjectsList')
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    // 更新项目颜色
    handleUpdateProjectTag({state,commit},{id,name,colorTag,type}){
        return new Promise((resolve,reject)=>{
            updateColorTag({id,colorTag}).then(res=>{
                if(type == 'MyProject'){
                    commit("SET_MY_PROJECTS",state.MyProjects.map(item=>{
                        if(item.id == id){
                            item.colorTag = colorTag;
                        }
                        return item;
                    }));
                }else if(type == 'InProject'){
                    commit("SET_JOIN_PROJECTS",state.InProjects.map(item=>{
                        if(item.id == id){
                            item.colorTag = colorTag;
                        }
                        return item;
                    }));
                }else{
                    commit("SET_SAVE_PROJECTS",state.SeProjects.map(item=>{
                        console.log(item)
                        if(item.id == id){
                            item.colorTag = colorTag;
                        }
                        return item;
                    }));
                }
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    // 更新项目
    handleupdateProject({state,commit},data = {}){
        return new Promise((resolve,reject)=>{
            updateMyProject(data).then(res=>{
                commit("SET_MY_PROJECTS",state.MyProjects.map(item=>{
                    if(item.id == data.id){
                        item.name = data.name;
                        // item.colorTag = data.colorTag;
                        item.antiScreenRecording = data.antiScreenRecording;
                    }
                    return item;
                }));
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    // 获取文件
    handleGetFiles({state,dispatch},data){
        if(!data){
            data = {
                project_id: state.breadcrumbs[state.breadcrumbs.length - 1].projectId,
                parent_id: state.breadcrumbs[state.breadcrumbs.length - 1].parentId
            }
        }
        return new Promise((resolve,reject)=>{
            getFileList(data).then(res=>{
                dispatch('handleSortFiles',res.data)
                resolve(res);
            }).catch(err=>{
                reject(err);
            })
        })

    },
    // 获取文件夹
    handleGetFolders({state,dispatch},data){
        if(!data){
            data = {
                project_id: state.breadcrumbs[state.breadcrumbs.length - 1].projectId,
                parent_id: state.breadcrumbs[state.breadcrumbs.length - 1].parentId
            }
        }
        return new Promise((resolve,reject)=>{
            getDirectoryList(data).then(res=>{
                dispatch('handleSortFolders',res.data)
                resolve(res);
            }).catch(err=>{
                reject(err);
            })
        })
    },
    // 文件夹排序
    handleSortFolders({state,commit},folderList){
        const key = state.sortKey;
        const isAsc = state.isAsc;
        folderList = folderList ? folderList : [].concat(state.folderList);
        return new Promise((resolve,reject)=>{
            const NewArray = [];
            const SortArray = [];
            folderList.forEach((item)=>{
                if(item.top){
                    NewArray.push(item)
                }else{
                    SortArray.push(item)
                }
            })
            const arr = SortArray.sort((a,b)=>{
                const orderBy = isAsc == 1? 1:-1
                let x = a[key]
                let y = b[key]
                if (key === 'name') {
                    //判定比较内容是不是数值
                    x = parseInt(x)
                    y = parseInt(y)
                    if (!(!isNaN(x) && !isNaN(y))) {
                        x = a[key].toLowerCase()
                        y = b[key].toLowerCase()
                    }
                }
                if (x > y) { return 1 * orderBy }
                if (x < y) { return -1 * orderBy }
                return 0;
                // if(key == 'name'){
                //     if(isAsc == 1){
                //         return a[key].localeCompare(b[key])
                //     }else{
                //         return b[key].localeCompare(a[key])
                //     }
                // }else{
                //     if(a[key] > b[key]){
                //         return  isAsc == 1? 1:-1;
                //     }else if(a[key] < b[key]){
                //         return  isAsc == 1? -1:1;
                //     }else{
                //         return 0;
                //     }
                // }
            })
            NewArray.push(...arr)
            commit('SET_FOLDER_LIST',NewArray)
        })
    },
    // 文件排序
    handleSortFiles({state,commit},fileList){
        const key = state.sortKey;
        const isAsc = state.isAsc;
        fileList = fileList ? fileList : [].concat(state.fileList) 
        return new Promise((resolve,reject)=>{
            const NewArray = [];
            const SortArray = [];
            fileList.forEach((item)=>{
                if(item.top){
                    NewArray.push(item)
                }else{
                    SortArray.push(item)
                }
            })
            const arr = SortArray.sort((a,b)=>{
                const orderBy = isAsc == 1? 1:-1
                let x = a[key]
                let y = b[key]
                if (key === 'name') {
                    //判定比较内容是不是数值
                    x = parseInt(x)
                    y = parseInt(y)
                    if (!(!isNaN(x) && !isNaN(y))) {
                        x = a[key].toLowerCase()
                        y = b[key].toLowerCase()
                    }
                }
                if (x > y) { return 1 * orderBy }
                if (x < y) { return -1 * orderBy }
                return 0;
                // if(key == 'name'){
                //     if(isAsc == 1){
                //         return a[key].localeCompare(b[key])
                //     }else{
                //         return b[key].localeCompare(a[key])
                //     }
                // }else{
                //     if(a[key] > b[key]){
                //         return  isAsc == 1? 1:-1;
                //     }else if(a[key] < b[key]){
                //         return  isAsc == 1? -1:1;
                //     }else{
                //         return 0;
                //     }
                // }
            })
            NewArray.push(...arr)
            commit('SET_FILE_LIST',NewArray)
        })
    },
    // 获取目录详情
    handleGetDetails({state,commit,dispatch},data){
        return new Promise((resolve,reject)=>{
            getDetails(data).then(async res=>{
                const project_id = res.data.projectId;
                const path = res.data.path.reverse();
                commit('SET_BREADCRUMBS',path.map(item=>{
                    return {
                        id:item.id,
                        parentId:item.id,
                        projectId: project_id,
                        name: item.name
                    }
                }));
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    // 创建文件夹
    handleCreateDirectory({dispatch},data){
        return new Promise((resolve,reject)=>{
            createDirectory(data).then(res=>{
                dispatch('handleGetFolders');
                resolve(res);
            }).catch(err=>{
                reject(err)
            })
        })
    },
    // 创建文件
    handleCreateFiles({state,commit,dispatch,rootState},data){
        return new Promise((resolve,reject)=>{
            createWpsFile(data).then(res=>{
                dispatch('handleGetFiles')
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    // 创建收集文件夹
    handleCreateFileCollect({state,dispatch},data){
        return new Promise((resolve,reject)=>{
            createFileCollect(data).then(res=>{
                dispatch('handleGetFolders')
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    // 删除文件或者文件夹
    handleDeleteFile({state,commit},data){
        return new Promise((resolve,reject)=>{
            let text = `确定要删除${data.typeName}“${data.name}”吗? 删除后,${data.typeName}将被移至回收站!`;
            if(data.version > 1){
                text = `确定要删除${data.typeName}“${data.name}”及其全部版本吗? 删除后,${data.typeName}及其版本将被移至回收站!`;
            }
            const title = `删除${data.typeName}`
            ElMessageBox.confirm(text, title, {
                customClass: 'messageBox-custom-warning',
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning',
                showClose:true,
                center: true,
                beforeClose: (action, instance, done)=>{
                    if(action === 'confirm'){
                        instance.confirmButtonLoading = true
                        deleteFile({id:data.id}).then(res=>{
                            state.projectData.recycleCount = state.projectData.recycleCount + 1 
                            commit('SET_PROJECT_DATA', Object.assign({},state.projectData))
                            if(data.type == 1){
                                const list = state.folderList.filter(item=>item.id != data.id)
                                commit('SET_FOLDER_LIST',[].concat(list));
                            }else{
                                const list = state.fileList.filter(item=>item.id != data.id)
                                commit('SET_FILE_LIST',[].concat(list));
                            }
                            done();
                            resolve(res)
                        }).catch(err=>{
                            done();
                            reject(err)
                        })
                    }else{
                        if(instance.confirmButtonLoading){ return }
                        done()
                        
                    }
                }
            }).then(()=>{}).catch(err=>{
                reject(err)
            })
        })
    },
    // 将文件设置为另一个文件的最新版本
    handleSetFileAsVersion({state,dispatch},data){
        return new Promise((resolve,reject)=>{
            setFileAsVersion(data).then(res=>{
                const length = state.breadcrumbs.length
                const tagData = state.breadcrumbs[length - 1];
                const project_id = tagData.projectId;
                const parent_id = tagData.parentId;
                dispatch('handleGetFiles',{parent_id,project_id})
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    // 文件置顶
    updateTopFileObject({state,dispatch},{id,top,type}){
        return new Promise((resolve,reject)=>{
            updateTopFileObject({id,top}).then(res=>{
                const length = state.breadcrumbs.length
                const tagData = state.breadcrumbs[length - 1];
                const project_id = tagData.projectId;
                const parent_id = tagData.parentId;
                if(type == 'folder'){
                    dispatch('handleGetFolders',{parent_id,project_id})
                }else{
                    dispatch('handleGetFiles',{parent_id,project_id})
                }
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    // 文件置顶
    setFileReviewStatus({},{id,reviewStatus}){
        return new Promise((resolve,reject)=>{
            setFileReviewStatus({id,reviewStatus}).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    // 文件版本解除
    removeFileVersion({state,dispatch},{id}){
        return new Promise((resolve,reject)=>{
            removeFileVersion({id}).then(res=>{
                const length = state.breadcrumbs.length
                const tagData = state.breadcrumbs[length - 1];
                const project_id = tagData.projectId;
                const parent_id = tagData.parentId;
                dispatch('handleGetFiles',{parent_id,project_id})
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    // 解除文件的所有版本
    removeAllFileVersion({state,dispatch},{id}){
        return new Promise((resolve,reject)=>{
            removeAllFileVersion({id}).then(res=>{
                const length = state.breadcrumbs.length
                const tagData = state.breadcrumbs[length - 1];
                const project_id = tagData.projectId;
                const parent_id = tagData.parentId;
                dispatch('handleGetFiles',{parent_id,project_id})
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}