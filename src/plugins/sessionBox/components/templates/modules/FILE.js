import { h } from 'vue';
import { childrenItem, formatDate } from '../util'
import Card from '../Card.vue'
import router from '@/router'
export default function ( attach ,mataData) {
    const title = mataData.title;
    const content = attach.content;
    const noticeType = attach.noticeType;
    if(noticeType == 2){//空间扩容
        const children = [
            h('span', {}, mataData.content),
            childrenItem('总共', mataData.total || '-'),
            childrenItem('已用 ', mataData.used || '-'),
            childrenItem('剩余 ', mataData.surplus || '-'),
        ]
        const onClickFooter = ()=>{
            router.push({ path: '/user/center/space' });
        }
        return h(Card, { title , onClickFooter }, ()=> h('div', {} , children) );
    }else {
        return h(Card, { title },()=> h('div', {}, ''));
    }

}
