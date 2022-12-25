import { login, phoneLogin, logout, getInfo, refreshToken } from '@/api/login'
import { realVerify } from '@/api/user/index.js'
import { setWorkbenchMenu } from '@/api/menu.js'
import { getToken, getTokenId, setToken, setTokenId, setExpiresIn, removeToken, removeTokenId,setUserId } from '@/utils/auth'
import defAva from '@/assets/images/profile.jpg'
import {parseTime} from "@/utils/ruoyi";
import {getMemberInfo} from "@/api/user";
import { payAccountGetInfo } from "@/api/pay/pay";
import store from "../index";
const user = {
  state: {
    userId: 0,
    token: getToken(),
    tokenId: getTokenId(),
    name: '',
    nickName: '',
    avatar: '',
    phone:'',
    sex:'',
    money: 0,
    workNum: 0,
    verified: 0,
    roles: [],
    member:{},
    idCard: [],
    permissions: [],
    workbenchConfig: '',
    passwordStatus:0,
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_TOKEN_ID: (state, tokenId) => {
      state.tokenId = tokenId;
    },
    SET_EXPIRES_IN: (state, time) => {
      state.expires_in = time
    },
    SET_USER_ID: (state, userId) => {
      state.userId = userId
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_NICKNAME: (state, nickName) => {
      state.nickName = nickName
    },
    SET_NUMBER: (state, number) => {
      state.number = number
    },
    SET_PHONE: (state, phone) => {
      state.phone = phone
    },
    SET_SEX: (state, sex) => {
      state.sex = sex
    },
    SET_MEMBER: (state, member) => {
      state.member = member
    },
    SET_VERIFIED: (state, verified) => {
      state.verified = verified
    },
    SET_WORK_NUM: (state, workNum) => {
      state.workNum = workNum
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_USER_IDCARD: (state, idCard) => {
      state.idCard = idCard
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_MONEY: (state, money) => {
      state.money = money
    },
    SET_MARGIN: (state, margin) => {
      state.margin = margin
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_PASSWORD_STATUS: (state, passwordStatus) => {
      state.passwordStatus = passwordStatus
    },
    SET_WORKBENCH_CONFIG: (state, workbenchConfig) => {
      setWorkbenchMenu({value:workbenchConfig}).then(res=>{
        state.workbenchConfig = workbenchConfig
      })
    }
  },

  actions: {
    // 登录
    Login({ commit, dispatch }, userInfo) {
      const username = userInfo.username.trim()
      const phone = userInfo.phone.trim()
      const password = userInfo.password
      const code = userInfo.code
      const smsCode = userInfo.smsCode
      const inviteUser = userInfo.inviteUser
      const uuid = userInfo.uuid
      return new Promise( async (resolve, reject) => {
        try{
          let result = null;
          if(userInfo.loginType == 'phoneCode'){
            result = await phoneLogin(phone, smsCode,inviteUser, uuid)
          }else if(userInfo.loginType == 'userPassword'){
            result = await login(username, password, code, uuid)
          }
          let data = result.data
          setToken(data.access_token)
          commit('SET_TOKEN', data.access_token)
          setTokenId(data.tokenId)
          commit('SET_TOKEN_ID', data.tokenId)
          setExpiresIn(data.expires_in)
          commit('SET_EXPIRES_IN', data.expires_in)
          resolve()
        }catch(err){
          reject(err)
        }
      })
    },

    // 获取用户信息
    GetInfo({ commit, state , dispatch}) {
      return new Promise((resolve, reject) => {
        getInfo().then(async res => {
          const user = res.data.user;
          const idCard = res.data.idcard;
          const workbenchConfig = res.data.workbenchConfig;
          commit('SET_USER_IDCARD', idCard)
          commit('SET_WORKBENCH_CONFIG', workbenchConfig)
          const payAccount = res.data.payAccount
          const avatar = (user.avatar == "" || user.avatar == null) ? defAva :  user.avatar;
          if (res.data.roles && res.data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', res.data.roles)
            commit('SET_PERMISSIONS', res.data.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_NAME', user.userName)
          commit('SET_SEX', user.sex)
          commit('SET_NICKNAME', user.nickName)
          commit('SET_NUMBER', user.number)
          commit('SET_MONEY', (payAccount.balance * 1).toFixed(2))
          commit('SET_PASSWORD_STATUS', payAccount.passwordStatus);
          commit('SET_AVATAR', avatar)
          commit('SET_MARGIN', user.margin)
          commit('SET_VERIFIED', user.verified)
          commit('SET_USER_ID', user.userId)
          commit('SET_WORK_NUM', user.workNum)
          setUserId(user.userId)
          await Promise.all([dispatch("IM/handleInit"),dispatch('MemberInfo')]);
          resolve(res.data)
        }).catch(error => {
          console.log(error.message)
          reject(error)
        })
      })
    },

    // 实名认证
    UserVerify({state,commit},data){
      return new Promise((resolve, reject) => {
        realVerify(data).then(res => {
          commit('SET_VERIFIED', 1)
          commit('SET_USER_IDCARD', res.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    getPayAccountGetInfo({state,commit},data){
      return new Promise((resolve, reject) => {
        payAccountGetInfo().then(res => {
            commit('SET_MONEY',(res.data.balance * 1).toFixed(2))
            resolve(res)
        }).catch(err=>{
            reject()
        });
      })
    },

    //会员信息
    MemberInfo({state,commit},data){
      return new Promise((resolve, reject) => {
        getMemberInfo(data).then(res => {
          commit('SET_MEMBER', res.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 刷新token
    RefreshToken({commit, state}) {
      return new Promise((resolve, reject) => {
        refreshToken(state.token).then(res => {
          setExpiresIn(res.data)
          commit('SET_EXPIRES_IN', res.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          removeTokenId()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        removeTokenId()
        resolve()
      })
    }
  }
}

export default user
