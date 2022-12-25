<template>
  <!-- 卡片风格 -->
  <el-col
    :xl="4"
    :lg="6"
    :span="6"
    :style="{maxWidth: width,flex:width?('0 0 ' + width) : false}"
    style="padding-left:10px;padding-right:10px;"
    v-if="layoutType == 'card'"
    v-contextmenu:contextmenuRef
  >
    <div
      class="file-item-card"
      :class="{ dragAction, dragOverAction, 'files-folder': (type == 'folder' || data.type === 1) }"
      :draggable="isDraggable && !showCheck && !showInput"
      @click.stop="handleDetail"
      @mouseover="data['checkBox'] = true"
      @mouseleave="data['checkBox'] = false"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
      @drop="handleDrop"
    >
      <div
        class="folder-icon"
        :class="{ check: data['check'] || dragAction || dragOverAction }"
        v-if="type == 'folder'"
      ></div>
      <div class="file-item-content" :class="{ check: data['check'] }">
        <div
          class="check-mask"
          @click.stop="handleCheck"
          v-if="showCheck"
        ></div>
        <div
          class="file-check"
          :class="{ check: data['check'] }"
          @dblclick.stop="false"
          @click.stop="handleCheck"
          v-if="data['checkBox'] || showCheck"
        >
          <el-icon class="icon">
            <Check />
          </el-icon>
        </div>
        <div
          class="file-item-cover file-item-video"
          v-if="type == 'video'"
          @mousemove="handleMouseMoveVideo"
        >
          <div
            class="sprite"
            :style="{
              width: `${viewWidth}px`,
              height: `${viewHeight}px`,
              'background-image': 'url(' + data.spriteImage + ')',
              'background-position-y': '-' + String(offsetY) + 'px',
            }"
          ></div>
          <div
            class="cover"
            :style="{ 'background-image': `url(${data.cover})` }"
          ></div>
          <div class="time">{{ secondToDate(data.metaData?.Duration) }}</div>
          <!-- <div class="mark">防</div> -->
          <div class="coding" v-if="data.codingStatus ===1">转码中</div>
          <div class="coding" v-else-if="data.codingStatus !==2">转码失败</div>
          <div class="play">
            <el-icon> <VideoPlay /> </el-icon>
          </div>
          <div class="progress">
            <div
              :style="{ width: String(percentage) + '%' }"
              class="progress-outer"
            ></div>
          </div>
        </div>
        <div
          class="file-item-cover file-item-image"
          v-else-if="type == 'image'"
        >
          <FileType type="url" fit="cover" :url="data.cover"></FileType>
        </div>
        <div
          class="file-item-cover file-item-bg file-item-audio"
          v-else-if="type == 'audio'"
        >
          <div class="type-image">
            <FileType :type="type"></FileType>
          </div>
          <div class="coding" v-if="data.codingStatus ===1">转码中</div>
          <div class="coding" v-else-if="data.codingStatus !==2">转码失败</div>
          <div class="time">{{ secondToDate(data.metaData?.Duration) }}</div>
        </div>
        <div
          class="file-item-cover file-item-folder"
          v-else-if="type === 'folder' || data.type === 1"
        >
          <!-- <div class="type-image">
            <FileType type="folder"></FileType>
          </div> -->
          <div class="left">
            <template v-if="folderPreview(data.cover)[0]">
              <FileType :type="folderPreview(data.cover)[0].t === 'suffix' ? folderPreview(data.cover)[0].v : folderPreview(data.cover)[0].t" :url="folderPreview(data.cover)[0].v" ></FileType>
            </template>
          </div>
          <div class="right">
            <div class="right-top">
              <template v-if="folderPreview(data.cover)[1]">
                <FileType :type="folderPreview(data.cover)[1].t === 'suffix' ? folderPreview(data.cover)[1].v : folderPreview(data.cover)[1].t" :url="folderPreview(data.cover)[1].v" ></FileType>
              </template>
            </div>
            <div class="right-bottom">
              <template v-if="folderPreview(data.cover)[2]">
                <FileType :type="folderPreview(data.cover)[2].t === 'suffix' ? folderPreview(data.cover)[2].v : folderPreview(data.cover)[2].t" :url="folderPreview(data.cover)[2].v" ></FileType>
              </template>
            </div>
          </div>
        </div>
        <div class="file-item-cover file-item-bg file-item-documen" v-else>
          <div class="type-image">
            <FileType :type="type"></FileType>
          </div>
          <div class="edit" v-if="data.isEditable">可编辑</div>
        </div>
        <div v-show="!showInput" class="file-item-info">
          <div class="detail">
            <div class="title" @click.stop="handleInput(data.name, data.suffix)">
              {{ data.name }}
            </div>
          </div>
          <div
            class="menu-open"
            @click.stop="false"
            v-contextmenu:contextmenuRef="{ trigger: 'click' }"
          >
            <el-icon>
              <MoreFilled />
            </el-icon>
          </div>
        </div>
        <div v-show="showInput" style="margin-top:6px;">
          <el-input @click.stop="" maxlength="30" v-model="InputValue" @blur="showInput = false" @change="handleRenameChange" ref="inputText" :placeholder="data.type === 1?'请输入文件夹名称':'请输入文件名称'"></el-input>
        </div>
      </div>
    </div>
  </el-col>

  <!-- 列表风格 -->
  <el-col
    v-else
    :span="24"
    class="file-table-tr"
    :class="{ dragAction, dragOverAction, check: data['check'] }"
    :draggable="isDraggable && !showCheck && !showInput"
    @click.stop="handleDetail"
    @mouseover="data['checkBox'] = true"
    @mouseleave="data['checkBox'] = false"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @drop="handleDrop"
    v-contextmenu:contextmenuRef
  >
    <div
      class="file-table-td file-name"
      style="width: 48%; position: relateve; z-index: 9"
    >
      <div
        class="file-check"
        :class="{ check: data['check'] }"
        @dblclick.stop="false"
        @click.stop="handleCheck"
        v-if="data['checkBox'] || showCheck"
      >
        <el-icon class="icon">
          <Check />
        </el-icon>
      </div>
      <div class="file-cover">
        <FileType v-if="type == 'video' || type == 'image'" type="url" :url="data.cover"></FileType>
        <FileType :type="type" v-else></FileType>
      </div>
      <div class="info">
        <div v-show="!showInput" class="title">
          <span class="name" @click.stop="handleInput(data.name, data.suffix)">{{ data.name }}</span>
        </div>
        <div v-show="showInput">
          <el-input @click.stop="" maxlength="30" v-model="InputValue" @blur="showInput = false" @change="handleRenameChange" ref="inputText" :placeholder="data.type === 1?'请输入文件夹名称':'请输入文件名称'"></el-input>
        </div>
      </div>
    </div>
    <div class="file-table-td" style="width: 10%">
      <span v-if="type == 'folder'">文件夹</span>
      <span v-else>{{ data.suffix || '--' }}</span>
    </div>
    <div v-if="type !== 'folder'" class="file-table-td" style="width: 10%">
      <span>{{ formatSize(data.size) }}</span>
    </div>
    <div class="file-table-td" style="width: 10%">
      <span>{{ data.user?.nickName || userName }}</span>
    </div>
    <div class="file-table-td" style="width: 18%">
      <span>{{ data.createTime }}</span>
    </div>
    <div class="file-table-td file-action" :style="{width: type !== 'folder'?'4%' : '14%', 'text-align': 'end', 'padding-right':'30px'}">
      <span v-contextmenu:contextmenuRef="{ trigger: 'click' }">
        <el-icon>
          <MoreFilled />
        </el-icon>
      </span>
    </div>
  </el-col>

  <v-contextmenu :disabled="checkLength > 1" :width="140" ref="contextmenuRef">
    <v-contextmenu-item @click="handleDetail">
      <i class="cm-icon icon-view"></i>
      <span>查看详情</span>
    </v-contextmenu-item>
    <v-contextmenu-item @click="handleShare(data)">
      <i class="cm-icon icon-share"></i>
      <span>分享</span>
    </v-contextmenu-item>
    <v-contextmenu-item v-if="data.type === 2" @click="handleDownload(data)">
      <i class="cm-icon icon-download"></i>
      <span>下载</span>
    </v-contextmenu-item>
    <v-contextmenu-item @click="handleCopy(data)">
      <i class="cm-icon icon-copy"></i>
      <span>复制到</span>
    </v-contextmenu-item>
    <v-contextmenu-item @click="handleMove(data)">
      <i class="cm-icon icon-move"></i>
      <span>移动到</span>
    </v-contextmenu-item>
    <v-contextmenu-item @click="handleInput(data.name, data.suffix)">
      <svg-icon iconClass="icon_renamed" :size="20" ></svg-icon>
      重命名
    </v-contextmenu-item>
    <v-contextmenu-item @click="handleDelete(data)">
      <i class="cm-icon icon-delete"></i>
      <span>删除</span>
    </v-contextmenu-item>
  </v-contextmenu>
