import NIMSDK from "nim-web-sdk-ng"
import store from "@/store";
import router from "@/router"
import { ElMessage, ElLoading, ElMessageBox, ElNotification } from 'element-plus';
import { unMounted } from '@/plugins/sessionBox'
import { openLogin } from '@/plugins/loginDialog'
import {
	ElNotification_project,
	ElNotification_session,
	ElNotification_system,
	ElNotification_worker,
	ElNotification_pay,
	ElNotification_tool,
} from './notifications.js'


// 若传入匿名函数则会被覆盖
export const IM_EVENT_LISTERNER = Object.create(null); //IM监听事件

Object.defineProperty(IM_EVENT_LISTERNER, 'events', {
	writable: false,
	configurable: true,
	value: {}
})

Object.defineProperty(IM_EVENT_LISTERNER, 'addEventListenerIM', {
	writable: false,
	configurable: true,
	value(eventName, eventFun) { //添加监听事件
		if (eventFun.name) {
			if (typeof eventName == 'string' && typeof eventFun === 'function') {
				this.events[eventName] = this.events[eventName] || [];
				this.events[eventName].push(eventFun);
			}
		} else {
			this.events['_' + eventName] = eventFun;
		}
	}
})
Object.defineProperty(IM_EVENT_LISTERNER, 'stickEventListenerIM', {
	writable: false,
	configurable: true,
	value(eventName, obj, data) { //执行监听事件
		const eventFuns = this.events[eventName];
		const _eventFun = this.events['_' + eventName];
		if (eventFuns && eventFuns.length > 0) {
			eventFuns.forEach((item) => {
				item.call(obj, data);
			})
		}
		if (_eventFun && typeof _eventFun === 'function') {
			_eventFun.call(obj, data);
		}
	}
})

Object.defineProperty(IM_EVENT_LISTERNER, 'removeEventListenerIM', {
	writable: false,
	configurable: true,
	value(eventName, eventFun) { //删除监听事件
		const eventFuns = this.events[eventName];
		if (eventFun.name) {
			if (eventFuns && eventFuns.length > 0) {
				const eventFunIndex = eventFuns.findIndex((item) => {
					return item === eventFun;
				})
				eventFuns.splice(eventFunIndex, 1);
			}
		} else {
			this.events['_' + eventName] = null;
		}

	}
})

let retryCount = 0; //重连次数
let reconnectLoading;
const serverConfig = {
	// chunkUploadHost: "",
	// NOS上传地址（分片）

	// commonUploadHost: "",
	// NOS上传地址（直传）

	// downloadHostList: [],
	// 收到哪些host地址，需要替换成downloadHost，例：收到nos.netease.com/{bucket}/{obj}

	// downloadUrl: "",
	// 接收到文件消息的替换模版

	// nosCdnEnable: false,
	// 6_26 下发的域名存在，并且 object 前缀匹对成功，那么强行替换

	// uploadReplaceFormat: ""
	// 发送文件消息的通配符地址，对端收到根据downloadUrl替换
}

// 同步选项
const syncOptions = {
	deleteSelfMsgs: true,
	// 是否同步单向删除信息，默认 true

	deleteSuperTeamMsg: true,
	// 是否同步超大群撤回消息离线和漫游通知，默认 true

	friendUsers: true,
	// 是否同步好友的用户名片。默认 true

	friends: true,
	// 是否同步好友列表。默认 true

	msgReceipts: true,
	// 是否同步已读回执。默认 true

	myInfo: true,
	// 是否同步用户信息。默认 true

	myTeamMembers: true,
	// 是否同步当前用户的所有群的群成员信息。默认 false

	offlineMsgs: true,
	// 是否同步离线消息和离线系统通知。默认 true

	recallMsg: true,
	// 是否同步撤回消息离线和漫游通知。默认 true

	relations: true,
	// 是否同步黑名单和静音列表。默认 true

	roamingMsgs: true,
	// 是否同步漫游消息。默认 true

	sessionAck: true,
	// 是否同步消息会话 ack，时间戳单位毫秒。默认 false

	// 会话 ACK 代表本账号在此会话里读过的最新消息的时间戳

	sessionHistoryMsgsDelete: true,
	// 是否同步会话历史消息的删除信息。默认 true

	stickTopSessions: true,
	// 是否同步置顶会话信息，默认 false

	superTeamRoamingMsgs: true,
	// 是否同步超大群漫游消息。默认 true

	superTeamSessionAck: false,
	// 是否同步超大群会话 ack 位置列表，默认 false

	superTeams: true,
	// 是否同步超大群信息，默认 true

	teams: true
	// 是否同步群列表。默认 true
}


