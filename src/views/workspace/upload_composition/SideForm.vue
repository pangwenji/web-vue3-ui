<template>
    <div class="composition_sider" :class="{hide: !show }">
        <el-scrollbar class="composition_sider-scrollbar" view-class="composition_sider-view">
            <!-- <div style="width: 80%; margin: 0 auto 20px;">
                <el-button type="primary" color="#3468FE" style="width: 100%;" round>保存</el-button>
            </div>
            <div style="text-align:center; margin-bottom: 20px;">
                <el-switch active-color="#3468FE" v-model="formData.mark" inactive-color="#666A7A" active-text="添加水印" />
            </div>
            <div class="line"></div> -->
            <template v-if="formData.id">
                <!-- <div class="title">
                    添加水印
                    <div>
                        <el-switch v-model="formData.watermark" @change="handleUpdateWorkFile('watermark')" :inactive-value="0" :active-value="1" active-color="#3468FE" inactive-color="#666A7A" />
                    </div>
                </div> -->
                <div class="title">标题设置</div>
                <el-input placeholder="请输入标题..." class="custom-input-title" :maxlength="30" show-word-limit @change="handleUpdateWorkFile('name')" v-model="formData.name"></el-input>
                <template v-if="type !== 'image'">
                    <div class="title">封面缩略图设置</div>
                    <div v-if="formData.cover" class="setting-cover">
                        <el-image style="width:100%;height:100%" fit="cover" :src="formData.cover" :draggable="false"></el-image>
                        <div class="upload-file-cover">
                            <div>
                                <el-button type="primary" color="#30323B" round @click.stop="handleClickUpload">更换封面</el-button>
                                <!-- <el-button type="primary" color="#30323B" round>云盘选择</el-button> -->
                            </div>
                            <div style="color: #4E5262; font-size: 14px; margin-top: 20px;">支持jpeg、jpg格式，文件小于5M</div>
                        </div>
                    </div>
                    <div v-else class="upload-file-set">
                        <div>
                            <el-button type="primary" color="#30323B" round @click.stop="handleClickUpload">上传封面</el-button>
                            <!-- <el-button type="primary" color="#30323B" round>云盘选择</el-button> -->
                        </div>
                        <div style="color: #4E5262; font-size: 14px; margin-top: 20px;">支持jpeg、jpg格式，文件小于5M</div>
                    </div>
                </template>
                <input type="file" ref="UploadFileValue" hidden accept="image/jpeg, image/png" @change="handleUploadFile" />
                <div class="title">
                    <span>标签设置</span>
                    <el-button type="primary" style="color: #9094A6;" color="#30323B" @click="handleShowInput">新建标签</el-button>
                </div>
                <div class="tag-form">
                    <el-input placeholder="请输入标签名称" ref="TagNameInputRef" class="custom-tag" v-model="tagInput" @blur="handleCreateTag" :show-word-limit="true" :maxlength="6" v-if="showInput">
                        <template #prefix>
                            <div class="custom-radio active"></div>
                        </template>
                    </el-input>
                    <template v-for="(item,index) in tagData">
                        <div class="custom-tag tag-item" :class="{active: checkTag(item)}" @click.stop="handleCheckTag(item)">
                            <div class="custom-radio"></div>
                            <div class="tag-title">{{item.title}}</div>
                            <div class="suffix-detele" @click.stop="handleDeleteTag(item,index)">
                                <el-icon :size="14">
                                    <Delete />
                                </el-icon>
                            </div>
                        </div>
                    </template>
                </div>
                <div class="title">已选标签({{selectData.length}}/10)</div>
                <div class="check-tag-box">
                    <template v-for="(item,index) in selectData" :key="index">
                        <el-tag style="margin-left: 10px;" closable :disable-transitions="false" @close="handleDeleteSelectTag(item)">{{item.title}}</el-tag>
                    </template>
                </div>
            </template>
            <template v-else>
                <div style="font-size: 24px; color: #979797; padding: 20px 0; text-align:center;">未选择文件</div>
            </template>
        </el-scrollbar>
    </div>
