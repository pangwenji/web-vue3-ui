import { h } from 'vue';
import Card from '../Card.vue'
import router from '@/router'
import { childrenItem, formatDate } from '../util';
import { openDialog } from '../../../index'
export default function ( attach ,mataData) {
    const title = attach.title;
    const content = attach.content;
    const noticeType = attach.noticeType;
    if (noticeType == 3) { //工种审核通知
        const statusName = mataData.status == 1 ? '审核通过' : '审核失败';
        const children = [
            childrenItem('工种类型', mataData.info?.categoryTitle),
            childrenItem('审核结果', statusName),
            // childrenItem('审核时间', formatDate(mataData.info?.updateTime)),
            childrenItem('备注信息', mataData.info?.msg || '-')
        ]
        const onClickFooter = ()=>{
            router.push({ path: '/workspace/admin/skill' })
        }
        return h(Card, { title , onClickFooter }, ()=> h('div', {} , children) );
    } else if (noticeType == 4) { //招募审核
        const statusName = mataData.status == 1 ? '审核通过' : '审核失败';
        const children = [
            childrenItem('招募名称', mataData.info?.title),
            childrenItem('审核结果', statusName),
            // childrenItem('审核时间', formatDate(mataData.info?.updateTime)),
            childrenItem('备注信息', mataData.info?.reason)
        ]
        const onClickFooter = ()=>{
            if (mataData.status == 1) {
                router.push({ path: `/workspace/admin/recruit_console/${mataData.info?.id}` });
            } else {
                router.push({ path: '/workspace/admin/recruit' });
            }
        }
        return h(Card, { title, onClickFooter }, ()=> h('div', {} , children));
    } else if (noticeType == 6) { //邀请合作
        const children = [
            childrenItem('雇主昵称', mataData.senderNickName || '-'),
            childrenItem('招募名称', mataData.recruitInfo?.title || '-'),
            childrenItem('需求备注', mataData.leaveMessage || '-'),
        ]
        const onClickFooter = ()=>{
            if (mataData.recruitInfo) {
                router.push({ path: `/workspace/recruit/${mataData.recruitInfo.id}`, query: { t: mataData.recruitInfo.createTime, vid: mataData.recruitInviteId } });
            } else {
                const userId = mataData.senderUserId;
                openDialog({userId})
            }
        }
        return h(Card, { title, onClickFooter },()=> h('div', {} , children) );
    } else if (noticeType == 7) { //聊一聊
        const children = [
            h('span', { style: "color: #3468FE;" }, mataData.senderNickName),
            h('span', {}, '想跟你聊一聊，点击查看详情即可进行聊天。'),
        ]
        const onClickFooter = ()=>{
            const userId = mataData.senderUserId;
            openDialog({userId})
        }
        return h(Card, { title, onClickFooter },()=> h('div', {} , children) );
    } else if (noticeType == 8) {  // 催一催
        const children = [
            h('span', { style: "color: #3468FE;" }, mataData.senderNickName),
            h('span', {}, '催您加快制作进度啦~'),
        ]
        const onClickFooter = ()=>{
            router.push({ path: `/workspace/admin/order_detail/${mataData.order?.orderNo}` });
        }
        return h(Card, { title, onClickFooter },()=> h('div', {} , children) );
    } else if (noticeType == 9) {  //提醒验收
        const children = [
            h('span', { style: "color: #3468FE;" }, mataData.senderNickName),
            h('span', {}, '提醒您验收啦~'),
        ]
        const onClickFooter = ()=>{
            router.push({ path: `/workspace/admin/goods_detail/${mataData.order?.orderNo}` });
        }
        return h(Card, { title , onClickFooter },()=> h('div', {} , children) );
    } else if (noticeType == 10) {  //工单状态改变
        if (mataData.order) {
            const children = [
                childrenItem('订单编号', mataData.order?.orderNo),
                childrenItem('订单标题', mataData.order?.title),
                childrenItem('订单金额', mataData.order?.price),
            ]
            const status = mataData.status;
            //mataData.toUser ，0发给甲方，1发给乙方
            const onClickFooter = ()=>{
                if (mataData) {
                    const status = mataData.status;
                    const orderNo = mataData.orderNo || mataData.order.orderNo;
                    if (status == 0) {
                        if (mataData.toUser == 0){//甲方
                            router.push({ path: `/workspace/admin/goods_detail/${orderNo}` });
                        }else {
                            router.push({ path: `/workspace/admin/order_detail/${orderNo}` });
                        }
                    } else{
                        if (mataData.toUser == 0) {//甲方
                            router.push({path: `/workspace/admin/goods_detail/${orderNo}`});
                        }else {
                            router.push({ path: `/workspace/admin/order_detail/${orderNo}` });
                        }
                    }
                }
            }

            if (mataData.fileSystem == 'add') {
                children.push(childrenItem('订单状态', '创作者已上传作品'))
            } else {
                if (status == 0) {
                    if (mataData.toUser == 0){//甲方
                        children.push(childrenItem('订单状态', '创作者待接单'))
                    }else {
                        children.push(childrenItem('订单状态', '待接单'))
                    }
                } else if (status == 1) {
                    if (mataData.toUser == 0) {//甲方
                        children.push(childrenItem('订单状态', '创作者已接单'))
                    }else {
                        children.push(childrenItem('订单状态', '已接单'))
                    }
                } else if (status == 2) {
                    if (mataData.toUser == 0) {//甲方
                        children.push(childrenItem('订单状态', '创作者已拒绝接单'))
                    }else {
                        children.push(childrenItem('订单状态', '已拒绝'))
                    }
                } else if (status == 3) {
                    if (mataData.toUser == 0) {//甲方
                        children.push(childrenItem('订单状态', '创作者已提交最终验收，请于72小时内确认验收'))
                    }else {
                        children.push(childrenItem('订单状态', '已交付'))
                    }
                } else if (status == 4) {
                    children.push(childrenItem('订单状态', '已关闭'))
                } else if (status == 5) {
                    if (mataData.toUser == 0){//甲方
                        children.push(childrenItem('订单状态', '退款中'))
                    }else {
                        children.push(childrenItem('订单状态', '雇主申请退款'))
                    }
                } else if (status == 6) {
                    children.push(childrenItem('订单状态', '已退款'))
                } else if (status == 7) {
                    if (mataData.toUser == 0) {//甲方
                        children.push(childrenItem('订单状态', '创作者拒绝退款'))
                    }else {
                        children.push(childrenItem('订单状态', '拒绝退款'))
                    }
                } else if (status == 8) {
                    if (mataData.toUser == 0){//甲方
                        children.push(childrenItem('订单状态', '已取消退款'))
                    }else {
                        children.push(childrenItem('订单状态', '雇主取消退款'))
                    }
                } else if (status == 9) {
                    children.push(childrenItem('订单状态', '已完成'))
                } else if (status == 10) {
                    children.push(childrenItem('订单状态', '已评价'))
                } else if (status == 11) {
                    children.push(childrenItem('订单状态', `${mataData.senderNickName}申请平台介入`))
                }
            }
            return h(Card, { title , onClickFooter  },()=>h('div', {} , children) );
        }
        return h(Card, { title, showButton:false },()=> h('div', {} , content));
    } else if (noticeType == 14) {  //招募报名
        const recruitTitle = mataData.recruit?.title
        const children = [
            h('span', {}, mataData.senderNickName + ` 已报名您的招募"${ recruitTitle }"`),
            childrenItem('工种类型', mataData.categoryTitle || '-'),
        ]
        const onClickFooter = ()=>{
            const id = mataData.recruit?.id;
            router.push({ path: `/workspace/admin/recruit_console/${id}` });
        }
        return h(Card, { title , onClickFooter},()=> h('div', {} , children)
        );
    } else if (noticeType == 15) {  //招募选定
        const children = [
            h('span', {}, '恭喜您，在"' + mataData.order.title + '"中被选定，请及时接受订单' ),
        ]
        const onClickFooter = ()=>{
            router.push({ path: `/workspace/admin/enroll`});
        }
        return h(Card, { title , onClickFooter},()=> h('div', {} , children)
        );
    } else if (noticeType == 16) {  //取消选定
        const children = [
            h('span', {}, '抱歉，您报名的"' + mataData.order.title + '"被雇主取消选定，请继续加油~' ),
        ]
        const onClickFooter = ()=>{
            router.push({ path: `/workspace/recruit/${mataData.order.recruitId}` });
        }
        return h(Card, { title , onClickFooter},()=> h('div', {} , children)
        );
    } else if (noticeType == 17) {  //未被选定
        const children = [
            h('span', {}, '抱歉，您在"' + mataData.order.title + '"中未被选定，请继续加油~' ),
        ]
        const onClickFooter = ()=>{
            router.push({ path: `/workspace/recruit/${mataData.order.recruitId}` });
        }
        return h(Card, { title , onClickFooter},()=> h('div', {} , children)
        );
    } else if (noticeType == 18) {  //评价
        const children = [
            h('span', {style: 'color: #3468FE;'}, mataData.senderNickName ),
            h('span', {}, '已给您做出评价，赶紧前往查看吧~' ),
        ]
        const onClickFooter = ()=>{
            router.push({ path: `/workspace/admin/order_detail/${mataData.orderNo}` });
        }
        return h(Card, { title , onClickFooter},()=> h('div', {} , children)
        );
    } else if (noticeType == 19) {  //招募完成
        const children = [
            h('span', {style: 'color: #3468FE;'}, mataData.recruit.title || '-' ),
            h('span', {}, '已完成招募' ),
        ]
        const onClickFooter = ()=>{
            router.push({ path: `/workspace/admin/recruit_console/${mataData.recruit.id}` });
        }
        return h(Card, { title , onClickFooter},()=> h('div', {} , children)
        );
    }  else if (noticeType == 20) {  //重新开始招募
        const children = [
            h('span', {style: 'color: #3468FE;'}, mataData.recruit.title || '-' ),
            h('span', {}, '已重新开启招募' ),
        ]
        const onClickFooter = ()=>{
            router.push({ path: `/workspace/admin/recruit_console/${mataData.recruit.id}` });
        }
        return h(Card, { title , onClickFooter},()=> h('div', {} , children)
        );
    }  else if (noticeType == 21) {  //招募过期
        const children = [
            h('span', {style: 'color: #3468FE;'}, mataData.recruit.title || '-' ),
            h('span', {}, '已过报名截止日期，请重新调整' ),
        ]
        const onClickFooter = ()=>{
            router.push({ path: `/workspace/admin/recruit_console/${mataData.recruit.id}` });
        }
        return h(Card, { title , onClickFooter},()=> h('div', {} , children)
        );
    }  else if (noticeType == 30) {
        const children = [
            h('span', {style: 'color: #3468FE;'}, mataData.senderNickName || '-' ),
            h('span', {}, '关注了您'),
        ]
        const onClickFooter = ()=>{}
        return h(Card, { title , onClickFooter, showButton:false  },()=> h('div', {} , children) );
    }else { //其他
        const onClickFooter = ()=>{

        }
        return h(Card, { title, onClickFooter, showButton:false }, ()=> h('div', {} , content) );
    }
}