class IM2 extends NIMSDK {
	userInfo = null //我的用户信息
	constructor({ appkey, account, token, authType = 0, debugLevel = "off", needReconnect = false, reconnectionAttempts = 10 }) {
		super({
			appkey,
			account,
			token,
			authType,
			debugLevel,
			needReconnect,
			reconnectionAttempts
		}, { serverConfig, syncOptions });
	}
	// 初始化
	async init() {
		try {
			this['on']('msg', this.onMsg);
			this['on']('teams', this.onTeams);
			this['on']('kicked', this.onKicked);
			this['on']('sysMsg', this.onSysMsg);
			this['on']('logined', this.onLogined);
			this['on']('syncdone', this.onSyncdone);
			this['on']('sessions', this.onSessions);
			this['on']('relations', this.onRelations);
			this['on']('syncSysMsgs', this.onSyncSysMsgs);
			this['on']('updateMuteList', this.onUpdateMuteList);

			//去群聊相关的监听
			this['on']('updateTeam', this.onUpdateTeam);
			this['on']('dismissTeam', this.onDismissTeam);
			this['on']('transferTeam', this.onTransferTeam);
			this['on']('addTeamMembers', this.onAddTeamMembers);
			this['on']('updateTeamMember', this.onUpdateTeamMember);
			this['on']('removeTeamMembers', this.onRemoveTeamMembers);
			this['on']('updateTeamManagers', this.onUpdateTeamManagers);

			// this['on']('friends', this.onFriends);
			this['on']('syncFriend', this.onSyncFriend);
			this['on']('updateSession', this.onUpdateSession);
			this['on']('willReconnect', this.onWillReconnect);
			// this['on']('syncMyNameCard', this.onSyncMyNameCard);
			await this.connect()
			this['on']('disconnect', this.onDisconnect);
			return Promise.resolve();
		} catch (err) {
			if (err) {
				const code = err.code;
				const msg = err.message;
				switch (code) {
					case 302:
						this.ErrorMsg("account或者token错误");
						break;
					// 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
					case 417:
						this.ErrorMsg("您已经在其它端登录了");
						break;
					// 被踢, 请提示错误后跳转到登录页面
					case 'kicked':
						this.ErrorMsg("您的账号已在其他地方登录了");
						break;
					default:
						this.ErrorMsg(msg);
						break;
				}
			} else {
				this.ErrorMsg("未知错误");
			}
			return Promise.reject(err);
		}
	}

	// 更新好友信息
	async handleUploadFriend({ account = "", alias = "", ext = "" }) {
		await this.friend.updateFriend({
			account,
			alias,
			ext,
		})
		const friend = {
			account,
			alias,
			ext
		}
		return friend
	}