</template>
<script setup>
import { secondToDate, formatSize } from '@/utils/tool.js';
import FileType from '@/components/FileType';
import { ElMessage } from 'element-plus'
const router = useRouter();

const props = defineProps({
  type: {
    type: String,
    default: '',
  },
  data: {
    type: Object,
    default: {},
  },
  layoutType: {
    type: String,
    default: 'crad',
  },
  showCheck: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    default: '',
  },
  checkLength: {
    type: Number,
    default: 0,
  },
  isDraggable: {
    type: Boolean,
    default: false,
  }
});
const isCheck = ref(false);

const store = useStore()
const contextmenuRef = ref('');
const showInput = ref(false)
const InputValue = ref('')

const emits = defineEmits([
  'onCheck',
  'share',
  'download',
  'prevent',
  'copy',
  'move',
  'delete',
  'onOpenFolder',
  'onChangeRadio',
  'onRename',
  'onDragStart',
  'onDrop',
]);

const userName = computed(() => {
  return store.state.user.name
})

// 鼠标移动时计算雪碧图
const offsetY = ref(0);
const viewWidth = ref(0);
const viewHeight = ref(0);
const percentage = ref(0);
const handleMouseMoveVideo = (e) => {
  const spriteImageInfo = JSON.parse(props.data.spriteImageInfo || '{}');
  const imageWidth = spriteImageInfo.width || 240; //雪碧图每一帧的宽度
  const imageHeight = spriteImageInfo.height || 6750; //雪碧图每一帧的高度
  const offsetX = e.offsetX;
  const offsetWidth = e.target.getBoundingClientRect().width.toFixed(2); //展示窗口宽度
  const offsetHeight = e.target.getBoundingClientRect().height.toFixed(2); //展示窗口高度
  const imageScale = imageWidth / imageHeight;
  const offsetScale = offsetWidth / offsetHeight;
  if (imageScale > offsetScale) {
    viewWidth.value = offsetWidth;
    viewHeight.value = viewWidth.value / imageScale;
  } else {
    viewHeight.value = offsetHeight;
    viewWidth.value = imageScale * viewHeight.value;
  }

  const N = 100; //数量
  const NS = offsetWidth / N;
  const steep = offsetWidth / 100;
  offsetY.value = viewHeight.value * Math.round(offsetX / NS);
  percentage.value = offsetX / steep; //得到当前进度
};