</template>
<script>
import { publicUploadFile, updateWorkFile, createFileTag, deleteFileTag } from '@/api/personnel/file'
import { computed, defineComponent, getCurrentInstance, nextTick, reactive } from 'vue';
import UploadFile from '@/utils/uploadFile.js'
import { ElMessage } from 'element-plus';
const props = {
    type: {
        type: String,
        default: 'image'
    },
    tagData: {
        type: Array,
        default() {
            return []
        }
    }
}
const emits = ['update:tagData', 'updateSuccess']
const setup = (prop, { emit }) => {
    const route = useRoute();
    const { proxy } = getCurrentInstance();
    const UploadFileValue = ref();
    const TagNameInputRef = ref();
    const show = ref(true);
    const formData = reactive({
        id: '',
        name: '',
        cover: '',
        suffix: '',
        watermark: 0,
    })
    const selectData = ref([]);
    const tagInput = ref('');
    const showInput = ref(false);
    // 显示新建标签输入框
    const handleShowInput = () => {
        showInput.value = true;
        nextTick(() => {
            TagNameInputRef.value?.focus()
        })
    }
    // 新建标签
    const handleCreateTag = (e) => {
        const tagData = [].concat(prop.tagData)
        const value = tagInput.value.trim();
        if (!value) {
            tagInput.value = "";
            showInput.value = false;
            return
        }
        for (const key in tagData) {
            if (tagData[key].title == value) {
                ElMessage.warning('已存在相同标签！');
                return
            }
        }
        const userAuthenticateId = route.params.id;
        createFileTag({ title: tagInput.value, fileClassification: prop.type, ifView: tagData.length >= 5 ? 0 : 1, userAuthenticateId }).then(res => {
            tagData.unshift(res.data.tag);
            handleCheckTag(res.data.tag)
            emit('update:tagData', tagData);
            tagInput.value = "";
            showInput.value = false;
        }).catch(err => {
            tagInput.value = "";
            showInput.value = false;
        })
    }
    // 删除标签
    const handleDeleteTag = (item, index) => {
        proxy.$modal.confirm({
            title: '删除标签',
            content: `确定要删除标签“${item.title}”吗？`,
            beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                    instance.confirmButtonLoading = true
                    deleteFileTag({ id: item.id }).then(res => {
                        done();
                        ElMessage.success('标签删除成功');
                        const tagData = [].concat(prop.tagData);
                        const data = tagData.splice(index, 1);
                        selectData.value = selectData.value.filter(tag => tag.id != data[0]?.id)
                        emit('update:tagData', tagData);
                    }).catch(err => {
                        done();
                    })
                } else {
                    if (instance.confirmButtonLoading) { return }
                    done()
                }
            }
        })
    }
    // 删除已选tag
    const handleDeleteSelectTag = (item) => {
        const data = selectData.value.map(tag => tag.id);
        const index = data.indexOf(item.id)
        data.splice(index, 1);
        handleUpdateWorkFile('tagIds', data).then(res => {
            selectData.value.splice(index, 1);
        })
    }
    // 选中标签
    const checkTag = (item) => {
        const index = selectData.value.findIndex((tag) => {
            return tag.id == item.id
        })
        return index > -1;
    }
    // 选中标签
    const handleCheckTag = (item) => {
        if (checkTag(item)) {
            handleDeleteSelectTag(item);
        } else {
            if (selectData.value.length >= 10) {
                ElMessage.warning('每个作品最多只能添加十个标签');
                return
            }
            const data = selectData.value.map(tag => tag.id);
            data.push(item.id)
            handleUpdateWorkFile('tagIds', data).then(() => {
                selectData.value.push(item);
            });
        }
    }
    // 上传文件
    const handleUploadFile = (e) => {
        const file = e.target.files[0];
        const type = file.type?.toLowerCase()
        if(file.size > 5 * 1024 * 1024 ){
            ElMessage.error('封面大小不能超过5M');
            return
        }
        if(file.type !== 'image/png' &&  file.type !== 'image/jpeg' && file.type !== 'image/jpg'){
            ElMessage.error('封面仅支持JPG、JPEG、PNG格式');
            return
        }
        const fileData = new FormData();
        fileData.append('file', file)
        publicUploadFile(fileData).then(res => {
            formData.cover = res.data.url;
            handleUpdateWorkFile();
        }).catch(err => {
            UploadFileValue.value.value = '';
        })
    }
    // 更新文件
    const handleUpdateWorkFile = async (e, d) => {
        try {
            const name = formData.name.trim();
            if (e == 'name') {
                if (!name) {
                    ElMessage.warning('请填写文件名称')
                    throw '请填写文件名称'
                }
            }
            const data = {
                id: formData.id,
                name: `${name}${formData.suffix}`,
                watermark: formData.watermark,
                cover: formData.cover,
                tagIds: e == 'tagIds' ? d.join(',') : selectData.value.map(item => item.id).join(','),
            }
            return await updateWorkFile(data).then(res => {
                emit('updateSuccess', data)
            })
        } catch (err) {
            if (e == 'watermark') {
                formData.watermark = formData.watermark ? 0 : 1;
            }
            return Promise.reject();
        }
    }

    // 点击上传
    const handleClickUpload = () => {
        UploadFileValue.value.click();
    }
    const getTags = (e) => {
        if (e) {
            const data = e.split(',');
            for (const item of tagData.value) {
                const index = data.indexOf(String(item.id))
                if (index > -1) {
                    data[index] = item;
                }
            }
            return data.filter(item => item?.id)
        } else {
            return []
        }
    }

    // 打开
    const open = (e, tags) => {
        const arr = e.filename.split('.');
        arr.pop()
        formData.id = e.id;
        formData.name = arr.join('.');;
        formData.cover = e.customizeCover;
        formData.suffix = e.suffix;
        formData.watermark = e.watermark;
        selectData.value = tags
        // show.value = true;
    }
    // 关闭
    const close = () => {
        formData.id = '';
        formData.name = '';
        formData.cover = '';
        formData.suffix = '';
        formData.watermark = 0;
        selectData.value = []
        // show.value = false;
    }
    return {
        show,
        open,
        close,
        checkTag,
        tagInput,
        formData,
        showInput,
        selectData,
        handleCheckTag,
        TagNameInputRef,
        handleShowInput,
        UploadFileValue,
        handleDeleteTag,
        handleCreateTag,
        handleUploadFile,
        handleClickUpload,
        handleUpdateWorkFile,
        handleDeleteSelectTag,
    }
}
export default defineComponent({
    setup,
    props,
    emits,
})
</script>

