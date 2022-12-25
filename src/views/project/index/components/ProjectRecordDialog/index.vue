<template>
    <el-dialog v-model="visible" width="860px" :close-on-press-escape="false" :title="'操作记录(' + title + ')'" :before-close="onBeforeClose" custom-class="dialog-center">
        <div v-loading="dialogLoading" element-loading-background="rgba(0, 0, 0, 0)">
            <el-form :inline="true" :model="formSearch">
                <el-form-item style="margin-right: 16px;">
                    <!-- 1创建项目 2上传 3下载 4复制 5移动 6删除 7分享 8项目归档 9邀请成员 10成员加入 11项目转让 12收集 -->
                    <el-select v-model="formSearch.type" @change="getData(true)" placeholder="操作类型" style="width: 130px;">
                        <el-option label="全部" value="" />
                        <el-option label="创建项目" value="1" />
                        <el-option label="上传" value="2" />
                        <el-option label="下载" value="3" />
                        <el-option label="复制" value="4" />
                        <el-option label="移动" value="5" />
                        <el-option label="删除" value="6" />
                        <el-option label="分享" value="7" />
                        <el-option label="项目归档" value="8" />
                        <el-option label="邀请成员" value="9" />
                        <el-option label="成员加入" value="10" />
                        <el-option label="项目转让" value="11" />
                        <el-option label="收集" value="12" />
                        <el-option label="版本合并" value="14" />
                        <el-option label="解除版本" value="15" />
                        <el-option label="上传版本" value="16" />
                    </el-select>
                </el-form-item>
                <el-form-item style="margin-right: 16px;">
                    <el-select v-model="formSearch.userId" @change="getData(true)" placeholder="操作成员" style="width: 130px;">
                        <el-option :value="''" label="全部"></el-option>
                        <template v-for="(item,index) in menberList" :key="index">
                            <el-option :value="item.userId" :label="item.user.nickName">
                                <div style="display:flex; align-items:center">
                                    <el-avatar style="flex:none; margin-right: 4px;" :size="30" :src="item.user.avatar"></el-avatar>
                                    <div style="flex:auto; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">{{item.user.nickName}}</div>
                                </div>
                            </el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item style="margin-right: 16px;">
                    <el-date-picker
                        v-model="formDate"
                        value-format="YYYY-MM-DD"
                        @change="getData(true)"
                        type="daterange"
                        placeholder="选择日期"
                        style="width: 350px;"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :disabled-date="forbiddenTime"
                    />
                </el-form-item>
            </el-form>
            <el-scrollbar height="500px">
                <div v-if="tableList.length > 0">
                    <div v-for="(item,index) in tableList" :key="index">
                        <div class="axis-item">
                            <div class="date-container">{{item[0]}}</div>
                            <div class="date-axis-spot bottom-line" :class="{'top-line':index != 0}"></div>
                        </div>
                        <div class="axis-item" v-for="(options,code) in item[1]" :key="index">
                            <div class="time-container">
                                <span class="time">{{options.time}}</span>
                                <el-avatar :size="30" :src="options.user.avatar"></el-avatar>
                                <div class="content">
                                    <p v-html="options.remark"></p>
                                    <!-- <span v-color="'#3468FE'">{{options.user.nickName}}</span> -->
                                </div>
                            </div>
                            <div class="time-axis-spot top-line" :class="{'bottom-line': !(code == (item[1].length - 1) && index == (tableList.length - 1))  }"></div>
                        </div>
                    </div>
                </div>
                <div v-else style="margin-top:100px;text-align:center">当前无记录</div>
                <!-- 
            <div class="axis-item">
                <div class="time-container">
                    <span class="time">14:51</span>
                    <el-avatar :size="30"></el-avatar>
                    <div class="content">
                        <span v-color="'#3468FE'">国宝国宝</span>通过网页创建了项目名字名字名字通过网页创建了项目名
                    </div>
                </div>
                <div class="time-axis-spot top-line bottom-line"></div>
            </div>
            <div class="axis-item">
                <div class="date-container">2022-06-11</div>
                <div class="date-axis-spot top-line bottom-line"></div>
            </div>
            <div class="axis-item">
                <div class="time-container">
                    <span class="time">14:51</span>
                    <el-avatar :size="30"></el-avatar>
                    <div class="content">
                        <span v-color="'#3468FE'">国宝国宝</span>通过网页创建了项目名字名字名字通过网页创建了项目名
                    </div>
                </div>
                <div class="time-axis-spot top-line "></div>
            </div> -->
            </el-scrollbar>
        </div>
    </el-dialog>
</template>
<script>
import { getProjectLog } from '@/api/project/project.js'
import { getProjectMemberList } from '@/api/project/menber'
import { defineComponent, reactive, ref } from "vue";
import { useStore } from 'vuex'
import { parseTime } from "@/utils/ruoyi";

