<template>
	<div class="invite-container">
		<div class="title">
			<span class="title-left">当前代理等级:</span>
			<span class="title-tip">VIP</span>
			<span class="title-right">代理时间到:2023-08-12</span>
		</div>
		<div class="mid">
			<div class="mid-box">
				<div class="mid-box-top">
					<div>!!!!</div>
				</div>
				<div class="mid-box-bottom">
					<div>33333</div>
				</div>
			</div>
			<!-- <div class="mid-left">
				<div class="top-title">推广方式：</div>
				<div class="mode1">
					<div class="number">1</div>
					<div>
						<div>邀请码</div>
						<div class="code">{{ promoteInfo.number || '00000' }}</div>
					</div>
				</div>
				<div class="mode2">
					<div class="number">2</div>
					<div>
						<div>邀请链接</div>
						<div class="link">{{ promoteInfo.url||'获取中...' }}</div>
						<div class="copy" @click="copyUrl(promoteInfo.url)">复制链接</div>
					</div>
				</div>
			</div> -->
			<!-- <div class="mid-right">
          <div class="number">3</div>
          <div>
            <div class="QRcode">
              <div class="code2" v-loading="!promoteInfo.qrcode">
                <el-image v-if="promoteInfo.qrcode" :src="promoteInfo.qrcode"></el-image>
              </div>
            </div>
            <div class="copy" @click="downloadFun(promoteInfo.qrcode)">下载二维码</div>
          </div>
        </div> -->
			<!-- <div class="mid-right-right">
				<div class="title">会员推广说明：</div>
				<div class="text">1.推广的说明文案，推广的说明文案，推广的说明文案推广的说明文案推广的说明文案推广的说</div>
				<div class="text">2.不要有多长写多长，占满一整行，视觉看上去太长太累，像第一行长度就差不多了。</div>
				<div class="text">
					3.三行不要一样长，很呆很傻。2、这里可以放会员推广的政策说明这里可以放会员推广的政策说明。这里可以放会员推广的政策说明这里可以放会员推广的政策说明这里可以放会员推广的政策说明这里可以放会员推广的政策说明这里可以放会员推广的政策说明这里可以放会员推广的政策说明
				</div>
			</div> -->
		</div>
		<div class="btm">
			<div class="title">成功推广记录：</div>
			<div class="btm-table">
				<div class="table-header">
					<div class="col1">ID</div>
					<div class="col1">用户名</div>
					<div class="col1">时间</div>
					<div class="col4">会员状态</div>
				</div>
				<div class="table-main" v-if="promoteList.length > 0">
					<div class="table-item" v-for="item in promoteList" :key="item">
						<div class="col1">{{ item.number }}</div>
						<div class="col1">{{ item.nickname }}</div>
						<div class="col1">{{ item.createTime }}</div>
						<div class="col4">{{ item.status===1? "注册会员":"个人vip会员" }}</div>
					</div>
				</div>
				<div class="table-empty" v-else>
					<div>您还没有成功推广记录哦</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
import { myPromoteInfo, myPromoteList } from "@/api/user/promotion";
import { ref } from "vue";
import { ElMessage } from 'element-plus'
import useClipboard from 'vue-clipboard3'
const promoteList = ref([])
/**
 * 获取邀请列表
 */
const getMyPromoteList = () => {
	myPromoteList().then(res => {
		promoteList.value = res.rows;
	});
}
getMyPromoteList();
/**
 * 获取用户邀请信息
 */
const promoteInfo = ref({})
const getMyPromoteInfo = () => {
	myPromoteInfo().then(res => {
		promoteInfo.value = res.data;
	});
}
getMyPromoteInfo();

/**
 * 复制URL
 */
const { toClipboard } = useClipboard();
const copyUrl = async (url) => {
	try {
		await toClipboard(url)
		ElMessage.success('复制成功');
	} catch (err) {
		ElMessage.error('复制失败');
	}
}
const dataURLtoBlob = (base64Str) => {
	let parts = base64Str.split(';base64,')
	let contentType = parts[0].split(':')[1]
	let raw = window.atob(parts[1]) // 解码base64得到二进制字符串
	let rawLength = raw.length
	let uInt8Array = new Uint8Array(rawLength) // 创建8位无符号整数值的类型化数组
	for (let i = 0; i < rawLength; ++i) {
		uInt8Array[i] = raw.charCodeAt(i) // 数组接收二进制字符串
	}
	return new Blob([uInt8Array], { type: contentType })
}

