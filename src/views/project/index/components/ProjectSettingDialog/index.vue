<template>
    <div class="setting-dialog">
        <el-dialog v-model="settingDialog" width="530px" custom-class="dialog-center" :before-close="onBeforeClose" :title="projectId?'项目设置':'创建项目'" :close-on-press-escape="false">
            <el-form :model="settingForm" ref="settingFormRef">
                <el-form-item prop="name" :rules="[{required:true,message:'请填写项目名称',trigger:'blur'}]">
                    <el-input v-model="settingForm.name" show-word-limit :maxlength="30" class="is-custom" placeholder="输入项目名称" />
                </el-form-item>
                <el-form-item prop="colorTag" label="标记" v-if="!projectId">
                    <div class="point-box">
                        <template v-for="(item,index) in colorTypes" :key="index">
                            <Point :type="item" :active="item == settingForm.colorTag" size="medium" hoverActive @click="handleSelectColor(item)" custom-class="point-custom"></Point>
                        </template>
                    </div>
                </el-form-item>
                <el-form-item prop="antiScreenRecording" label="是否防录屏">
                    <div class="sett-item">
                        <el-tooltip class="box-item" effect="dark" content="开启后项目及分享的所有视频将显示防录屏浮标" placement="top" :show-after="400">
                            <el-icon style="color: #d8d8d8">
                                <QuestionFilled />
                            </el-icon>
                        </el-tooltip>
                        <div class="sett-item-right">
                            <el-switch :active-value="1" active-color="#3A36DB" :inactive-value="0" v-model="settingForm.antiScreenRecording" />
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="身份权限设置">
                    <div class="sett-item">
                        <el-tooltip class="box-item" effect="dark" content="项目拥有者拥有所有权限，管理员和成员即代表有相关权限" placement="top" :show-after="400">
                            <el-icon style="color: #d8d8d8">
                                <QuestionFilled />
                            </el-icon>
                        </el-tooltip>
                        <div @click="showMore = !showMore" class="sett-item-right" style="cursor: pointer; align-self:stretch;">
                            <el-icon v-if="!showMore">
                                <ArrowRight />
                            </el-icon>
                            <el-icon v-else>
                                <ArrowDown />
                            </el-icon>
                        </div>
                    </div>
                </el-form-item>
                <template v-if="showMore">
                    <el-form-item :label="item.title" v-for="(item,index) in settingForm.permissions" :key="index">
                        <div class="sett-item">
                            <el-tooltip effect="dark" :content="item.tooltipContent" placement="top" :show-after="400">
                                <el-icon class="tooltip-icon">
                                    <QuestionFilled />
                                </el-icon>
                            </el-tooltip>
                            <div class="sett-item-right">
                                <el-checkbox-group v-model="item.value" fill="#3468FE">
                                    <el-checkbox label="adminPermissions" :disabled="item.adminPermissions">管理员</el-checkbox>
                                    <el-checkbox label="memberPermissions" :disabled="item.memberPermissions">成员</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                    </el-form-item>
                </template>
            </el-form>
            <template #footer>
                <span class="dialog-footer" v-if="projectId">
                    <el-button type="default" class="is-custom" @click="emit('transferProject',{id:projectId,type:projectType})">转让并退出项目</el-button>
                    <el-button type="danger"  class="is-custom" @click="emit('deleteProject',{id:projectId,type:projectType})">删除项目</el-button>
                    <el-button type="primary" class="is-custom" @click="handleSaveSetting('completeUpdate')" :loading="loading.completeUpdate" >保存设置</el-button>
                </span>
                <span class="dialog-footer" v-else>
                    <el-button type="default" class="is-custom" @click="handleSaveSetting('completeCreate')" :loading="loading.completeCreate">完成创建</el-button>
                    <el-button type="primary" class="is-custom" @click="handleSaveSetting('invitationCreate')" :loading="loading.invitationCreate">创建并邀请成员</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import { ElMessage, ElLoading } from "element-plus";
import { getProjectDetails } from "@/api/project/project.js";
import { nextTick, defineComponent, reactive } from "vue";

const mounted = () => {
    // 更新项目

}

const props = {
    projectId: {
        type: [Number, String],
        default: null,
    },
    projectType: {
        type: [Number, String],
        default: null,
    }
}

const emits = ['completeCreate', 'invitationCreate', 'deleteProject','completeUpdate' ,'transferProject']

