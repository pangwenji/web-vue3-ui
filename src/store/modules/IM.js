import IM2 from "@/utils/IM2"
import {
    getImAccount,
    getImAccountGroup,
    deleteImContact,
    uploadImContact,
    createGroup,
    updateGroup,
    deleteGroup,
    saveTeamInvite,
    getSearchAccount,
    getTeamInvite,
    getUploadInvite,
    getNoticeList,
    getUpdateTeamPortrait,
    submitFriendApply,
    updateFriendApply,
    getFriendApplyList,
    getInfoByAccountId
} from "@/api/IM"
const state = {
    im: null,                //IM实例
    status: 'disconnect',    //IM连接状态 success:已连接，error: 连接失败; awaiting : 等待连接, disconnect: 连接已断开
    appKey: null,            //云信key
    account: null,           //当前账号
    scene: null,             //当前会话场景 p2p: 点对点 team: 群聊  notices: 通知
    sessionItem: null,       //当前会话
    msgs: [],                //消息列表
    teams: [],               //群聊列表              
    muteList: [],            //静音列表
    blackList: [],           //黑名单列表
    contactGroups: [],       //联系人分组列表
    friends: [],             //好友列表
    sessions: [],            //会话列表
    systemAccounts: {},      //系统账号
    teamInvites: [],         //群邀请列表
    friendApplys: [],        //好友申请列表
    aboutNotice: [],         //关于我列表
    uploadFiles: {},         //当前会话正在上传的文件
    materialMataData: {}, //素材上传封面解析文件
}


const getters = {
    // 上传列表
    uploadFiles: (state) => {
        const uploadFiles = state.uploadFiles || {};
        const sessionItem = state.sessionItem || {};
        const sessionId = sessionItem.id;
        return uploadFiles[sessionId] || [];
    },
    // 未读数
    unreadNum: (state) => {
        const sessions = state.sessions;
        return sessions.reduce((sum, item, index, arr) => {
            return sum + item.unread;
        }, 0)
    },
    // 联系人列表不分组
    contacts: (state) => {
        const data = [];
        for (var item of state.contactGroups) {
            data.push(...item.msgImContacts)
        }
        return data;
    },
    // 获取分组
    groupList: (state) => {
        return state.contactGroups.map(item => {
            return {
                id: item.id,
                name: item.groupName,
            }
        });
    }
}