	// 创建群
	async handleCreateTeam({ type = "advanced", name = '', intro = "简介", level = 200, avatar = 'string', accounts = [], announcement = "群公告", ext = "{}", ps = "您创建了一个高级群" }) {
		try {
			const team = await this.team.createTeam({
				type,
				name,
				avatar,
				accounts,
				intro,
				announcement,
				joinMode: 'noVerify',
				beInviteMode: 'noVerify',
				inviteMode: 'manager',
				updateTeamMode: 'manager',
				updateCustomMode: 'manager',
				level,
				ps,
				ext,
			});
			return team;
		} catch (err) {
			this.ErrorMsg(err.message);
			return Promise.reject(err)
		}
	}
	// 更新群信息
	async handleUpdateTeamInfo(data) {
		const result = await this.team.updateTeamInfo(data);
		return result
	}
	// 解散群
	async handleDissolution(data) {
		const result = await this.team.dismissTeam(data);
		return result
	}
	// 转让群
	async handleAssignmentTeam(data) {
		const result = await this.team.transferTeam(data);
		return result
	}
	// 移除成员
	async handleRemoveMembers(data) {
		const result = await this.team.removeTeamMembers(data);
		return result
	}
	// 退出群
	async handleLeaveTeam(data) {
		const result = await this.team.leaveTeam(data);
		return result
	}
	// 发送消息
	async handleSendMsg(type, options) {
		try {
			var msg;
			switch (type) {
				case 'text': 		//发送文本消息
					msg = await this.msg.sendTextMsg(options)
					break;
				case 'image':		//发送图片消息
					msg = await this.msg.sendImageMsg(options)
					break;
				case 'audio':		//发送音频消息
					msg = await this.msg.sendAudioMsg(options)
					break;
				case 'video':		//发送视频消息
					msg = await this.msg.sendVideoMsg(options)
					break;
				case 'file':		//发送文件消息
					msg = await this.msg.sendFileMsg(options)
					break;
				case 'location':	//发送地理位置信息
					msg = await this.msg.sendGeoLocationMsg(options)
					break;
				case 'tip':			//发送提醒消息
					msg = await this.msg.sendTipMsg(options)
					break;
				default:		//发送自定义消息
					msg = await this.msg.sendCustomMsg(options)
					break;
			}
			return Promise.resolve(msg);
		} catch (err) {
			return Promise.reject(err);
		}

	}

