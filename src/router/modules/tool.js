import Layout from '@/layout'

const pre = 'tool'
export default [{
    path: '/tool',
    component: Layout,
    hidden: true,
    meta: {title: '工具'},
    redirect: `/${pre}/index`,
    children: [{
        path: 'index',
        name: `${pre}-index`,
        meta: {
            title: '工具', activeMenu: `/${pre}`
        },
        components: {
            default: () => import('@/views/tool/index/index'),


        },
        redirect: `/${pre}/index/toolbox/-1`,
        children: [{
            path: 'toolbox/:tool',
            name: `${pre}-toolbox`,
            meta: {title: '工具箱'},
            component: () => import('@/views/tool/toolbox/index')
        }, {
            path: 'record',
            name: `${pre}-record`,
            meta: {title: '招募管理'},
            component: () => import('@/views/tool/record/index')
        }, {
            path: 'VoiceAccompanySeparation',
            name: `${pre}-VoiceAccompanySeparation`,
            meta: {title: '人声伴奏分离'},
            component: () => import('@/views/tool/tooldetails/VoiceAccompanySeparation/index')
        },{
            path: 'InstrumentSeparation',
            name: `${pre}-InstrumentSeparation`,
            meta: {title: '音乐乐器分离'},
            component: () => import('@/views/tool/tooldetails/InstrumentSeparation/index')
        },{
            path: 'AudioPop',
            name: `${pre}-AudioPop`,
            meta: {title: 'MP3转MIDI'},
            component: () => import('@/views/tool/tooldetails/AudioPop/index')
        },{
            path: 'OldImageColor',
            name: `${pre}-OldImageColor`,
            meta: {title: '老照片上色'},
            component: () => import('@/views/tool/tooldetails/OldImageColor/index')
        },{
            path: 'ImageEnlarge',
            name: `${pre}-ImageEnlarge`,
            meta: {title: '图片放大'},
            component: () => import('@/views/tool/tooldetails/ImageEnlarge/index')
        },
            {
                path: 'VideoTransform',
                name: `${pre}-VideoTransform`,
                meta: {title: '视频格式转换'},
                component: () => import('@/views/tool/tooldetails/VideoTransform/index')
            },
            {
                path: 'VideoCompact',
                name: `${pre}-VideoCompact`,
                meta: {title: '视频压缩'},
                component: () => import('@/views/tool/tooldetails/VideoCompact/index')
            },
            {
                path: 'VideoSplice',
                name: `${pre}-VideoSplice`,
                meta: {title: '视频剪切'},
                component: () => import('@/views/tool/tooldetails/VideoSplice/index')
            },
            {
                path: 'VideoJoint',
                name: `${pre}-VideoJoint`,
                meta: {title: '视频拼接'},
                component: () => import('@/views/tool/tooldetails/VideoJoint/index')
            },
            {
                path: 'VideoAudio',
                name: `${pre}-VideoAudio`,
                meta: {title: '视频声音提取'},
                component: () => import('@/views/tool/tooldetails/VideoAudio/index')
            },
            {
                path: 'VideoH264',
                name: `${pre}-VideoH264`,
                meta: {title: '视频转码H264'},
                component: () => import('@/views/tool/tooldetails/VideoH264/index')
            },
            {
                path: 'VideoGIF',
                name: `${pre}-VideoGIF`,
                meta: {title: '视频生成预览GIF'},
                component: () => import('@/views/tool/tooldetails/VideoGIF/index')
            },
            {
                path: 'VideoAddWmk',
                name: `${pre}-VideoAddWmk`,
                meta: {title: '视频添加水印'},
                component: () => import('@/views/tool/tooldetails/VideoAddWmk/index')
            },
            {
                path: 'VideoResolution',
                name: `${pre}-VideoResolution`,
                meta: {title: '视频分辨率转换'},
                component: () => import('@/views/tool/tooldetails/VideoResolution/index')
            },
            {
                path: 'AISinging',
                name: `${pre}-AISinging`,
                meta: {title: 'AI歌声合成'},
                component: () => import('@/views/tool/tooldetails/AISinging/index')
            },
            {
                path: 'AudioWatermark',
                name: `${pre}-AudioWatermark`,
                meta: {title: 'AI歌声合成'},
                component: () => import('@/views/tool/tooldetails/AudioWatermark/index')
            },
            {
                path: 'SvgToPng',
                name: `${pre}-SvgToPng`,
                meta: {title: 'Svg转Png'},
                component: () => import('@/views/tool/tooldetails/SvgToPng/index')
            },
            {
                path: 'SpeechSynthesis',
                name: `${pre}-SpeechSynthesis`,
                meta: {title: '语音合成'},
                component: () => import('@/views/tool/tooldetails/SpeechSynthesis/index')
            },
            {
                path: 'AudioToFormat',
                name: `${pre}-AudioToFormat`,
                meta: {title: '音频格式转换'},
                component: () => import('@/views/tool/tooldetails/AudioToFormat/index')
            },
            {
                path: 'musicdecrypt',
                name: `${pre}-musicdecrypt`,
                meta: {title: '音频解密'},
                component: () => import('@/views/tool/musicdecrypt/index')
            },{
                path: 'PdfToPng',
                name: `${pre}-PdfToPng`,
                meta: {title: '音频解密'},
                component: () => import('@/views/tool/tooldetails/PdfToPng/index')
            },{
                path: 'voiceToText',
                name: `${pre}-voiceToText`,
                meta: {title: '语音转文字'},
                component: () => import('@/views/tool/tooldetails/VoiceToText/index')
            },
        ]
    },]
}]
