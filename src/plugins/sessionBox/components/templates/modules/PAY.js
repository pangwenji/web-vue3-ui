import { h } from 'vue';
import Card from '../Card.vue'
import router from '@/router'
import { childrenItem, formatDate } from '../util'
export default function ( attach ,mataData) {
    const title = mataData.title || attach.title;
    const content = attach.content;
    const noticeType = attach.noticeType;
    if(noticeType == 1){//同钱收入
        const children = [
            childrenItem('订单类型',mataData.orderType || '-'),
            childrenItem('订单编号', mataData.orderNo || '-'),
            childrenItem('订单名称', mataData.orderName || '-'),
            childrenItem('收入金额', mataData.amount?.toFixed(2) || '-'),
            childrenItem('可用余额', mataData.balance?.toFixed(2) || '-'),
        ]
        const onClickFooter = ()=>{
            router.push({ path: '/user/center/wallet' });
        }
        return h(Card, { title , onClickFooter},()=> h('div', {} , children));
    }else if (noticeType == 2) {//同钱支出
        const children = [
            childrenItem('订单类型',mataData.orderType || '-'),
            childrenItem('订单编号', mataData.orderNo || '-'),
            childrenItem('订单名称', mataData.orderName || '-'),
            childrenItem('支出金额', mataData.amount?.toFixed(2) || '-'),
            childrenItem('可用余额', mataData.balance?.toFixed(2)|| 0),
        ]
        const onClickFooter = ()=>{
            router.push({ path: '/user/center/wallet' });
        }
        return h(Card, { title , onClickFooter},()=> h('div', {} , children) );
    }else if (noticeType == 3) {//保证金
        const children = [
            childrenItem('订单类型',mataData.orderType || '-'),
            childrenItem('订单编号', mataData.orderNo || '-'),
            childrenItem('冻结金额', mataData.amount?.toFixed(2) || 0),
            childrenItem('可用余额', mataData.balance?.toFixed(2)|| 0),
            childrenItem('备注', mataData.remark || '-'),
        ]
        const onClickFooter = ()=>{
            router.push({ path: '/user/center/wallet' });
        }
        return h(Card, { title , onClickFooter},()=> h('div', {} , children) );
    }else if (noticeType == 4) {//托管
        const children = [
            childrenItem('订单类型',mataData.orderType || '-'),
            childrenItem('订单编号', mataData.orderNo || '-'),
            childrenItem('托管金额', mataData.amount?.toFixed(2) || 0),
            childrenItem('可用余额', mataData.balance?.toFixed(2)|| 0),
            childrenItem('备注', mataData.context || '-'),
        ]
        const onClickFooter = ()=>{
            router.push({ path: '/user/center/wallet' });
        }
        return h(Card, { title , onClickFooter},()=> h('div', {} , children) );
    }else {//默认
        const newTitle = attach.title;
        const children = [
            childrenItem('类型', `${content}`),
            childrenItem('金额', mataData.amount?.toFixed(2) || '-'),
            childrenItem('可用余额', mataData.balance?.toFixed(2) || '-'),
            childrenItem('支付时间', formatDate(mataData.createTime)),
        ]
        const onClickFooter = ()=>{
            router.push({ path: '/user/center/wallet' });
        }
        return h(Card, { title:newTitle , onClickFooter},()=> h('div', {} , children) );
    }
}