	// 监听开始重连 此时说明 SDK 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
	async onWillReconnect(res) {
		console.log("正在重连", res)
		// const retryCount = res.retryCount; //尝试重连的次数
		// const duration = res.duration; //距离下次重连的时间
		// this.loading && this.loading.close();
		// this.loading = ElLoading.service({
		// 	lock: true,
		// 	text: `连接已断开，正在尝试第(${retryCount})次重新连接`,
		// 	background: 'rgba(0, 0, 0, 0.7)',
		// })
	}
	// 初始化登录成功
	onLogined(res) {
		reconnectLoading && reconnectLoading.close();
		store.commit('IM/setStatus', 'success');
		retryCount = 0;
		reconnectLoading = null;
		console.log("IM初始化登录成功！");
		window.removeEventListener('online', this.onUpdateOnline);
		window.removeEventListener('offline', this.onUpdateOnline);

	}
	//监听被其他端踢下线
	onKicked() {
		store.commit('IM/setStatus', 'kicked');
		unMounted();
		ElMessageBox.confirm('您已在其他端登录，请重新登录连接。', '系统提示', {
			customClass: 'messageBox-custom-warning',
			confirmButtonText: '重新登录',
			cancelButtonText: '取消',
			showCancelButton: false,
			type: 'warning',
			showClose: true,
			center: true,
		}).then(() => {
			store.dispatch('LogOut').then(() => {
				openLogin({
					onSuccess: () => {
						location.reload()
					}
				});
				// router.push({ path: '/login' })
			})
		}).catch(() => { });
	}
	//监听连接断开
	onDisconnect(res) {
		console.log("连接已断开")
		if(store.state.IM.status == 'handleDisconnect'){
			return
		}
		store.commit('IM/setStatus', 'disconnect');
		retryCount += 1;
		if (navigator.onLine) {
			reconnectLoading = ElLoading.service({
				lock: true,
				text: `网络连接已断开，正在尝试第(${retryCount})次重新连接`,
				background: 'rgba(0, 0, 0, 0.7)',
			})
			store.dispatch('IM/handleInit')
		} else {
			window.addEventListener('online', this.onUpdateOnline);
			window.addEventListener('offline', this.onUpdateOnline);
			ElMessageBox.confirm('连接已断开，请检查网络配置', '系统提示', {
				customClass: 'messageBox-custom-warning',
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				showCancelButton: false,
				type: 'warning',
				showClose: true,
				center: true,
			}).then(() => { }).catch(() => { });
		}
		// ElMessageBox.confirm('连接已断开，请重新登录.', '系统提示', {
		// 	customClass: 'messageBox-custom-warning',
		// 	confirmButtonText: '重新登录',
		// 	cancelButtonText: '取消',
		// 	showCancelButton: false,
		// 	type: 'warning',
		// 	showClose: true,
		// 	center: true,
		// }).then(() => {
		// 	store.dispatch('LogOut').then(() => {
		// 		unMounted();
		// 		openLogin({onSuccess:()=>{
		// 			location.reload()
		// 		}});
		// 	})
		// }).catch(() => { });
	}
	// 监听网络状态
	onUpdateOnline() {
		console.log('检查网络状态')
		if (navigator.onLine) {
			reconnectLoading = ElLoading.service({
				lock: true,
				text: `网络已回复，正在尝试第(${retryCount})次重新连接`,
				background: 'rgba(0, 0, 0, 0.7)',
			})
			store.dispatch('IM/handleInit')
		};
	}
	//同步静音/黑名单列表
	onRelations({ muteList,blackList }) {
		store.dispatch('IM/handleSetRelations',{ muteList,blackList })
	}
	//同步群列表
	onTeams(teams) {
		console.log('teams', teams);
		store.commit("IM/setTeams", teams)
	}
	//监听用户消息
	async onMsg(msg) {
		console.log('用户消息', msg);
		const lastMsgs = await this.getMsgOptions([msg])
		const lastMsg = lastMsgs[0];
		store.dispatch("IM/handleSetMessages", {msgs:lastMsgs})
		const systemAccounts = store.state.IM.systemAccounts;
		if (lastMsg.scene == 'p2p') {
			const muteList = store.state.IM.muteList; // 静音列表
			const disremind = muteList.findIndex(item=>item.account == lastMsg.from && item.isMuted) > -1
			if (lastMsg.type == "custom") { //自定义消息
				const values = Object.entries(systemAccounts)
				for (const [key, value] of values) {
					if (lastMsg.from == value && lastMsg.status == 'unread') {
						const mataData = JSON.parse(lastMsg.attach.mataData);
						const noticeType = lastMsg.attach.noticeType;
						IM_EVENT_LISTERNER.stickEventListenerIM(key, this, { ...lastMsg.attach, sourceData: mataData });
						switch (key) {
							case 'PAY': //支付相关
								if (mataData.balance >= 0) {
									store.commit('SET_MONEY', mataData.balance.toFixed(2));
								}
								if(!disremind){
									ElNotification_pay(mataData, lastMsg.attach)
								}
								return
							case 'PROJECT': //项目相关
								if(!disremind){
									ElNotification_project(mataData, lastMsg.attach);
								}
								if (noticeType == 1) {
									const arr = [].concat(store.state.IM.aboutNotice)
									arr.unshift(lastMsg.attach);
									store.commit('IM/setAboutNotice', arr)
								}
								return;
							case 'WORKER': //用工相关
								if (noticeType == 99) {
									if (window.platformWin) {
										if (!window.platformWin[mataData.platformType].closed) {
											window.platformWin[mataData.platformType].close();
										}
									}
								}
								ElNotification_worker(mataData, lastMsg.attach)
								return;
							case 'SYSTEM': //系统相关
								if (noticeType == 2) {//开通会员成功
									mataData.state = 1;
									store.commit('SET_MEMBER', mataData);
								}
								if(!disremind){
									ElNotification_system(mataData, lastMsg.attach)
								}
								return;
							case 'TOOL': //工具相关
								if(!disremind){
									ElNotification_tool(mataData, lastMsg.attach)
								}
								return;
						}
					}
				}
			} else {
				if(!disremind){
					ElNotification_session(lastMsg)
				}
			}
		} else {
			const menbers = await this.team.getTeamMembers({
				accounts: [this.account],
				teamId: lastMsg.to,
			})
			const selfData = menbers[0];
			if(selfData && selfData.bitConfigMask !== 1){
				ElNotification_session(lastMsg)
			}
		}
	}
	// 监听系统消息,我的好友申请消息
	async onSysMsg(res) {
		console.log('系统通知', res)
		switch (res.type) {
			case 'customP2p': // 自定义点对点通知
				const noticeType = res.attach.noticeType;
				const mataData = JSON.parse(res.attach.mataData || '{}');
				IM_EVENT_LISTERNER.stickEventListenerIM('SYSTEM', this, { ...res.attach, sourceData: mataData });
				if (noticeType == 2) { //删除联系人
					await store.dispatch('IM/handleGetGroup', true);
					// await store.dispatch('handleDeleteSession',{id:`p2p-${res.from}`});
					if (store.state.IM.sessionItem?.to == res.from) {
						const sessionItem = Object.assign({}, store.state.IM.sessionItem);
						sessionItem.isContact = false;
						store.commit('setSessionItem', sessionItem)
					}
				} else if (noticeType == 7) { //素材封面解析
					const obj = JSON.parse(res.attach.mataData)
					store.commit('IM/addMaterialMataData', obj)
				}else if(noticeType == 9){
					console.log(mataData.tokenId , store.state.user.tokenId)
					if(mataData.tokenId != store.state.user.tokenId){
						return
					}
					unMounted();
					ElMessageBox.confirm('您的账号已在其他地方登录，如不是本人操作，请重新登录后及时修改密码。', '系统提示', {
						customClass: 'messageBox-custom-warning',
						confirmButtonText: '重新登录',
						cancelButtonText: '退出登录',
						type: 'warning',
						showClose: true,
						center: true,
					}).then(() => {
						store.dispatch('LogOut').then(() => {
							openLogin({
								onSuccess: () => {
									location.reload()
								}
							});
						})
					}).catch(() => {
						store.dispatch('LogOut').then(() => {
							router.push({ path: '/login' })
						})
					});
				}
				break;
			case 'teamInvite': //群邀请
				var account = res.from;
				var userData = await this.user.getUsersNameCardFromServer({ accounts: [account] });
				ElNotification({
					title: '群邀请',
					message: `“${userData[0].nick}”邀请你加入群聊`,
					type: 'success',
				})
				store.dispatch('IM/handleGetTeamInvite', true)
				break;
			case 'recallMsgTeam': //群撤回
				store.commit('IM/delMsg',res.recallMessageInfo)
				break;
			case 'recallMsgP2p': //会话撤回
				store.commit('IM/delMsg',res.recallMessageInfo)
				break;
			case 'friendRequest': //好友请求
				var account = res.from;
				var userData = await this.user.getUsersNameCardFromServer({ accounts: [account] });
				if (res.attach.type == 'applyFriend') { //好友申请
					ElNotification({
						title: '好友申请',
						message: `“${userData[0]?.nick}”申请加你为好友`,
						type: 'success',
					})
					await store.dispatch('IM/getFriendApplyList')
				}
				break;
		}
	}
	// 设置好友申请状态
	handleSetApplyState(friendApply, state) {
		friendApply.state = state
		store.commit('setFriendApplys', friendApply);
	}
	async handleGetTeamMenbers({ teamId, accounts = [] }) {
		const menbers = await this.team.getTeamMembers({ accounts, teamId });
		const data = await this.getCardFromServer(menbers, { scene: 'other' })
		return data;
	}
	// 其他端操作过好友相关的信息后，会下发多端同步好友通知，会触发 syncFriend 事件
	onSyncFriend(friend) {
		store.commit("IM/setFriends", friend);
	}