<style scoped lang="scss">
.composition_sider {
    width: 360px;
    flex: none;
    height: 100%;
    background: #1c1d24;
    overflow: hidden;
    transition: width 0.3s ease;
    &.hide {
        width: 0;
    }
    &-scrollbar {
        height: 100%;
        width: 360px;
        .line {
            margin: 0px -20px;
            height: 1px;
            background-color: #24262f;
        }
        .title {
            color: white;
            font-size: 18px;
            padding: 20px 0;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .setting-cover {
            width: 100%;
            height: 200px;
            position: relative;
            border-radius: 4px;
            overflow: hidden;
            &:hover {
                .upload-file-cover {
                    opacity: 0.8;
                }
            }
        }
        .upload-file-cover {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            transition: opacity 0.3s ease;
            background: #181920;
            border-radius: 4px;
            opacity: 0;
        }
        .upload-file-set {
            width: 100%;
            height: 200px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #181920;
            border-radius: 4px;
        }
        .tag-form {
            .tag-item {
                color: #9094a6;
                &.active {
                    border-color: #3468fe;
                    background: rgba($color: #3468fe, $alpha: 0.1);
                    color: white;
                    .custom-radio {
                        border-color: #3468fe;
                        flex: none;
                        &::after {
                            content: "";
                            display: block;
                            background: #3468fe;
                        }
                    }
                }
                &:hover {
                    border-color: #3468fe;
                }
                padding: 0 12px;
                user-select: none;
                cursor: pointer;
                height: 38px;
                line-height: 36px;
                border: 1px solid #3d3f50;
                border-radius: 4px;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                .tag-title {
                    padding: 0 10px;
                    font-size: 14px;
                    flex: auto;
                }
                .suffix-detele {
                    // color: #979797;
                    line-height: 38px;
                    cursor: pointer;
                    &:hover {
                        color: white;
                    }
                }
            }
            .custom-tag {
                margin-bottom: 10px;
                &:last-child {
                    margin-bottom: 0;
                }
            }

            .custom-radio {
                width: 14px;
                height: 14px;
                display: inline-block;
                // background: red;
                cursor: pointer;
                margin: auto 0;
                border: 1px solid #4e5262;
                border-radius: 10px;
                box-sizing: border-box;
                position: relative;
                &:hover {
                    border-color: #3468fe;
                }
                &.active {
                    border-color: #3468fe;
                    &::after {
                        content: "";
                        display: block;
                        background: #3468fe;
                    }
                }
                &::after {
                    content: "";
                    left: 2px;
                    top: 2px;
                    bottom: 2px;
                    right: 2px;
                    border-radius: 10px;
                    position: absolute;
                    display: block;
                }
            }
        }
        .check-tag-box {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-wrap: wrap;
            margin-left: -10px;
            &:deep(.el-tag) {
                font-size: 14px;
                height: 28px;
                padding: 0px 10px;
                margin-bottom: 10px;
                cursor: pointer;
                // background: ;
                --el-tag-bg-color: #24262f;
                --el-tag-border-color: #3d3f50;
                --el-tag-text-color: #676c7f;

                &:hover {
                    --el-tag-bg-color: rgba(52, 104, 254, 0.2);
                    --el-tag-border-color: rgba(52, 104, 254, 0.2);
                    --el-tag-text-color: rgba(52, 104, 254, 1);
                    --el-tag-hover-color: rgba(52, 104, 254, 1);
                }
            }
        }
    }
    &:deep(.composition_sider-view) {
        width: 100%;
        padding: 20px;
        .el-switch__label {
            color: #666a7a;
        }
        .el-input--prefix .el-input__inner {
            padding-left: 38px;
        }
        .el-input {
            --el-input-bg-color: #1e2028;
            --el-input-border-color: #3d3f50;
            --el-input-hover-border-color: #3468fe;
            font-size: 14px;
            line-height: 38px;
            .el-input__inner {
                height: 38px;
                --el-input-placeholder-color: #676c7f;
            }
            .el-input__count {
                .el-input__count-inner {
                    background: none;
                }
            }
            &.custom-input-title {
                .el-input__inner {
                    padding-right: 60px;
                }
            }
        }
    }
}
</style>