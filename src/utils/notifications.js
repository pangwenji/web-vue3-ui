import {ElNotification} from 'element-plus';
import router from "@/router"
import store from '@/store'
import {childrenItem} from "../plugins/sessionBox/components/templates/util";

let notificationNumber = 0;

const notification = ({title, template, type, onClick}) => {
    notificationNumber += 1;
    const data = ElNotification({
        title,
        dangerouslyUseHTMLString: true,
        message: `<p style="word-break: break-all;">${template}</p>`,
        type,
        customClass: 'ElNotification-offset-60',
        duration: 3000,
        position: 'top-right',
        onClick,
        // onClose() {
        //     notificationNumber -= 1
        // },
        // offset: notificationNumber * 60,
    })
}
// 项目弹窗
export const ElNotification_project = (mataData, {noticeType}) => {
    const title = `项目·${mataData.project.name}`
    if (noticeType == 1) { //@通知
        notification({
            title,
            template: `<div><span style="color: #3468FE; ">${mataData.user.nickName}</span>在<span style="color: #3468FE; ">${mataData.file.filename}</span>中@你</div>`,
            type: 'success',
            onClick() {
                router.push({
                    path: '/file', query: {
                        id: mataData.file.fileId,
                        projectId: mataData.project.id,
                        fileCat: mataData.file.fileCat,
                    }
                })
            }
        })
    } else if (noticeType == 2) { // 修改审阅状态
        notification({
            title,
            template: `<div><span style="color: #3468FE; ">${mataData.user.nickName}</span>修改了
                        <span style="color: #3468FE; ">${mataData.file.filename}</span>的审阅状态为<span style="color: #3468FE; ">${mataData.file.fileStatusName}</span>
                        </div>`,
            type: 'success',
            onClick() {
                router.push({
                    path: '/file', query: {
                        id: mataData.file.fileId,
                        projectId: mataData.project.id,
                        fileCat: mataData.file.fileCat,
                    }
                })
            }
        })
    } else if (noticeType == 3) {//版本迭代
        notification({
            title,
            template: `<div><span style="color: #3468FE; ">${mataData.user.nickName}</span>迭代了
                        <span style="color: #3468FE; ">${mataData.file.filename}</span>的版本为v${mataData.file.version}</div>`,
            type: 'success',
            onClick() {
                router.push({
                    path: '/file', query: {
                        id: mataData.file.fileId,
                        projectId: mataData.project.id,
                        fileCat: mataData.file.fileCat,
                    }
                })
            }
        })
    } else if (noticeType == 4) {//添加评论
        notification({
            title,
            template: `<div> <span style="color: #3468FE; ">${mataData.user.nickName}</span>在<span style="color: #3468FE; ">${mataData.file.filename}</span>中添加了评论</div>`,
            type: 'success',
            onClick() {
                router.push({
                    path: '/file', query: {
                        id: mataData.file.fileId,
                        projectId: mataData.project.id,
                        fileCat: mataData.file.fileCat,
                    }
                })
            }
        })
    } else if (noticeType == 5) {//邀请成员
        notification({
            title,
            template: `<div> <span style="color: #3468FE; ">${mataData.joinUser.nickName}</span>加入了项目
                        <span style="color: #3468FE; ">${mataData.project.name}</span></div>`,
            type: 'success',
            onClick() {
                router.push({path: `/project/index/${mataData.project.id}/file`})
            }
        })
    } else if (noticeType == 6) {//项目转让
        notification({
            title,
            template: `<div> <span style="color: #3468FE; ">${mataData.fromUser.nickName}</span>转让了
                        <span style="color: #3468FE; ">${mataData.project.name}</span>给
                        <span style="color: #3468FE; ">${mataData.toUser.nickName}</span></div>`,
            type: 'success',
            onClick() {
                router.push({path: `/project/index/${mataData.project.id}/file`})
            }
        })
    } else if (noticeType == 7) {//分享
        notification({
            title,
            template: `<div> <span style="color: #3468FE; ">${mataData.user.nickName}</span>分享了<span style="color: #3468FE; ">${mataData.share?.shareName} </div>`,
            type: 'success',
            onClick() {
                router.push({
                    path: '/file', query: {
                        id: mataData.file.list[0].id,
                        projectId: mataData.project.id,
                        fileCat: mataData.file.list[0].fileCat,
                    }
                })
            }
        })
    } else if (noticeType == 8) { // 发起收集
        notification({
            title,
            template: `<div> <span style="color: #3468FE; ">${mataData.user.nickName}</span>发起了收集<span style="color: #3468FE; ">${mataData.collect.name}</span> </div>`,
            type: 'success',
            onClick() {
                router.push({path: `/project/index/${mataData.project.id}/file?parent=${mataData.collect.id}`})
            }
        })
    } else if (noticeType == 12) { //项目完结/归档
        notification({
            title,
            template: `<div> <span style="color: #3468FE; ">${mataData.user.nickName}</span>归档了项目<span style="color: #3468FE; ">${mataData.project.name}</span> </div> `,
            type: 'success',
            onClick() {
                router.push({path: `/project/index/${mataData.project.id}/file`})
            }
        })
    }
}
// 用工弹窗
export const ElNotification_worker = (mataData, attach) => {
    let noticeType = attach.noticeType;
    let notificationType = 'success';
    let notificationMesg = attach.content;
    let notificationTitle = attach.title;
    const senderNickName = mataData.senderNickName
    if (noticeType == 3) { //工种审核成功或者失败
        notificationMesg = '工种审核通过';
        if (mataData.status == 2) {
            notificationMesg = '工种审核失败';
            notificationType = 'error'
        }
    } else if (noticeType == 4) { //招募审核
        notificationMesg = '招募审核通过';
        if (mataData.status == 2) {
            notificationMesg = '招募审核失败';
            notificationType = 'error'
        }
    } else if (noticeType == 6) { //邀请结果通知
        notificationMesg = `${senderNickName}想邀请你一起合作。`;
    } else if (noticeType == 7) { //聊一聊通知
        notificationMesg = `"${senderNickName}"想和您聊一聊。`;
    } else if (noticeType == 8) { //催一催通知
        notificationMesg = `${mataData.senderNickName}催您加快进度啦~`;
    } else if (noticeType == 9) { //提醒验收通知
        notificationMesg = `${mataData.senderNickName}提醒您验收啦~`;
    } else if (noticeType == 10) { //订单通知
        if (mataData.fileSystem == 'add') {
            notificationMesg = '订单有了新进度。';
        } else {
            if (mataData.order) {
                const status = mataData.status;
                if (status == 0) {
                    notificationMesg = mataData.toUser == 0 ? `${senderNickName}待接单。` : '待接单。';
                } else if (status == 1) {
                    notificationMesg = mataData.toUser == 0 ? `${senderNickName}已接单。` : `已成功接单“${mataData.order.title}”。`;
                } else if (status == 2) {
                    notificationMesg = mataData.toUser == 0 ? `${senderNickName}已接单。` : `已拒绝接单“${mataData.order.title}”。`;
                } else if (status == 3) {
                    notificationMesg = mataData.toUser == 0 ? `${senderNickName}已提交最终验收，请于72小时内确认验收。` : `已交付订单“${mataData.order.title}”。`;
                } else if (status == 4) {
                    notificationMesg = mataData.toUser == 0 ? `订单“${mataData.order.title}”已关闭。` : `雇主关闭订单“${mataData.order.title}”`;
                } else if (status == 5) {
                    notificationMesg = mataData.toUser == 0 ? `订单“${mataData.order.title}”退款中。` : `订单“${mataData.order.title}”雇主申请退款。`;
                } else if (status == 6) {
                    notificationMesg = `${senderNickName}同意退款。`;
                } else if (status == 7) {
                    notificationMesg = mataData.toUser == 0 ? `${senderNickName}拒绝退款。` : '拒绝退款。';
                } else if (status == 8) {
                    notificationMesg = mataData.toUser == 0 ? `已取消退款。` : '雇主取消退款。';
                } else if (status == 9) {
                    notificationMesg = `订单“${mataData.order.title}“已完成。`;
                } else if (status == 10) {
                    notificationMesg = `订单”${mataData.order.title}”已评价。`;
                } else if (status == 11) {
                    notificationMesg = `订单”${mataData.order.title}”中”${senderNickName}”申请平台介入。`;
                }
            }
        }
    } else if (noticeType == 14) { //报名通知
        const recruitTitle = mataData.recruit?.title
        notificationMesg = `${mataData.senderNickName}已报名您的招募“${recruitTitle}”`;
    } else if (noticeType == 15) { //招募选定
        notificationMesg = `恭喜您，在“${mataData.order.title}”中被选定，请及时接受订单。`;
    } else if (noticeType == 16) {  //取消选定
        notificationMesg = `抱歉，您报名的“${mataData.order.title}”被雇主取消选定，请继续加油~`;
    } else if (noticeType == 17) { //未被选定
        notificationMesg = `抱歉，您在“${mataData.order.title}”中未被选定，请继续加油~`;
    } else if (noticeType == 18) {//评价
        notificationMesg = `${mataData.senderNickName}已给您做出评价，赶紧前往查看吧~`;
    } else if (noticeType == 19) {//招募完成
        notificationMesg = `“${mataData.recruit.title}”已完成招募。`;
    } else if (noticeType == 20) {//重新开始招募
        notificationMesg = `“${mataData.recruit.title}”已重新开启招募。`;
    } else if (noticeType == 21) { //招募过期
        notificationMesg = `“${mataData.recruit.title}”已过报名截止日期，请重新调整。`;
    } else if (noticeType == 30) { //关注
        notificationMesg = `“${mataData.senderNickName}”关注了您。`;
    }
    notification({
        title: notificationTitle,
        template: notificationMesg,
        type: notificationType,
    })
}
// 支付弹窗
export const ElNotification_pay = (mataData, attach) => {
    const noticeType = attach.noticeType;
    const notificationType = 'success'
    let notificationMesg = attach.content;
    let notificationTitle = mataData.title;
    if (noticeType == 1) { //同钱收入
        notificationMesg = `收入${mataData.amount.toFixed(2)}，当前可用余额为${mataData.balance?.toFixed(2)}。`
    } else if (noticeType == 2) { //同钱支出
        notificationMesg = `支出${mataData.amount?.toFixed(2)}，剩余可用余额为${mataData.balance?.toFixed(2)}。`
    } else if (noticeType == 3) {//保证金
        notificationMesg = `已退回保证金${mataData.amount.toFixed(2)}。`
    } else if (noticeType == 4) {//托管
        notificationTitle = '托管预算金通知';
        notificationMesg = `已完成托管${mataData.amount.toFixed(2)}。`
    } else {
        notificationTitle = attach.title;
    }
    notification({
        title: notificationTitle,
        template: notificationMesg,
        type: notificationType,
    })
}
// 用户会话弹窗
export const ElNotification_session = ({options, sessionId}) => {
    const sessionItem = store.state.IM.sessionItem;
    if (sessionItem && sessionItem.id == sessionId) {
        return
    }
    notification({
        title: '会话消息',
        template: `${options.name}向你发来消息`,
        type: 'success',
    })
}
//系统通知弹窗
export const ElNotification_system = (mataData, attach) => {
    const noticeType = attach.noticeType;
    const notificationType = 'success'
    let notificationMesg = attach.content;
    const notificationTitle = attach.title;
    if (noticeType == 13) { //发票申请
        notificationMesg = `您的开票申请状态有变更，请及时查看。`;
    } else if (noticeType == 2) { //会员开通成功
        notificationMesg = `您已成功开通${mataData.memberType}会员，到期时间为${mataData.expireTime}`;
    } else if (noticeType == 3) {//会员到期
        notificationMesg = `您的【${mataData.memberType}会员已过期，部分功能已限制使用，请及时续费，以免影响正常使用。`
    } else if (noticeType == 4) {//会员到期警告
        notificationMesg = `您的【${mataData.memberType}】会员将于【${mataData.expireTime}】过期，请及时续费，以免影响正常使用。`
    } else if (noticeType == 5) {//邀请注册个人版
        notificationMesg = `<div><span style="color: #3468FE; ">${mataData.nickName}</span>已激活为个人版用户</div>`;
    } else if (noticeType == 6) {
        notificationMesg = `<div><span style="color: #3468FE; ">${mataData.nickName}</span>已注册为体验版用户</div>`;
    }
    notification({
        title: notificationTitle,
        template: notificationMesg,
        type: notificationType,
    })
}
//工具通知弹窗
export const ElNotification_tool = (mataData, attach) => {
    const msg = mataData.status == 'success' ? `工具“${mataData.tooldetail.name}”处理成功` : `工具“${mataData.tooldetail.name}”处理失败`
    const type = mataData.status == 'success' ? 'success' : 'error'
    notification({
        title: attach.title,
        template: msg,
        type,
    })
}