	// 同步阶段会收到服务器下发的好友信息，触发 friends 事件
	onFriends(friends) {
		store.commit("IM/setFriends", friends);
	}

	// 同步我的卡片资料
	onSyncMyNameCard(user) {
		console.log("我的用户信息", user)
		// this.userInfo = user;
		// store.commit("setUserInfo", user);
	}

	// 同步会话列表
	async onSessions(sessions) {
		console.log(sessions)
		await this.getCardFromServer(sessions, { keyName: 'to', scene: 'p2p' }).then(res => {
			if (res.length) {
				store.commit('IM/setSessions', res)
			}
		})
		await this.getCardFromServer(sessions, { keyName: 'to', scene: 'team' }).then(res => {
			if (res.length) {
				store.commit('IM/setSessions', res)
			}
		})
	}
	
	onSyncSysMsgs(e){
		console.log('收到离线消息',e)
	}

	// 收到了多端同步创建群的情况
	onCreateTeam(team) {
		console.log('创建群', team);
		store.commit('IM/setTeams', team);
	}
	// 触发了解散群
	async onDismissTeam(e) {
		console.log('解散群', e);
		store.commit('IM/delTeams', e.teamId);
		if (store.state.IM.sessionItem?.to == e.teamId) {
			store.state.IM.sessionItem.options.valid = false;
			store.commit('IM/setSessionItem', Object.assign({}, store.state.IM.sessionItem));
		}
	}
	// 群成员的更新
	onAddTeamMembers({ accounts, members, team }) {
		console.log('群成员的更新', team);
		if (members.length > 9) {
			return
		}
		// const urls = members.filter((item, index) => index < 9).map(item => item.avatar);
		// const tid = team.teamId;
		// const ownerAccountId = team.owner;
		team.validToCurrentUser = true;
		store.commit('IM/setTeams', team);
		// store.dispatch('IM/handleUpdateTeamPortrait', { urls, tid, ownerAccountId });
	}
	// 收到群的更新信息
	onUpdateTeam(e) {
		console.log('群信息更新', e);
		store.dispatch('IM/handleOnUpdateTeam', e);
	}
	// 收到了群管理员的更新
	onUpdateTeamManagers(e) {
		console.log('群管理员更新', e);
	}
	// 收到成员离群例如成员 A 调用了 leaveTeam 离群，其他成员会收到这个事件。
	onRemoveTeamMembers({ accounts, team }) {
		if (accounts.indexOf(this.account) == -1) {
			store.commit('IM/setTeams', team);
		} else {
			store.commit('IM/delTeams', team.teamId);
		}
	}
	// 收到了多端同步来更新群成员的情况
	onUpdateTeamMember(e) {
		console.log('群成员信息更新', e);
		const sessions = store.state.IM.sessions;
		for(const item of sessions){
			if(item.scene == 'team' && item.to == e.teamId){
				store.dispatch('IM/onUpdateSession',item);
				break;
			}
		}
	}
	// 收到了转让群
	onTransferTeam({ from, team, to }) {
		console.log('群转让', { from, team, to });
		store.commit('IM/setTeams', team);
	}
	// 静音列表更新通知
	onUpdateMuteList(e) {
		console.log('静音列表更新', e);
	}

