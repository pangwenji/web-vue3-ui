
import { getShoppingCartList } from '@/api/material/shoppingCart.js'
import { getUserAuthorize }  from '@/api/material/index.js'
const state = {
    ADMINAUTH: false,
    cartItemNum:0,
    menuName:'',
    typeTabData: [], // 类型tab
    waitSettingList: [], // 待设置列表
    titleName:'音效',
    tabName: 1 ,
    total: 0 ,//列表总记录数
    pageNum: 1 ,//当前页数
    pageCount: 1 ,//当前页数
    data:[],
    ids:[],//仓库中素材id
    checkList:[],
    //暂时存放
    releaseList:[],
    collectIds: [], // 收藏素材ids
    shoppingCartList: [], //购物车列表
}


const mutations = {
    //购物车列表数量
    SET_cartItem_Num(state,cartItemNum){
        state.cartItemNum = cartItemNum;
    },
    SET_ADMINAUTH(state,ADMINAUTH){
        state.ADMINAUTH = ADMINAUTH
    },
    //设置当前菜单
    SET_menuName(state,menuName){
        state.menuName = menuName;
    },
    SET_TITLE_NAME(state,titleName){
        state.titleName = titleName;
    },
    SET_TAB_NAME(state,tabName){
        state.tabName = tabName;
    },
    SET_CARD_DATA(state,data){
        state.data = data;
    },
    SET_LIST_TOTAL(state,total){
        state.total = total;
    },
    SET_LIST_PAGENUM(state,pageNum){
        state.pageNum = pageNum;
    },
    SET_LIST_COUNT(state,pageCount){
        state.pageCount = pageCount;
    },
    SET_CHECK_IDS(state,ids){
        state.ids = ids;
    },
    SET_CHECK_LIST(state,list){
        state.checkList = list;
    },
    SET_RELEASE_List(state,releaseList){
        state.releaseList = releaseList;
    },
    SET_TYPE_TAB_DATA(state, typeTabData) {
        state.typeTabData = typeTabData;
    },
    SET_WAIT_SETTING_LIST(state, waitSettingList) {
        state.waitSettingList = waitSettingList;
    },
    addFileList(state, data){
        const list = Object.assign([], state.waitSettingList)
        list.push(data);
        state.waitSettingList = list;
    },
    delFileList(state, index){
        const list = Object.assign([], state.waitSettingList);
        list.splice(index, 1);
        state.waitSettingList = list;
    },
    SET_COLLECT_IDS(state, collectIds) {
        state.collectIds = collectIds;
    },
    addCollect(state, mid){ // 添加收藏
        const list = Object.assign([], state.collectIds)
        list.push(mid);
        state.collectIds = list;
    },
    delCollect(state, mid){ // 删除收藏
        const list = Object.assign([], state.collectIds);
        const index = list.indexOf(mid);
        list.splice(index, 1);
        state.collectIds = list;
    },
    SET_SHOPPING_CART_LIST(state, shoppingCartList){
        state.shoppingCartList = shoppingCartList;
    },
}

const actions = {
    // 获取购物车列表
    getCartList({commit}, query = {}) {
        return new Promise((resolve,reject)=>{
            getShoppingCartList(query).then(async res=>{
                commit('SET_SHOPPING_CART_LIST',res.data);
                resolve();
            }).catch(err=>{
                commit('SET_SHOPPING_CART_LIST',[]);
                reject()
            })
        })
    },
    getUserAuthorize({commit}){
        return new Promise((resolve,reject)=>{
            getUserAuthorize().then(res=>{
                commit('SET_ADMINAUTH',res.data);
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