const downloadFun = (base64) => {
	const blob = dataURLtoBlob(base64)
	const link = document.createElement('a')
	link.style.display = 'none'
	link.href = URL.createObjectURL(blob)
	link.setAttribute('download', promoteInfo.value.number + '-邀请码.png')
	document.body.appendChild(link)
	link.click()
}

</script>
<style scoped lang="scss">
@import '../style.scss';

.invite-container {
	padding: 20px 24px;
	font-size: 14px;
	font-weight: 400;
	color: rgba(255, 255, 255, 0.50);
	line-height: 16px;
	flex: 1;
	display: flex;
	flex-direction: column;

	.title {
		margin-bottom: 14px;

		.title-left {
			color: #ffffff;
			font-weight: 400;
			font-size: 16px;
		}

		.title-tip {
			color: #F88212;
			font-size: 16px;
			font-weight: 100;
			margin-left: 12px;
		}

		.title-right {
			color: #9094A6;
			font-size: 14px;
			margin-left: 20px;
		}
	}

	.mid {
		height: auto;
		background: #1C1D24;
		box-shadow: 0px 0px 4px 0px rgba(52, 48, 227, 0.0500);
		border-radius: 8px;
		border: 1px solid #2B2D36;
		margin-bottom: 20px;
		padding: 20px;
		display: flex;

		.mid-box {
			width: 1120px;
			height: 236px;
			display: flex;
			flex-direction: column;

			.mid-box-top {
				flex: 2;
			}

			.mid-box-bottom {
				flex: 3;
			}
		}

		.number {
			width: 34px;
			height: 34px;
			background: #30323B;
			border-radius: 34px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 24px;
			margin-right: 20px;
		}

		.copy {
			font-weight: 500;
			color: #53a8ffc2;
			line-height: 21px;
			cursor: pointer;
			margin-top: 10px;
		}

		.mid-left {
			width: 45%;

			.mode1 {
				display: flex;

				.code {
					font-size: 24px;
					font-weight: 500;
					color: #FFFFFF;
					line-height: 36px;
					margin-top: 16px;
				}
			}

			.mode2 {
				display: flex;
				margin-top: 33px;

				.link {
					color: #FFFFFF;
					line-height: 21px;
					margin-top: 12px;
					margin-bottom: 12px;
				}
			}
		}

		.mid-right {
			width: 20%;
			display: flex;
			margin-top: 32px;
			text-align: center;

			.QRcode {
				width: 130px;
				height: 130px;
				background: #4E5262;
				border-radius: 8px;
				border: 1px solid #676C7F;
				display: flex;
				align-items: center;
				justify-content: center;

				.code2 {
					width: 114px;
					height: 114px;
					background: #FFFFFF;
					border-radius: 8px;
					font-size: 16px;
					font-weight: bold;
					color: #2D2D2D;
					line-height: 24px;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
		}

		.mid-right-right {
			width: 35%;
		}
	}

	.btm {
		background: #1C1D24;
		box-shadow: 0px 0px 4px 0px rgba(52, 48, 227, 0.0500);
		border-radius: 8px;
		border: 1px solid rgba(43, 45, 54, 0.98);
		padding: 20px;
		flex: 1;

		.btm-table {
			height: 90%;

			.table-header {
				margin-top: 24px;
				display: flex;

				.col1 {
					width: 29%;
				}

				.col4 {
					width: 13%;
				}
			}

			.table-main {
				margin-top: 27px;
				font-weight: 600;
				color: #FFFFFF;
				line-height: 24px;

				.table-item {
					display: flex;
					padding: 10px 3px;
					border-radius: 5px;

					&:hover {
						background: #ecf5ff2a;
					}

					.col1 {
						width: 29%;
					}

					.col4 {
						width: 13%;
					}
				}
			}

			.table-empty {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 100%;
			}
		}
	}
}
</style>