	// 会话更新的回调
	async onUpdateSession(session) {
		console.log('会话更新', session)
		const { lastMsg, scene, id } = session;
		if (!lastMsg) { return }
		if (scene == 'p2p') {
			
		} else if (scene == 'team') {
			if (lastMsg.type == 'notification') {
				if (lastMsg.flow == 'out' && lastMsg.attach.type == 'leaveTeam') {
					await store.dispatch('IM/handleDeleteSession', { id })
					// }else if(lastMsg.flow == 'in' && lastMsg.attach.type == 'removeTeamMembers'){

						// await store.dispatch('IM/handleDeleteSession',{id})
						return
				} else {
					store.dispatch('IM/handleSetMessages', {msgs:lastMsg});
				}
			} else if (lastMsg.status == 'sendFailed') {
				store.dispatch('IM/handleSetMessages', {msgs:lastMsg});
			}
		}
		await store.dispatch('IM/onUpdateSession', session);
	}
	// 获取消息发送者的信息
	async getMsgOptions(msgs) {
		const obj = {};
		for (const item of msgs) {
			if (!item.options) {
				obj[item.from] = item;
			}
		}
		const ids = Object.keys(obj);
		const users = await this.user.getUsersNameCardFromServer({ accounts: ids });
		return msgs.map(item => {
			const index = ids.indexOf(item.from);
			if (index > -1) {
				const { avatar, nick } = users[index]
				item.options = {
					avatar,
					name: nick
				}
			}
			return item;
		})
	}
	// 获取会话卡片信信息，并插入到数组每一项的对象中，返回新的数组
	/**
	 * @param {Array} data 数据数组
	 *
	 * **/
	async getCardFromServer(data, { extname = 'options', keyName = 'account', scene = 'other' }) {
		const that = this;
		if (!Array.isArray(data)) { data = [data] }
		const obj = {};
		for (var item of data) {
			if (scene == 'other') {
				obj[item[keyName]] = item;
			} else {
				if (item.scene == scene) {
					obj[item[keyName]] = item;
				}
			}
		}
		const ids = Object.keys(obj);
		if (ids.length == 0) {
			return [];
		}
		if (scene == 'p2p' || scene == 'other') {
			const users = await this.user.getUsersNameCardFromServer({ accounts: ids });
			return users.map(item => {
				const { avatar, nick } = item
				obj[item.account][extname] = { avatar, name: nick };
				return obj[item.account]
			})
		} else if (scene == 'team') {
			const { teams } = await this.team.getTeamsById({ teamIds: ids });
			// const members = await this.team.getTeamMembers({ teamIds: ids });
			const teamList = [];
			for(const item of teams){
				const menbers = await that.team.getTeamMembers({
					accounts: [that.account],
					teamId: item.teamId
				})
				const selfData = menbers[0] || null;
				obj[item.teamId]['selfData'] = selfData;
				item.disremind = selfData?.bitConfigMask == 1;
				obj[item.teamId][extname] = item;
				teamList.push(obj[item.teamId]);

			}
			return teamList
		} else {
			return []
		}
	}