function handleDetail() {
  if (props.type == 'folder') {
    emits('onOpenFolder', props.data);
  } else {
    router.push({ path: '/clouddisk/detail/' + props.data.id, query: {fileCat: props.data.fileCat} });
  }
}

// 点击选择check
function handleCheck() {
  props.data['check'] = !props.data['check'];
  emits('onCheck', props.data);
}

// 单选
const handleRadio = () => {
  props.data['check'] = true;
  emits('onChangeRadio', props.data);
};

function handleShare(val) {
  emits('share', val);
}

function handleDownload(val) {
  emits('download', val);
}

function handlePrevent(val) {
  emits('prevent', val);
}

function handleCopy(val) {
  emits('copy', val);
}

function handleMove(val) {
  emits('move', val);
}

function handleDelete(val) {
  emits('delete', val);
}

// 文件夹内容展示
const folderPreview = (cover) => {
  if (cover) {
    return JSON.parse(cover);
  } else {
    return [];
  }
};

// 重命名
const inputText = ref('')
const handleInput = (name, suffix) => {
  const index = name.indexOf(suffix);
  InputValue.value = props.data.type === 1? name : name.substring(0, index);
  showInput.value = true;
  nextTick(() => {
    inputText.value.select();
  });
};

// 重命名提交
const handleRenameChange = () => {
  if (InputValue.value === '') {
    ElMessage.error('名字不能为空')
    return;
  }
  emits('onRename', {id: props.data.id, name: InputValue.value + props.data.suffix, type:  props.data.type})
}

const dragAction = ref(false); //拖拽对象改变样式
const dragOverAction = ref(false); //拖拽进入当前对象改变样式
function handleDragStart() {
  dragAction.value = true
  emits('onDragStart', props.data)
}

function handleDragOver(e) {
  e.preventDefault();
  dragOverAction.value = true;
}

function handleDragLeave(e) {
  e.preventDefault();
  dragOverAction.value = false;
}

function handleDragEnd() {
  dragAction.value = false
  dragOverAction.value = false
}

// 拖拽放入
function handleDrop() {
  dragAction.value = false;
  dragOverAction.value = false;
  emits('onDrop', props.data)
}

</script>
<style scoped lang="scss">
@import './style.scss';
</style>
