<template>
    <el-dialog v-model="visible" width="530px" title="发起收集" :close-on-press-escape="false" :before-close="onBeforeClose" custom-class="dialog-center">
        <div v-loading="dialogLoading">
            <div :style="{visibility:dialogLoading?'hidden':'visible'}">
                <!-- <div v-color="'#878787'">邀请链接和小程序码 24小时内有效</div> -->
                <div class="invitation-link">
                    <div class="text">{{resultData.url}}</div>
                    <el-button type="primary" class="copy-btn" @click.stop="handleCopyText(resultData)">复制链接</el-button>
                </div>
                <!-- <div class="invitation-code">
                    <div class="code-image">
                    </div>
                    <div class="code-desc">— 收集手机文件可将二维码发送给对方 —</div>
                    <div class="copy-image" @click="handleCopyImage(resultData.qrcode)">
                        复制二维码图片
                    </div>
                </div> -->
                <div v-if="resultData.info&&resultData.info.passwordLock == 1" style="text-align:center;">
                    <span v-color="'#636363'">密码：</span>
                    <span v-color="'#4565DC'" style="font-weight: bold">{{resultData.info.password}}</span>
                </div>
            </div>
        </div>
    </el-dialog>
</template>
<script>
import { getCollectDetails } from '@/api/project/files.js'
import useClipboard from 'vue-clipboard3'
import { ElMessage } from 'element-plus'
import { defineComponent,ref } from "vue";
import { useStore } from 'vuex'

const setup = (prop,{emit})=>{
    let collectId = null;
    const store = useStore();
    const visible = ref(false);
    const resultData = ref({});
    const dialogLoading = ref(false);
    const { toClipboard } = useClipboard();
    const onBeforeClose = (deno)=>{
        if(dialogLoading.value){
            return
        }
        if(typeof  deno == 'function'){
            deno();
        }else{
            visible.value = false;
        }
    }
    // 复制链接
    const handleCopyText = async (data)=>{
        try{
            let text = `链接: ${data.url}${data.info?.passwordLock?'\n密码: '+ data.info?.password:''}`
            await toClipboard(text)
            ElMessage.success('复制成功')
        }catch(err){
            ElMessage.error('复制失败')
        }
    }
    // 复制二维码
    const handleCopyImage = async (base64)=>{
        try{
            let arr = base64.split(',');
            let contentType = 'data:image/png;base64';
            arr[0] = contentType;
            let data = await fetch(arr.join(','));
            let blob = await data.blob()
            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob,
                })
            ])
            ElMessage.success('复制成功')
        }catch(err){
            ElMessage.error('复制失败')
        }
    }
    // 打开
    const open = (id,qrcode,url,info)=>{
        if(dialogLoading.value){
            return
        }
        if(qrcode && url){
            resultData.value = {
                url,
                info,
                qrcode,
            }
            visible.value = true;
            return 
        }
        visible.value = true;
        collectId = id;
        dialogLoading.value = true;
        getCollectDetails({id}).then(res=>{
            dialogLoading.value = false;
            resultData.value = res.data;
        }).catch(err=>{
            dialogLoading.value = false;
            onBeforeClose();
        })
    }


    return {
        open,
        visible,
        resultData,
        dialogLoading,
        onBeforeClose,
        handleCopyText,
        handleCopyImage,
    }
}


export default defineComponent({
    setup,
})
</script>
<style scoped lang="scss">
    .invitation-link{
        border: 1px solid #DADCE1;
        border-radius: 10px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 8px;
        margin-bottom: 30px;
        .text{
            flex-grow: 1;
            font-size: 14px;
            padding: 0 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            user-select: none;
        }
        .copy-btn{
            border:none;
            background: linear-gradient(42deg, #0459FF 0%, #5726DD 100%);
            border-radius: 10px;
            padding: 20px;
        }
    }
    .invitation-code{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        user-select: none;
        .code-image{
            width: 200px;
            height: 200px;
            margin-bottom: 12px;
            background: #f4f4f4;
        }
        .code-desc{
            color: #878787;
            margin-bottom: 12px;
        }
        .copy-image{
            color: #3468FE;
            cursor: pointer;
            margin-bottom: 10px;
            &:hover{
                color: #3467fea3;
            }
        }
    }
</style>