const mutations = {
    // 保存初始化实例
    setNim(state, im) {
        state.im = im;
    },
    //设置连接状态
    setStatus(state, status) {
        state.status = status
    },
    // 设置会话场景
    setScene(state, scene) {
        state.scene = scene
    },
    // 设置黑名单列表
    setBlackList(state, blackList) {
        state.blackList = blackList;
    },
    // 设置静音列表
    setMuteList(state, muteList) {
        state.muteList = muteList;
    },
    // 设置群聊列表
    setTeams(state, teams) {
        if (!Array.isArray(teams)) { teams = [teams] };
        state.teams = state.im.mergeObjArray(state.teams, teams, { keyPath: 'teamId' });
    },
    // 删除群聊
    delTeams(state, teamId) {
        const arr = state.teams.filter(item => item.teamId != teamId);
        state.teams = arr;
    },
    // 设置群邀请列表
    setTeamInvites(state, invite) {
        if (!Array.isArray(invite)) {
            invite = [invite];
        }
        state.teamInvites = state.im.mergeObjArray(state.teamInvites, invite, { keyPath: 'id', sortPath: 'createTime', desc: true });
    },
    // 设置群邀请列表
    setAboutNotice(state, aboutNotice) {
        state.aboutNotice = aboutNotice;
    },
    // 设置好友申请列表
    setFriendApplys(state, friendApplys) {
        state.friendApplys = friendApplys;
    },

    setContactGroups(state, grouds) {
        state.contactGroups = grouds;
    },
    // 设置我的用户信息
    setAccount(state, data) {
        state.appKey = data.appKey;
        state.account = data.account;
    },
    // 设置好友列表
    setFriends(state, friends) {
        if (!Array.isArray(friends)) {
            friends = [friends];
        }
        state.friends = state.im.mergeObjArray(state.friends, friends);
    },
    // 设置会话列表
    setSessions(state, sessions) {
        if (!Array.isArray(sessions)) {
            sessions = [sessions];
        }
        const sessionsList = state.im.mergeObjArray(state.sessions, sessions, { keyPath: 'id', sortPath: 'updateTime', desc: true });
        const sessionsData = [];
        const sessionsTop = [];
        sessionsList.forEach(item => {
            if (item.stickTopInfo && item.stickTopInfo.isStickOnTop) {
                sessionsTop.push(item)
            } else {
                sessionsData.push(item)
            }
        })
        state.sessions = [].concat(sessionsTop, sessionsData);
    },
    // 删除会话
    delSessions(state, id) {
        const arr = state.sessions.filter(item => item.id != id);
        state.sessions = arr;
    },
    // 设置当前会话
    setSessionItem(state, session) {
        state.sessionItem = session;
    },
    // 设置会话消息记录
    setMsgs(state, msgs) {
        state.msgs = msgs;
    },
    // 删除消息
    delMsg(state, msgs) {
        if (!Array.isArray(msgs)) { msgs = [msgs]; }
        if (msgs.length == 0) { return }
        const msgData = state.msgs || [];
        const idClients = msgs.map(item => item.idClient);
        state.msgs = msgData.filter(item => idClients.indexOf(item.idClient) == -1)
    },
    // 设置会话上传的文件
    setUploadFiles(state, files) {
        if (!Array.isArray(files)) { files = [files]; }
        if (files.length == 0) { return }
        const sessionId = files[0].sessionId;
        const uploadFiles = state.uploadFiles[sessionId] || [];
        state.uploadFiles[sessionId] = state.im.mergeObjArray(uploadFiles, files, { keyPath: 'objectName', sortPath: 'time' });
    },
    // 删除会话上传的文件
    delUploadFiles(state, { sessionId, objectName }) {
        if (state.uploadFiles[sessionId]) {
            state.uploadFiles[sessionId] = state.uploadFiles[sessionId].filter((item, i) => item.objectName != objectName);
        }
    },
    // 设置系统账号
    setSystemAccounts(state, systemAccounts) {
        state.systemAccounts = systemAccounts;
    },
    clearAllData(state, status) {
        state.status = status || 'disconnect';    //IM连接状态 success:已连接，error: 连接失败; awaiting : 等待连接, disconnect: 连接已断开, handleDisconnect 手动断开链接
        state.im?.destroy()              //销毁IM实例
        state.im = null;                //IM实例
        state.appKey = null;            //云信key
        state.account = null;           //当前账号
        state.scene = null;             //当前会话场景 p2p: 点对点 team: 群聊  notices: 通知
        state.sessionItem = null;       //当前会话
        state.msgs = [];                //消息列表
        state.teams = [];               //群聊列表
        state.contactGroups = [];       //联系人分组列表
        state.friends = [];             //好友列表
        state.sessions = [];            //会话列表
        state.systemAccounts = {};      //系统账号
        state.teamInvites = [];      //系统账号
        state.aboutNotice = [];      //关于我
    },
    addMaterialMataData(state, data) {
        state.materialMataData = data
    }
}

