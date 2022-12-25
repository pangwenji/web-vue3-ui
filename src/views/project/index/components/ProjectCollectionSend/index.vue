<template>
    <el-dialog v-model="visible" width="314px" :title="showType == 'qrcode'? '通过扫码分享':'通过链接分享'" :close-on-press-escape="false" :before-close="onBeforeClose" custom-class="dialog-center project-share-dialog">
        <div v-loading="dialogLoading">
            <div :style="{visibility:dialogLoading?'hidden':'visible'}" class="share-container-box">
                <!-- <div v-color="'#878787'">邀请链接和小程序码 24小时内有效</div> -->
                <template v-if="showType == 'qrcode'">
                    <div class="qrcode-box">
                        <el-tooltip
                            class="box-item"
                            effect="dark"
                            content="点击可复制二维码"
                            placement="top"
                        >
                            <!-- <el-image @click="handleCopyImage(resultData.qrcode)" style="width:100%;height:100%" :src="resultData.qrcode"></el-image> -->
                        </el-tooltip>
                    </div>
                    <div class="qrcode-name">{{resultData.info.name}}</div>
                    <div class="qrcode-password" v-if="resultData.info.password">密码：<span v-color="'#4565DC'">{{resultData.info.password}}</span></div>
                    <div class="qrcode-btn" @click="handleTo('link')">通过链接分享</div>
                </template>
                <template v-else>
                    <div class="link-container">
                        <div class="link-container-content">
                            <div>请点击链接，向「{{resultData.info.name}}」发送文件</div>
                            <div>链接：{{resultData.url}}</div>
                            <div v-if="resultData.info.password">密码：{{resultData.info.password}}</div>
                        </div>
                        <el-button type="primary" class="copy-btn" @click="handleCopyText(resultData)">复制</el-button>
                    </div>
                    <!-- <div class="qrcode-btn" @click="handleTo('qrcode')">通过扫码分享</div> -->
                </template>
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
    let collcetionId = null;
    const store = useStore();
    const visible = ref(false);
    const resultData = ref({info:{}});
    const showType = ref('qrcode');
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
    const handleTo = (name)=>{
        showType.value = name
    }
    // 打开
    const open = ({type,id,token,qrcode,url,info})=>{
        showType.value = type || 'qrcode';
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
        collcetionId = id;
        visible.value = true;
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
        handleTo,
        showType,
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
<style lang="scss">
    .project-share-dialog{
        .el-dialog__body{
            padding: 0;
        }
    }
</style>
<style scoped lang="scss">

    .share-container-box{
        height: 280px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: column;
        text-align: center;
        .qrcode-box{
            width: 140px;
            height: 140px;
            cursor: pointer;
        }
        .qrcode-name{
            font-size: 16px;
            color: #121212;
        }
        .qrcode-password{
            font-size: 16px;
            color: #636363;
            span{
                color: #4565DC;
                font-weight: bold;
            }
        }
        .qrcode-btn{
            width: 100%;
            line-height: 56px;
            border-top: 1px solid #E4E4E4;
            color: #4565DC;
            font-size: 14px;
            flex-shrink: 0;
            cursor: pointer;
            user-select: none;
        }
        .link-container{
            width: 100%;
            box-sizing: border-box;
            padding: 0 20px;
            margin-bottom: 20px;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
            .link-container-content{
                width: 100%;
                border-radius: 10px;
                border: 1px solid #DADCE1;
                margin: 0 auto;
                padding: 10px;
                box-sizing: border-box;
                flex-grow: 1;
                color: #131313;
                font-size: 14px;
                text-align: left;
                div{
                    line-height: 20px;
                }
            }
            .copy-btn{
                flex-shrink: 0;
                width: 100%;
                background: linear-gradient(42deg, #0459FF 0%, #5726DD 100%);
                border-radius: 10px;
                margin-top: 20px;
                border: none;
            }

        }
    }
</style>