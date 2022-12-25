
export default [
    {
        name: '抖音',
        number: -1,
        platformType: 1,
        iconClass: 'douyin',
        buttonType: 'scan',

    },
    {
        name: '快手',
        number: -1,
        platformType: 2,
        iconClass: 'kuaishou',
        buttonType: 'scan',
    },
    // {
    //     name: 'bilibili',
    //     number: -1,
    //     platformType: 7,
    //     iconClass: 'bilibili',
    //     buttonType: 'scan',
    // },
    {
        name: '网易云音乐',
        number: -1,
        platformType: 4,
        iconClass: 'wangyiyun',
        buttonType: 'link',
        articleId: '1593055547791347713'
    },
    // {
    //     name: 'QQ音乐',
    //     number: -1,
    //     platformType: 3,
    //     iconClass: 'qqyinyue',
    //     buttonType: 'link',
    // },
    {
        name: '微博',
        number: -1,
        platformType: 15,
        iconClass: 'weibo',
        buttonType: 'scan',
    },
    {
        name: '酷我音乐',
        number: -1,
        platformType: 8,
        iconClass: 'kuwoyinyue',
        buttonType: 'link',
        articleId: '1593057860060811265'
    },
    {
        name: '喜马拉雅',
        number: -1,
        platformType: 6,
        iconClass: 'ximalaya',
        buttonType: 'link',
        articleId: '1593057454431047682'
    },
    {
        name: '站酷',
        number: -1,
        platformType: 9,
        iconClass: 'zhanku',
        buttonType: 'link',
        articleId: '1593057335195373570'
    },
    {
        name: '猫耳',
        number: -1,
        platformType: 10,
        iconClass: 'maoer',
        buttonType: 'link',
        articleId: '1593057571502460929'
    },
    {
        name: '知乎',
        number: -1,
        platformType: 11,
        iconClass: 'zhihu',
        buttonType: 'link',
        articleId: '1593057224272809985'
    },
    {
        name: '5sing',
        number: -1,
        platformType: 12,
        iconClass: 'sing5',
        buttonType: 'link',
        articleId: '1593057988609216513'
    },
    {
        name: '古田路9号',
        number: -1,
        platformType: 13,
        iconClass: 'gutianlu9hao',
        buttonType: 'link',
        articleId: '1593057705119027201'
    },
]

export const FansEcharts = (echartsObject,indicator,value) => {
    // 拷贝数组
    let tempArr = Array.from(value)
    // 数组内最大值
    let maxNum = tempArr.sort((a, b) => b - a)[0]
    
    const indicatorData = indicator.map((item, index)=>{
        let itemMaxNum = 0 // 该项最大值
        let current = value[index] // 当前值
        let ratio = current / maxNum // 比值
        if (current == 0) {
            itemMaxNum = maxNum
        } else if (ratio < 0.2) {
            // 样式优化处理
            itemMaxNum = current * 5
        }

        return {
            name: item.name,
            max: ratio > 0.2 ? maxNum : itemMaxNum,
        }
    })
    // echart 参数
    const fansOption = {
        credits: { enabled: false },
        tooltip: {
            show: true,
            trigger: 'item'
        },
        radar: {
            center: ['50%', '50%'],
            splitNumber: 6,
            indicator:indicatorData,
            // 字体颜色
            axisName: {
                color: 'transparent'
            },
            // 背景颜色
            splitArea: {
                areaStyle: {
                    color: ['#20222A', '#17181E'],
                    shadowColor: 'rgba(255, 255, 255, 0)',
                    shadowBlur: 10
                }
            },
            // 直线颜色+字体颜色
            axisLine: {
                lineStyle: {
                    color: `#ffffff10`
                },
            },
            splitLine: {
                lineStyle: {
                    color: `#ffffff00`
                }
            }
        },
        series: {
            type: 'radar',
            // radarIndex: 1,
            data: [
                {
                    name: '粉丝数据',
                    value,
                    label: {
                        color: '#428BD4',
                        show: true,
                        position: "insideBottomRight",
                        formatter: function (params) {
                            // 在一万后面加上w
                            let num = params.value;
                            if (num >= 10000) {
                                num = Math.round(num / 1000) / 10 + 'w';
                            } else if (num >= 1000) {
                                // num = Math.round(num/100)/10 + 'k';
                            }
                            return num;
                        }
                    }
                },
            ],
            lineStyle: {
                color: 'rgba(52,104,254,0.4)'
            },
            areaStyle: { // 单项区域填充样式
                color: 'rgba(52,104,254,0.4)',
            }
        }
    };
    echartsObject.setOption(fansOption);
}