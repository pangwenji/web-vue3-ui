<template>
    <div style="position:relative;">
        <canvas ref="PdfViewRef"></canvas>
        <div class="loading" v-if="loadingState == 1">
            <el-icon class="is-loading" :size="100">
                <Loading />
            </el-icon>
        </div>
        <div class="error" v-if="loadingState == 2">加载失败</div>
    </div>
</template>
<script>
import { Loading } from '@element-plus/icons-vue';
import { ElIcon } from 'element-plus';
import { defineComponent,onMounted, ref } from 'vue';
import * as PDFJS from 'pdfjs-dist/legacy/build/pdf'
import * as PdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry'
PDFJS.GlobalWorkerOptions.workerSrc = PdfjsWorker;
const props = {
    src: String
}
const components = {
    ElIcon,
    Loading,
}
let pdfDoc; // pdf实例
const setup = (prop) => {
    onMounted(() => {
        init();
    })
    const PdfViewRef = ref(); // canvas实例
    const pafPageNum = ref(1);
    const pdfPageCount = ref(0); // 总页数
    const loadingState = ref(0); // 加载状态
    // 初始化获取文件
    const init = () => {
        loadingState.value = 1;
        const documentTask = PDFJS.getDocument(prop.src);
        documentTask.promise.then((result) => {
            pdfDoc = result;
            pdfPageCount.value = result.numPages;
            rederPdf();
        }).catch((err) => {
            console.log(err)
            loadingState.value = 2;
        });
    }
    // 渲染pdf到canvas
    const rederPdf = () => {
        // const pageRendering = true;
        pdfDoc.getPage(pafPageNum.value).then((result) => {
            loadingState.value = 0;
            // const offsetY = pafPageNum.value * (PdfViewRef.value.width || 0);
            const viewport = result.getViewport({scale: 1});
            // console.log(viewport)
            // console.log(PdfViewRef.value)
            PdfViewRef.value.width = viewport.width;
            PdfViewRef.value.height = viewport.height;
            const renderContext = {
                canvasContext: PdfViewRef.value.getContext('2d'),
                viewport,
            }
            const renderTask = result.render(renderContext);
            renderTask.promise.then(() => { })
        }).catch((err) => {
            console.log(err)
            loadingState.value = 2;
        });
    }
    const handlePrePage = ()=>{
        if(pafPageNum.value > 1){
            pafPageNum.value --;
            rederPdf();
        }
        
    }
    const handleNextPage = ()=>{
        if(pafPageNum.value < pdfPageCount.value){
            pafPageNum.value ++;
            rederPdf();
        }
    }
    return {
        PdfViewRef,
        pafPageNum,
        pdfPageCount,
        loadingState,
        handlePrePage,
        handleNextPage,
    }
}
export default defineComponent({
    setup,
    props,
    components
})

</script>
<style scoped lang="scss">
.loading{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    font-size: 26px;
    color: #979797;
}
.error{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    font-size: 26px;
    color: #979797;
}
</style>