const props = {
    projectId: {
        type: [Number, String],
        default: null
    }
}

const setup = (prop, { emit }) => {
    const store = useStore();
    const title = ref('');
    const visible = ref(false);
    const tableList = ref([]);
    const dialogLoading = ref(false);
    const menberList = ref([]);
    const formSearch = reactive({
        id: '',
        type: '',
        userId: '',
        startDate: '',
        endDate: '',
    })
    const formDate = ref([])
    const date = new Date();
    date.setDate((new Date().getDate() - 7))
    formDate.value = [
        parseTime(date.toJSON(), '{y}-{m}-{d}'),
        parseTime(new Date(), '{y}-{m}-{d}'),
    ]
    const onBeforeClose = (deno) => {
        if (dialogLoading.value) { return }
        formSearch.id = '';
        formSearch.type = '';
        formSearch.startDate = '';
        formSearch.endDate = '';
        formSearch.userId = '';
        if (typeof deno == 'function') {
            deno();
        } else {
            visible.value = false;
        }
    }
    const getData = async (e) => {
        if(e){ dialogLoading.value = true; }
        formSearch.startDate = `${formDate.value[0]} 00:00:00`
        formSearch.endDate = `${formDate.value[1]} 23:59:59`
        const res = await getProjectLog(formSearch);
        const obj = {};
        for (const item of res.data) {
            const splitB = item.createTime.split(' ');
            if (splitB[0]) {
                item['time'] = splitB[1];
                const data = JSON.parse(item.data);
                for (const key in data) {
                    item.remark = item.remark.replace(`{${key}}`, `<span style='color:#3468FE;'>${data[key]}</span>`);
                }
                if (obj[splitB[0]]) {
                    obj[splitB[0]].push(item)
                } else {
                    obj[splitB[0]] = [item]
                }
            }
        }
        tableList.value = Object.entries(obj);
        if(e){ dialogLoading.value = false; }
        return res;
    }

    const open = (project) => {
        if (dialogLoading.value) {
            return
        }
        tableList.value = [];
        visible.value = true;
        title.value = project.name;
        dialogLoading.value = true;
        formSearch.id = project.id;
        Promise.all([getData(), getProjectMemberList({ id: formSearch.id })]).then(result => {
            menberList.value = result[1].data;
            dialogLoading.value = false;
        }).catch(err => {
            dialogLoading.value = false;
        })
    }
    const forbiddenTime = (time) => {
        const end = new Date()
        end.setTime(end.getTime())
        return time.getTime() > end;
    }
    return {
        open,
        title,
        getData,
        visible,
        formDate,
        tableList,
        menberList,
        formSearch,
        forbiddenTime,
        dialogLoading,
        onBeforeClose,
    }
}

export default defineComponent({
    props,
    setup,
})
</script>
<style scoped lang="scss">
.axis-item {
    padding-left: 40px;
    padding-top: 10px;
    padding-bottom: 10px;
    position: relative;
    overflow: hidden;
    .date-container {
        padding: 7px 20px;
        border-radius: 8px;
        background: #f5f5f7;
        font-size: 14px;
        display: inline-block;
    }
    .time-container {
        padding: 7px 20px;
        display: flex;
        align-items: center;
        overflow: hidden;
        .time {
            flex-shrink: 0;
        }
        &:deep(.el-avatar) {
            flex-shrink: 0;
            margin: 0 10px;
        }
        .content {
            flex-grow: 1;
            // overflow: hidden;
            // text-overflow: ellipsis;
            // white-space: nowrap;
        }
    }
    .date-axis-spot {
        position: absolute;
        width: 11px;
        height: 11px;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        border-radius: 20px;
        border: 2px solid #cdcfd4;
        background: white;
        &.top-line {
            &::before {
                content: "";
                display: inline-block;
                position: absolute;
                border-left: 1px solid #cdcfd4;
                top: -102px;
                left: 3px;
                height: 100px;
            }
        }
        &.bottom-line {
            &::after {
                content: "";
                display: inline-block;
                position: absolute;
                border-left: 1px solid #cdcfd4;
                bottom: -102px;
                left: 3px;
                height: 100px;
            }
        }
    }
    .time-axis-spot {
        position: absolute;
        width: 5px;
        height: 5px;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        border-radius: 20px;
        border: 1px solid #cdcfd4;
        background: white;
        &.top-line {
            &::before {
                content: "";
                display: inline-block;
                position: absolute;
                border-left: 1px solid #cdcfd4;
                top: -101px;
                left: 1px;
                height: 100px;
            }
        }
        &.bottom-line {
            &::after {
                content: "";
                display: inline-block;
                position: absolute;
                border-left: 1px solid #cdcfd4;
                bottom: -101px;
                left: 1px;
                height: 100px;
            }
        }
    }
}
</style>