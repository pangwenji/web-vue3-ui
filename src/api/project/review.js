import request from "@/utils/request";
const prefix = "/project";

// 视频截帧
export function getVideoFrame(data) {
  return request({
    url: `${prefix}/projectReview/videoFrame`,
    headers: {
      isToken: true,
    },
    method: "post",
    data,
  });
}
