import { h } from 'vue';
import Card from '../Card.vue';
import router from '@/router';
import { childrenItem, formatDate } from '../util'
import {useStore} from "vuex";
export default function ( attach ,mataData) {
    const title = attach.title;
    const content = attach.content;
    const noticeType = attach.noticeType;
    const store = useStore();
    const onClickFooter = ()=>{
        if (noticeType == 12 || noticeType ==  5 || noticeType == 6) {
            router.push({
                path: `/project/index/${mataData.project.id}/file`
            })
        }else if(noticeType == 8){
            router.push({
                path: `/project/index/${mataData.project.id}/file`, query: { parent: mataData.collect.dirId}
            })
        }else {
            router.push({
                path: '/file', query: {
                    id: mataData.file.fileId,
                    projectId: mataData.project.id,
                    fileCat: mataData.file.fileCat,
                }
            })
        }
    }
    if (noticeType == 1) {//@
        const children = [
            h('span', { style: 'color: #3468FE;' }, mataData.user.nickName),
            h('span', {}, '在'),
            h('span', { style: 'color: #3468FE;' }, mataData.file.filename),
            h('span', {}, '中@你。'),
        ]
        const component1 = h('div', { style: 'margin-bottom: 10px;' }, children);
        return h(Card, { title , onClickFooter },()=> h('div', {} ,  [component1]) );
    } else if (noticeType == 2) {//修改审阅状态
        const children = [
            h('span', { style: "color: #3468FE;" }, mataData.user.nickName),
            h('span', {}, '修改了'),
            h('span', { style: "color: #3468FE;" }, mataData.file.filename),
            h('span', {}, '的审阅状态为'),
            h('span', { style: "color: #3468FE;" }, mataData.file.fileStatusName),
        ]
        return h(Card, { title , onClickFooter },()=> h('div', {} , children) );
    } else if (noticeType == 3) {//版本迭代
        const children = [
            h('span', { style: "color: #3468FE;" }, mataData.user.nickName),
            h('span', {}, '迭代了'),
            h('span', { style: "color: #3468FE;" }, mataData.file.filename),
            h('span', {}, '的版本为'),
            h('span', { style: "color: #3468FE;" }, ` v${mataData.file.version}`),
        ]
        return h(Card, { title , onClickFooter },()=> h('div', {} , children) );
    } else if (noticeType == 4) {//添加评论
        const children = [
            h('span', { style: "color: #3468FE;" }, mataData.user.nickName),
            h('span', {}, '在'),
            h('span', { style: "color: #3468FE;" }, mataData.file.filename),
            h('span', {}, '中添加了评论。'),
            // 【评论内容】
            h('span', { style: "display: block;" }, mataData.comment ),
            h('span', { style: "display: block;" }, mataData?.attachment ),
        ]

        return h(Card, { title , onClickFooter },()=> h('div', {} , children) );
    }else if (noticeType == 5) {//邀请成员
        const children1 = [
            h('span', { style: "color: #3468FE;" }, mataData.joinUser.nickName),
            h('span', {}, '加入了项目'),
        ]
        const children2 = [
            h('span', {  }, '邀请人为'),
            h('span', {  style: "color: #3468FE;" }, mataData.inviteUser.nickName),
        ]
        const children = [
            h('div', {} , children1),
            h('div', {} , children2)
        ]
        return h(Card, { title , onClickFooter },()=> h('div', {} , children) );
    } else if (noticeType == 6) {//项目转让
        const children = [
            h('span', { style: "color: #3468FE;" }, mataData.fromUser.nickName),
            h('span', {}, '转让了'),
            h('span', { style: "color: #3468FE;" }, mataData.project.name),
            h('span', {}, '给'),
            h('span', { style: "color: #3468FE;" }, mataData.toUser.nickName),
        ]
        //fromUser.userId = 当前userId 不显示‘查看详情’
        const toUser = mataData.fromUser.userId != store.state.user.userId
        return h(Card, { title , onClickFooter ,showButton:toUser},()=> h('div', {} , children) );
    }  else if (noticeType == 7) {//分享
        const children = [
            h('span', { style: "color: #3468FE;" }, mataData.user.nickName),
            h('span', {}, '分享了'),
            h('span', { style: "color: #3468FE;" }, mataData.share?.shareName),
        ]
        const onClickFooter = ()=> {
            router.push({
                path: `/project/index/${mataData.project.id}/file`, query: { parent: mataData.file.list[0].id}
            })
        }
        return h(Card, { title , onClickFooter },()=> h('div', {} , children) );
    }  else if (noticeType == 8) {//收集文件
        const children = [
            h('span', { style: "color: #3468FE;" }, mataData.user.nickName),
            h('span', {}, '发起了收集'),
            h('span', { style: "color: #3468FE;" }, mataData.collect.name),
        ]
        return h(Card, { title , onClickFooter },()=> h('div', {} , children) );
    }   else if (noticeType == 12) { //项目完结/归档
        const children = [
            h('span', { style: "color: #3468FE;" }, mataData.user.nickName),
            h('span', {}, '归档了项目'),
            h('span', { style: "color: #3468FE;" }, mataData.project.name),
        ]
        return h(Card, { title , onClickFooter },()=> h('div', {} , children) );
    }  else {
        return h(Card, { title , onClickFooter },()=> h('div', {} , content) );
    }

}