	//监听同步完成
	onSyncdone(res) {
		console.log("同步完成")
	}

	// 错误消息
	ErrorMsg(message) {
		ElMessage.error({
			message,
			grouping: true,
			showClose: true,
		})
	}
	//合并数组并返回新数组
	mergeObjArray(...args) {
		let obj = {};
		let length = args.length;
		if (length == 0) {
			return [];
		}
		let lastArgs = args[length - 1];
		let keyPath = 'id'; //去重字段
		let sortPath = null; // 排序
		let desc = false;	//是否降序
		if (!Array.isArray(lastArgs)) {
			desc = lastArgs.desc;
			keyPath = lastArgs.keyPath;
			sortPath = lastArgs.sortPath;
			length = length - 1;
		}
		for (var i = 0; i < length; i++) {
			const datas = args[i];
			if (Array.isArray(datas)) {
				datas.forEach(item => {
					if (typeof item == 'object' && item) {
						if (item[keyPath]) {
							if (obj[item[keyPath]]) {
								obj[item[keyPath]] = Object.assign(obj[item[keyPath]], item);
							} else {
								obj[item[keyPath]] = item;
							}
						}
					}
				})
			} else {
				if (typeof datas == 'object' && datas) {
					if (datas[keyPath]) {
						if (obj[datas[keyPath]]) {
							obj[datas[keyPath]] = Object.assign(obj[datas[keyPath]], datas);
						} else {
							obj[datas[keyPath]] = datas;
						}
					}
				}
			}
		}
		let array = Object.values(obj);
		if (sortPath) {
			array.sort(((a, b) => {
				if (a[sortPath] < b[sortPath]) {
					return desc ? 1 : -1;
				} else if (a[sortPath] > b[sortPath]) {
					return desc ? -1 : 1;
				} else {
					return 0
				}
			}))
		}
		return array;
	}
}

export default IM2


