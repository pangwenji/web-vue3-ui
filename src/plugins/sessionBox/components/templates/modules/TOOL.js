import { h } from 'vue';
import { childrenItem, formatDate } from '../util'
import Card from '../Card.vue'
import router from '@/router'
export default function ( attach ,mataData) {
    const title = attach.title;
    const toolName = mataData.tooldetail?.name;
    const statusName = mataData.status == 'success' ? '成功' : '失败';
    const onClickFooter = ()=>{
        router.push({ path: '/tool/index/record' })
    }
    return h(Card, { title ,onClickFooter},()=> h('div', {}, `“${toolName}”处理${statusName}`));
}