const setup = (prop, { emit }) => {
    const store = useStore();
    const showMore = ref(false);
    const loading = reactive({
        invitationCreate: false,
        completeCreate: false,
        completeUpdate: false
    })
    const colorTypes = ['none', 'orange', 'yellow', 'lightblue', 'blue', 'green', 'danger'];
    const permissions = [
        {
            key: "member",
            title: "成员管理",
            memberPermissions: true,
            tooltipContent: "允许指定身份成员可以进行移除成员与变更成员身份",
            value: ['adminPermissions'],
        },
        // {
        //   key: "info",
        //   title: "自定义信息",
        //   tooltipContent: "允许指定身份成员有编辑右侧栏自定义信息的权限",
        //   value:['adminPermissions'],
        // },
        // {
        //   key: "info",
        //   title: "收集文件",
        //   tooltipContent: "允许指定身份成员有发起收集文件的权限",
        //   value:['adminPermissions'],
        // },
        {
            key: "invite",
            title: "邀请加入",
            tooltipContent: "允许指定身份成员邀请外部人员加入项目",
            value: ['adminPermissions', 'memberPermissions'],
        },
        {
            key: "download",
            title: "下载文件",
            tooltipContent: "允许指定身份成员有下载文件的权限",
            value: ['adminPermissions', 'memberPermissions'],
        },
        {
            key: "share",
            title: "分享文件",
            tooltipContent: "允许指定身份成员有分享文件的权限",
            value: ['adminPermissions', 'memberPermissions'],
        },
        {
            key: "copy",
            title: "复制/移动文件",
            tooltipContent: "允许指定身份成员将文件复制/移动到自己的项目中",
            value: ['adminPermissions', 'memberPermissions'],
        },
        {
            key: "delete",
            title: "删除/恢复文件",
            tooltipContent: "允许指定身份成员可以删除/恢复文件或文件夹",
            value: ['adminPermissions', 'memberPermissions'],
        },
    ]
    const settingDialog = ref(false);
    const settingFormRef = ref(null);
    const settingForm = reactive({
        name: "",
        colorTag: "none",
        antiScreenRecording: 0,
        permissions
    });

    const onBeforeClose = (deno) => {
        settingFormRef.value.resetFields();
        if (typeof deno == 'function') {
            deno()
        } else {
            settingDialog.value = false;
        }
    }
    // 选择颜色
    const handleSelectColor = (type) => {
        settingForm.colorTag = type;
    }
    let antiScreenRecording;
    const open = () => {
        if (prop.projectId) {
            getProjectDetails({ id: prop.projectId }).then((res) => {
                settingDialog.value = true;
                nextTick(() => {
                    const result = res.data;
                    settingForm.name = result.name;
                    settingForm.colorTag = result.colorTag;
                    settingForm.antiScreenRecording = result.antiScreenRecording;
                    antiScreenRecording = result.antiScreenRecording;
                    if (result.permissions.adminPermissions.length > 0) {
                        permissions.forEach((item, index) => {
                            const values = [];
                            if (result.permissions.adminPermissions.indexOf(item.key) > -1) {
                                values.push('adminPermissions')
                            }
                            if (result.permissions.memberPermissions.indexOf(item.key) > -1) {
                                if(item.key !== 'member'){
                                    values.push('memberPermissions')
                                }
                            }
                            settingForm.permissions[index].value = values;
                        })
                    }
                });
            })
        } else {
            settingDialog.value = true;
            permissions.forEach((item, index)=>{
                const values = [];
                values.push('adminPermissions')
                if(item.key !== 'member'){
                    values.push('memberPermissions')
                }
                settingForm.permissions[index].value = values;
            })
        }
    }

    const handleSaveSetting = (type) => {
        if (!settingForm.name && prop.projectId) {
            settingForm.name = '未命名项目'
        }
        settingFormRef.value.validate(async vali => {
            try {
                if (vali) {
                    const adminArr = permissions.filter(item => item.value.indexOf('adminPermissions') > -1 ).map(item => item.key);
                    const memberArr = permissions.filter(item => item.value.indexOf('memberPermissions') > -1 ).map(item => item.key);
                    const params = {
                        id: prop.projectId,
                        name: settingForm.name,
                        colorTag: settingForm.colorTag,
                        antiScreenRecording: settingForm.antiScreenRecording,
                        permissions: {
                            adminPermissions: adminArr || [],
                            memberPermissions: memberArr || [],
                        },
                    };

                    if (prop.projectId) {
                        loading[type] = true;
                        await store.dispatch('project/handleupdateProject', params)
                        if (antiScreenRecording != settingForm.antiScreenRecording) {
                            await store.dispatch('project/handleGetFiles');
                        }
                        loading[type] = false;
                        ElMessage({
                            message: "项目保存成功",
                            type: "success",
                        });
                        emit('completeUpdate', { id: prop.projectId, type: prop.projectType });
                        onBeforeClose();
                    } else {
                        if (type !== 'completeCreate' && type !== 'invitationCreate') {
                            return
                        }
                        loading[type] = true;
                        const result = await store.dispatch('project/handleAddProject', params)
                        loading[type] = false;
                        onBeforeClose();
                        ElMessage({
                            message: "项目创建成功",
                            type: "success",
                        });
                        emit(type, result.data);
                    }
                }
            } catch (err) {
                loading[type] = false;
            }
        })
    }

    return {
        emit,
        loading,
        showMore,
        colorTypes,
        settingForm,
        settingDialog,
        settingFormRef,

        open,
        onBeforeClose,
        handleSaveSetting,
        handleSelectColor,
    }
}

export default defineComponent({
    emits,
    props,
    setup,
})

</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>