const actions = {
    // 初始化IM
    async handleInit({ state, commit }) {
        commit('clearAllData');
        commit('setStatus', 'awaiting') //等待连接
        const result = await getImAccount();
        const { appKey, token, accountId, systemAccounts } = result.data;
        commit('setSystemAccounts', systemAccounts)
        if (state.im) { await state.im.destroy() }
        const im = new IM2({ appkey: appKey, account: accountId, token, authType: 1 });
        commit("setAccount", { appKey, account: accountId })
        commit("setNim", im);
        await im.init();
    },
    // 获取好友申请列表
    async getFriendApplyList({ state, commit }) {
        const result = await getFriendApplyList();
        const listData = result.data || [];
        listData.sort((a,b)=>{
            const timeaA = new Date(a.createTime).getTime();
            const timeaB = new Date(b.createTime).getTime();
            return timeaB - timeaA;
        });
        commit('setFriendApplys', listData);
    },
    // 获取搜索的列表
    async handleGetSearchAccount({ state }, { keyword }) {
        const result = await getSearchAccount({ keyword });
        const users = await state.im.getCardFromServer(result.rows, { keyName: 'imAccountId' });
        return users
    },
    // 获取分组联系人
    handleGetGroup({ state, commit }, isRequest) {
        return new Promise((resolve, reject) => {
            if (state.contactGroups.length && !isRequest) {
                resolve(state.contactGroups);
                return
            }
            getImAccountGroup({}).then(res => {
                commit('setContactGroups', res.data);
                resolve(res.data);
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 好友申请
    async handleFriendApply({ }, { receiveImId, message, alias, groupId }) {
        await submitFriendApply({ receiveImId, message, alias, groupId });
    },
    // 同意/拒绝好友申请 1接受 2拒绝
    async handleUpdateFriendApply({ state, commit }, { id, receiveUserId, alias, groupId, s }) {
        await updateFriendApply({ id, receiveUserId, state: s, alias, groupId });
        const list = state.friendApplys.map(item => {
            if (item.id == id) {
                item.state = s
            }
            return item;
        });
        commit('setFriendApplys', list)
    },
    // 新建联系人分组
    handleCreateGroup({ state, commit }, data) {
        return new Promise((resolve, reject) => {
            createGroup(data).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err)
            })
        })
    },

    // 更新联系人分组
    handleUpdateGroup({ state, commit }, data) {
        return new Promise((resolve, reject) => {
            updateGroup(data).then(res => {
                const arr = state.contactGroups.map(item => {
                    if (item.id == data.id) {
                        item.groupName = data.groupName;
                        return item;
                    } else {
                        return item;
                    }
                })
                commit('setContactGroups', arr);
                resolve(res);
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 删除联系人分组
    handleDeleteGroup({ state, commit }, data) {
        return new Promise((resolve, reject) => {
            deleteGroup(data).then(res => {
                const arr = state.contactGroups.filter(item => {
                    return item.id != data.id;
                })
                commit('setContactGroups', arr);
                resolve(res);
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 修改联系人备注
    handleUploadImContact({ state, commit }, { id, remark, groupIndex, optionIndex }) {
        return new Promise((resolve, reject) => {
            uploadImContact({ id, remark }).then(res => {
                const arr = [].concat(state.contactGroups);
                arr[groupIndex].msgImContacts[optionIndex].remark = remark;
                commit('setContactGroups', JSON.parse(JSON.stringify(arr)));
                resolve(res);
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 删除好友 id: 用户id
    async handleDeleteImContact({ state, commit, dispatch }, { userId, groupIndex, optionIndex }) {
        const res = await deleteImContact({ userId })
        const arr = [].concat(state.contactGroups);
        const data = arr[groupIndex].msgImContacts.splice(optionIndex, 1);
        const sessionItem = Object.assign({}, state.sessionItem);
        if (data.length > 0 && sessionItem.to == data[0].contactImAccountId) {
            sessionItem.isContact = false;
        }
        commit('setContactGroups', JSON.parse(JSON.stringify(arr)));
        commit('setSessionItem', sessionItem);
        if (data.length > 0 && data[0].contactImAccountId == sessionItem.to) {
            return { closeDialog: true };
        } else {
            return { closeDialog: false };
        }
    },
    // 创建群聊
    async handleCreateTeam({ state, commit, dispatch, rootState }, { name = '', accounts = [], receiveUsers = [], avatars = [] }) {

        const team = await state.im.handleCreateTeam({ name, accounts, avatar: 'string' });
        commit("setTeams", team);
        await dispatch('handleUpdateTeamPortrait', { urls: avatars, tid: team.teamId, ownerAccountId: team.owner });
        // await dispatch('handleInviteMember',{accounts,teamId:team.teamId})
        return team;
    },


    // 获取@我通知列表
    async getNoticeData({ state, commit }, data) {
        const result = await getNoticeList(data);
        commit('setAboutNotice', result.rows);
        return result.rows;
    },

    // 获取群邀请信息
    async handleGetTeamInvite({ state, commit }, data) {
        if (state.teamInvites.length == 0 || data) {
            const result = await getTeamInvite();
            commit('setTeamInvites', result.data);
            return result.data;
        } else {
            return state.teamInvites;
        }
    },
    // 修改群邀请信息
    async handleUploadInvite({ state, commit }, { id, status, from, teamId }) {
        if (status == 1) {
            await state.im.team.acceptTeamInvite({ from, teamId });
            const team = await state.im.team.getTeams({ teamId });
            commit("setTeams", team);
        } else {
            await state.im.team.rejectTeamInvite({ from, teamId });
        }
        await getUploadInvite({ id, state: status });
        const arr = state.teamInvites.map(item => {
            if (item.id == id) {
                item.state = status;
            }
            if (item.teamId == teamId && item.state == 0) {
                item.state = 3;
            }
            return item
        })
        commit('setTeamInvites', arr);
    },

    // 监听更新群信息
    async handleOnUpdateTeam({ state, commit }, data) {
        const teams = state.teams;
        teams.forEach(item => {
            if (data.teamId == item.teamId) {
                data = Object.assign(item, data)
            }
        })
        commit('setTeams', data);
        const sessionId = `team-${data.teamId}`
        const session = await state.im.session.getSession({ id: sessionId });
        if (session) {
            session['options'] = data;
            commit('setSessions', session);
        }
    },

    // 更新群头
    handleUpdateTeamPortrait({ state, commit }, { urls, tid, ownerAccountId }) {
        getUpdateTeamPortrait({ urls, tid, ownerAccountId });
    },

    // 更新自己在群里的信息
    async handleUpdateTeamMyMemberInfo({ state }, data) {
        // const bitConfigMask = muteTeam ? 1 : 0;
        const teamMember = await state.im.team.updateMyMemberInfo(data);
        return teamMember;
    },

    // 修改群信息
    async handleUpdateTeamInfo({ state, commit }, data) {
        const result = await state.im.handleUpdateTeamInfo(data);
        const arr = state.teams.map(item => {
            if (item.teamId == data.teamId) {
                return Object.assign(item, data);
            }
            return item;
        })
        commit('setTeams', arr)
        return result;
    },
    // 获取群成员
    async handleGeTeamMenber({ state, commit }, { teamId }) {
        const menbers = await state.im.handleGetTeamMenbers({ teamId });
        return menbers.sort((a, b) => {
            if (a.type == 'owner') {
                return -1;
            } else if (a.type == 'manager') {
                return 0;
            } else {
                return 1;
            }
        });
    },
    // 邀请群成员
    async handleInviteMember({ state, dispatch, rootState }, { accounts = [], teamId, receiveUsers }) {
        // await saveTeamInvite({receiveUsers,teamId});
        await state.im.team.addTeamMembers({
            accounts,
            teamId,
        });
        const memberList = await dispatch('handleGeTeamMenber', {
            teamId,
        });
        const avatars = [];
        let ownerAccountId = '';
        for (const item of memberList) {
            if (item.type == "owner") {
                ownerAccountId = item.account;
            }
            if (avatars.length < 9) {
                avatars.push(item.options.avatar);
            }
        }
        await dispatch('handleUpdateTeamPortrait', { urls: avatars, tid: teamId, ownerAccountId });
    },
    // 解散群
    async handleDissolution({ state, commit, dispatch }, { teamId }) {
        await state.im.handleDissolution({ teamId });
    },
    // 设置或移除管理员
    async handleSetTeamManager({ state, commit, dispatch }, { teamId, accounts = [], isManager }) {
        if (isManager) {
            await state.im.team.removeTeamManagers({ teamId, accounts });
        } else {
            await state.im.team.addTeamManagers({ teamId, accounts })
        }
        return await dispatch('handleGeTeamMenber', { teamId })
    },
    // 移除群成员
    async handleRemoveMembers({ state, dispatch }, { teamId, accounts = [] }) {
        await state.im.handleRemoveMembers({ teamId, accounts });
        const memberList = await dispatch('handleGeTeamMenber', {
            teamId,
        });
        const avatars = [];
        let ownerAccountId = '';
        for (const item of memberList) {
            if (item.type == "owner") {
                ownerAccountId = item.account;
            }
            if (avatars.length < 9) {
                avatars.push(item.options.avatar);
            }
        }
        await dispatch('handleUpdateTeamPortrait', { urls: avatars, tid: teamId, ownerAccountId });
    },
    // 退出群
    async handleSecedeTeam({ state, commit, dispatch }, { teamId }) {
        const memberList = await dispatch('handleGeTeamMenber', {
            teamId,
        });
        await state.im.handleLeaveTeam({ teamId });
        const avatars = [];
        let ownerAccountId = '';
        for (const item of memberList) {
            if (item.account == state.account) {
                continue;
            }
            if (item.type == "owner") {
                ownerAccountId = item.account;
            }
            if (avatars.length < 9) {
                avatars.push(item.options.avatar);
            }
        }
        await dispatch('handleUpdateTeamPortrait', { urls: avatars, tid: teamId, ownerAccountId });
    },
    // 转让群
    async handleTransferTeam({ state, commit }, { teamId, account }) {
        await state.im.handleAssignmentTeam({ teamId, leave: false, account });
        const team = await state.im.team.getTeamInfo({ teamId });
        commit('setTeams', team);
        return team;
    },

    // 获取 联系人/群聊 会话
    async handleCreateSession({ state, commit, dispatch }, { account, scene = 'p2p', options }) {
        commit('setMsgs', []); // 清除当前的聊天记录
        const id = scene + '-' + account;
        const session = await state.im.session.getSession({ id });
        const sessionItem = {
            id,
            to: account,
            type: 'NO_SYSTEM', //判断系统消息类型
            scene,
            options,
        }
        if (scene == 'p2p') {
            for (const key in state.systemAccounts) { //检查当前消息是否是系统消息
                if (sessionItem.to == state.systemAccounts[key]) {
                    sessionItem.type = key;
                    break;
                }
            }
            if (sessionItem.type == 'NO_SYSTEM') {
                const userData = await getInfoByAccountId({ imAccountId: account });
                sessionItem.options.userId = userData.data.userId
            }
        }
        commit('setScene', sessionItem.scene);
        commit('setSessionItem', sessionItem);
        if (session) {
            sessionItem.msgReceiptTime = session.msgReceiptTime;
            const msgs = await dispatch('handleGetHistoryMsg', {
                scene: sessionItem.scene,
                to: sessionItem.to,
                limit: 20,
            })
            if (session.unread > 0) {
                await dispatch('handleSetMessages', { msgs })
                await dispatch('handleResetSessionUnread', session)
            } else {
                await dispatch('handleSetMessages', { msgs })
            }
        }

    },
    // 设置聊天记录
    // msgs: 聊天消息
    async handleSetMessages({ state, commit, dispatch }, { msgs }) {
        if (!Array.isArray(msgs)) { msgs = [msgs]; }
        if (msgs.length == 0) { return }
        const msgData = state.msgs || [];
        const sessionItem = state.sessionItem;
        if (sessionItem) {
            const data = [];
            msgs.forEach((item) => {
                if (sessionItem.id == item.sessionId) {
                    data.push({
                        options: sessionItem.options,
                        ...item
                    })
                }
            });
            const mData = await state.im.mergeObjArray(msgData, data, { keyPath: 'idClient', sortPath: 'time' });
            await commit('setMsgs', mData);
        }
    },
    // 加载更多消息
    async handleLoadMessages({ state, dispatch }) {
        const sessionItem = state.sessionItem;
        const lastMsg = state.msgs[0];
        const msgs = await state.im.msgLog.getHistoryMsgs({
            asc: true,
            limit: 20,
            endTime: lastMsg.time,
            lastMsgId: lastMsg?.idServer || '',
            reverse: false,
            scene: sessionItem.scene,
            to: sessionItem.to,
        });
        dispatch('handleSetMessages', { msgs });
        return msgs;
    },
    handleSetRelations({ state, commit }, { blackList, muteList }) {
        commit('setMuteList', muteList)
        commit('setBlackList', blackList)
    },
    // 设置消息免打扰
    async handleSetDisremind({ state, commit, dispatch }, { account, scene, disremind }) {
        if (scene == 'p2p') {
            await state.im.user.setMute({
                account,
                isAdd: disremind
            })
            await state.im.user.getMuteList();
        } else {
            const bitConfigMask = disremind ? 1 : 0;
            await dispatch('handleUpdateTeamMyMemberInfo', { teamId: account, bitConfigMask })
        }
    },
    // 发送文本消息
    handleSendText({ state, dispatch }, body) {
        return new Promise(async (resolve, reject) => {
            const scene = state.scene;
            const to = state.sessionItem.to;
            const lastMsgUpdatetime = state.msgs.length > 0 ? state.msgs[state.msgs.length - 1].time : undefined;
            const options = {
                to,
                scene,
                body: JSON.stringify(body),
                ext: JSON.stringify({ lastMsgUpdatetime })
            }
            options.onSendBefore = async (msg) => {
                // console.log(m)
                await dispatch('handleSetMessages', { msgs: msg });
                resolve(msg)
            }
            const msg = await state.im.handleSendMsg('text', options);
            await dispatch('handleSetMessages', { msgs: msg });
        })
    },
    // 发送tip消息
    async handleSendTip({ state, dispatch }, body) {
        const to = state.sessionItem.to;
        const scene = state.sessionItem.scene;
        const resultmsg = await state.im.handleSendMsg('tip', { scene, to, body: JSON.stringify(body) });
        await dispatch('handleSetMessages', { msgs: resultmsg });
    },
    // 发送文件消息
    async handleSendFile({ state, commit, dispatch }, { type, file }) {
        const to = state.sessionItem.to;
        const scene = state.sessionItem.scene;
        const time = new Date().getTime();
        const uploadFile = {
            objectName: '',
            fileName: file.name,
            progress: 0,
            sessionId: `${scene}-${to}`,
            time
        }
        const options = {
            to,
            file,
            scene,
            progress: 0,
            onSendBefore: async (msg) => {
                // console.log('消息发送之前',msg)
                await dispatch('handleSetMessages', { msgs: msg });
            },
            onUploadStart: async (task) => { //上传开始
                // console.log('Upload start!', task);
                uploadFile.objectName = task.param.objectName;
                commit('setUploadFiles', uploadFile)
            },
            onUploadProgress: async (progress) => { //上传进度
                // console.log('Uploading!', progress);
                uploadFile.progress = parseInt(progress * 100);
                commit('setUploadFiles', uploadFile);
            },
            onUploadDone: async (file) => { //上传完成
                // console.log('Upload done!', file);
                commit('delUploadFiles', uploadFile)
            }
        }
        const msg = await state.im.handleSendMsg(type, options);
        await dispatch('handleSetMessages', { msgs: msg });
    },
    // 获取历史消息
    async handleGetHistoryMsg({ state, commit }, data) {
        const msgs = await state.im.msgLog.getHistoryMsgs(data);
        const list = await state.im.getMsgOptions(msgs);
        return list
    },
    // 撤回消息
    async handleRecallMsg({ state, commit, dispatch }, msg) {
        try {
            // 撤回消息
            const result = await state.im.msg.recallMsg({ "ps": "recall msg", "msg": msg });
            // 发送tip消息
            const recallMsg = {
                content: '撤回一条消息',
                type: 'recall'
            }
            await commit('delMsg', result);
            await dispatch('handleSendTip', recallMsg)
        } catch (err) {
            console.log(err)
        }
    },
    // 删除某条消息
    async handleDeleteMsg({ state, commit }, msgs) {
        if (!Array.isArray(msgs)) { msgs = [msgs]; }
        const sessionId = msgs[0]?.sessionId
        await state.im.msg.deleteSelfMsgs({ msgs })
        commit("delMsg", msgs)
        const session = await state.im.session.getSession({ id: sessionId });
        const ms = state.msgs;
        if (!session.lastMsg) {
            if (ms.length) {
                session.lastMsg = ms[ms.length - 1];
            }
        }
        commit('setSessions', session)
    },
    // 会话置顶
    async handleSettopSession({ state, commit }, { id, stickTopInfo }) {
        if (stickTopInfo && stickTopInfo.isStickOnTop) {
            const session = await state.im.session.deleteStickTopSession({ id });
            commit('setSessions', session)
        } else {
            const session = await state.im.session.addStickTopSession({ id });
            commit('setSessions', session)
        }
    },
    // 删除会话
    async handleDeleteSession({ state, commit }, { id }) {
        await state.im.session.deleteSession({
            id,
            isSyncToServer: true
        })
        commit('delSessions', id);
    },
    // 一键已读
    async handleResetAllSessionUnread({ state }) {
        await state.im.session.resetAllSessionsUnreadCount();
        state.sessions.forEach(async (session) => {
            if (session.unread > 0 && session.lastMsg) {
                if (session.scene == 'p2p') {
                    await state.im.msg.sendMsgReceipt({
                        msg: session.lastMsg
                    })
                } else {
                    // await state.im.msg.sendTeamMsgReceipt({
                    //     teamMsgReceptions: session.lastMsg
                    // })
                }
            }
        })
    },
    // 会话已读
    async handleResetSessionUnread({ state }, session) {
        console.log(session)
        if (session.lastMsg) {
            if (session.scene == 'p2p') {
                await state.im.msg.sendMsgReceipt({
                    msg: session.lastMsg
                })
                console.log('已发送已读回执')
            } else {
                // await state.im.msg.sendTeamMsgReceipt({
                //     teamMsgReceptions: session.lastMsg
                // })
            }
        }

        await state.im.session.resetSessionUnreadCount({ id: session.id });
    },
    // 监听更新会话
    async onUpdateSession({ state, commit, dispatch }, session) {
        await state.im.getCardFromServer(session, { keyName: 'to', scene: 'p2p' }).then(res => {
            if (res.length) {
                session = res[0]
            }
        })
        await state.im.getCardFromServer(session, { keyName: 'to', scene: 'team' }).then(res => {
            if (res.length) {
                session = res[0]
            }
        })
        if (state.sessionItem?.id == session.id) {
            if (session.unread > 0) {
                dispatch('handleResetSessionUnread', session);
            }
            const sessionItem = state.sessionItem;
            sessionItem['msgReceiptTime'] = session?.msgReceiptTime || 0;
            commit('setSessionItem', sessionItem)
        }
        commit('setSessions', session)
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}

