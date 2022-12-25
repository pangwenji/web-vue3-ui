import { h } from 'vue';
import { childrenItem, formatDate } from '../util'
import Card from '../Card.vue'
import router from '@/router'
export default function ( attach ,mataData) {
    const title = attach.title;
    const content = attach.content;
    const noticeType = attach.noticeType;
    if(noticeType == 2){//会员开通成功
        const children = [
            childrenItem('会员类型', mataData.memberType || '-'),
            childrenItem('订单编号 ', mataData.orderNo || '-'),
            childrenItem('到期时间 ', mataData.expireTime || '-'),
        ]
        const onClickFooter = ()=>{
            router.push({ path: '/user/center/wallet' });
        }
        return h(Card, { title , onClickFooter }, ()=> h('div', {} , children) );
    }else if(noticeType == 3){//会员已过期
        const children = [
            h('span', {}, '您的【'+(mataData.memberType || '个人版')+'】会员已过期，部分功能已限制使用，请及时续费，以免影响正常使用。'),
        ]
        const onClickFooter = ()=>{
            router.push({ path: '/user/center/member' });
        }
        return h(Card, { title , onClickFooter }, ()=> h('div', {} , children) );
    }else if(noticeType == 4){//会员到期警告
        const children = [
            h('span', {}, '您的【'+(mataData.memberType || '个人版')+'】会员将于【'+ mataData.expireTime+ '】过期，请及时续费，以免影响正常使用。'),
        ]
        const onClickFooter = ()=>{
            router.push({ path: '/user/center/member' });
        }
        return h(Card, { title , onClickFooter }, ()=> h('div', {} , children) );
    }else if(noticeType == 5){//邀请注册个人版
        const children = [
            h('span', { style: 'color: #3468FE;' }, mataData.nickName),
            h('span', {}, '已激活为个人版用户'),
        ]
        const onClickFooter = ()=>{
            router.push({ path: '/user/center/promote' });
        }
        return h(Card, { title , onClickFooter }, ()=> h('div', {} , children) );
    }else if(noticeType == 6){//邀请注册体验版
        const children = [
            h('span', { style: 'color: #3468FE;' }, mataData.nickName),
            h('span', {}, '已注册为体验版用户'),
        ]
        const onClickFooter = ()=>{
            router.push({ path: '/user/center/promote' });
        }
        return h(Card, { title , onClickFooter }, ()=> h('div', {} , children) );
    }else if(noticeType == 7){//会员到期警告
        const children = [
            h('span', {}, '您的【'+(mataData.memberType || '个人版')+'】会员将于【'+ mataData.expireTime+ '】过期，请及时续费，以免影响正常使用。'),
        ]
        const onClickFooter = ()=>{
            router.push({ path: '/user/center/member' });
        }
        return h(Card, { title , onClickFooter }, ()=> h('div', {} , children) );
    }else {
        return h(Card, { title , showBottom:false },()=> h('div', {},content) );
    }
}
