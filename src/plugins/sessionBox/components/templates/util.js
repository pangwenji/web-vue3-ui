import { h } from 'vue';
import dayjs from "dayjs"

// 数据每一项
export const childrenItem = (label, content) => {
    const style = 'display: flex; align-items: stretch;'
    const child = [
        h('div', { style: 'flex: none; width: 60px; text-align: justify; text-align-last: justify;' }, label),
        h('div', { style: 'flex: none;' }, '：'),
        h('div', { style: 'flex: auto; word-break: break-all;' }, content),
    ]
    return h('div', { style }, child)
}
// 时间格式化
export const formatDate = (d) => {
    if (d) {
        return dayjs(d).format('YYYY-MM-DD HH:mm:ss');
    } else {
        return '-'
    }
}
