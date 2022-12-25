<template>
    <div class="session_user-item" :class="{isStickOnTop}" :style="sessionData.updateTime || sessionData.unread ? '' : 'padding: 8px 16px;'" v-contextmenu:contextmenuRef @click="emit('click',$event)">
        <el-avatar :src="sessionData.avatar"></el-avatar>
        <div class="session_user-info">
            <div style="color:white;" v-if="sessionData.dangerouslyUseHTMLString" v-html="sessionData.nickname"></div>
            <div class="nickName" v-else>{{sessionData.nickname}}</div>
            <div class="lastMsg">{{sessionData.context}}</div>
        </div>
        <div class="session_unready" v-if="!disremind && sessionData.unread">{{sessionData.unread > 99 ? '99+' : sessionData.unread}}</div>
        <div class="session_unready disabled" v-else-if="(disremind && sessionData.unread)">{{sessionData.unread > 99 ? '99+' : sessionData.unread}}</div>
        <div class="session_disremind" v-else-if="disremind && sessionData.unread <= 0">
            <SvgIcon :size="12" iconClass="icon_im-disremind"></SvgIcon>
        </div>
        <div class="session_time" v-if="sessionData.updateTime">{{setDateFormat(sessionData.updateTime,false,false)}}</div>
        <v-contextmenu ref="contextmenuRef" :width="120" :disabled="!slots.contextmenuItem">
            <slot name="contextmenuItem"></slot>
        </v-contextmenu>
    </div>
</template>
<script>
import { defineComponent, useSlots } from "@vue/runtime-core"
import { setDateFormat , getJsonData } from '../util.js'
import SvgIcon from '@/components/SvgIcon'
const props = {
    isStickOnTop:{
        type:Boolean,
        default:false
    },
    disremind:{
        type:Boolean,
        default:false
    },
    sessionData:{
        type:Object,
        default:()=>{
            return {}
        }
    }
}
const emits = ['click'];
const setup = (prop,{emit})=>{
    const slots = useSlots();
    const contextmenuRef = ref();
    return {
        emit,
        slots,
        setDateFormat,
        contextmenuRef
    }
}
export default defineComponent({
    setup,
    props,
    emits
})
</script>
<style scoped lang="scss">
    .session_user-item{
        display: flex;
        align-items: center;
        padding: 8px 96px 8px 16px;
        position: relative;
        cursor: pointer;
        &.isStickOnTop{
            background: #2F3038;
        }
        &:hover{
            background: #36373E;
            &.isStickOnTop{
                background: #36373E;
            }
        }
        &:deep(.el-avatar){
            flex: none;
            pointer-events: none;
        }
        .session_user-info{
            flex: auto;
            overflow: hidden;
            font-size: 14px;
            margin-left: 16px;
            .nickName{
                width: 100%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                color: rgba($color: #FFFFFF, $alpha: .6);
                margin-bottom: 4px;
            }
            .lastMsg{
                width: 100%;
                height: 16px;
                line-height: 16px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 12px;
                color: rgba($color: #FFFFFF, $alpha: .2);
            }
        }
        .session_unready{
            right: 16px;
            bottom: 8px;
            position: absolute;
            color: white;
            background: #FF3434;
            border-radius: 30px;
            font-size: 12px;
            padding: 2px 5px;
            user-select: none;
            &.disabled{
                color: rgba($color: #fff, $alpha: .5);
                background:  #666;
            }
        }
        .session_disremind{
            right: 16px;
            bottom: 8px;
            position: absolute;
            color: white;
            // background: #FF3434;
            border-radius: 30px;
            font-size: 12px;
            padding: 2px 5px;
            user-select: none;
        }
        .session_time{
            top: 8px;
            width: 80px;
            right: 16px;
            font-size: 12px;
            text-align: right;
            user-select: none;
            position: absolute;
            // transform: translateY(-50%);
            color: rgba($color: #FFFFFF, $alpha: .6);
        }   
    }
</style>