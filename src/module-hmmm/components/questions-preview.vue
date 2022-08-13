<template>
  <div class='container'>
    <el-dialog title="预览题目" :visible="isShow" width="800px" @close="closePreview">
      <el-row>
        <el-row class="que_type1">
          <el-col :span="6">
            【题型】:
            <span>{{ detailData.questionType }}</span>
          </el-col>
          <el-col :span="6">
            【编号】:
            <span>{{ detailData.id }}</span>
          </el-col>
          <el-col :span="6">
            【难度】:
            <span>{{ detailData.difficulty }}</span>
          </el-col>
          <el-col :span="6">
            【标签】:
            <span>{{ detailData.tags }}</span>
          </el-col>
        </el-row>
        <el-row class="que_type2">
          <el-col :span="6">
            【学科】:
            <span>{{ detailData.subjectID }}</span>
          </el-col>
          <el-col :span="6">
            【目录】:
            <span>{{ detailData.catalogID }}</span>
          </el-col>
          <el-col :span="6">
            【方向】:
            <span>{{ detailData.direction }}</span>
          </el-col>
        </el-row>
      </el-row>
      <hr>
      <el-row>
        <el-row>
          <el-button type="primary" plain circle size="mini" class="btnTip">简答</el-button>
          <span>{{ formMyData(detailData.question) }}</span>
        </el-row>
        <el-row>
          <!-- 选项：（以下选中的选项为正确答案） -->
          <!-- 单选 -->

          <el-radio-group :value="correctValue" v-if="detailData.questionType === '1'">
            <el-radio v-for="item in detailData.options" :key="item.code" :label="item.isRight">{{ item.title }}
            </el-radio>
          </el-radio-group>

          <!-- 多选 -->

          <el-checkbox-group v-else-if="detailData.questionType === '2'" :value="mulcorrectValue">
            <el-checkbox v-for="item in detailData.options" :key="item.code" :label="item.isRight">{{ item.title }}
            </el-checkbox>
          </el-checkbox-group>

          <!-- 简答 -->
          <el-row v-else-if="detailData.questionType === '3'">
            <span>{{ formMyData(detailData.answer) }}</span>
          </el-row>

        </el-row>
      </el-row>
      <hr>
      <el-row class="answer">
        【参考答案】：
        <el-button icon="el-icon-video-camera" type="success" round @click="showVideoFn">视频答案预览</el-button>
        <div class="demo">
          <video-player v-if="showVideo" class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true"
            :options="playerOptions">
          </video-player>
        </div>

      </el-row>
      <hr>
      <el-row>【答案解析】：{{ formMyData(detailData.answer) }}</el-row>
      <hr>
      <el-row>【题目备注】：{{ formMyData(detailData.remarks) }}</el-row>
      <div slot="footer" class="dialog-footer">

        <el-button type="primary" @click="closePreview">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { html2Text } from '@/utils/index.js'
export default {
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    detailData: {
      type: Object,
      required: true,
      default: () => { }
    },
    answerList: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data () {
    return {

      // 是否显示 视频播放器
      showVideo: false,

      // 视频播放器配置项
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选择的播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: 'video/mp4',
            src:
              'https://aliyun.oss.careyshop.cn/uploads/files/20191113/9bbf7ac9-a452-445b-8152-4443bc3505e8.mp4?type=aliyun'
          }
        ],
        poster: '', // 你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true // 全屏按钮
        }
      },

      // 单选 正确答案为1
      correctValue: 1,

      // 多选正确答案
      mulcorrectValue: [1]
    }
  },
  // 计算属性
  computed: {

  },
  methods: {

    // 显示播放器 并且 更改配置项
    showVideoFn () {
      this.playerOptions.sources.src = this.detailData.videoURL
      this.showVideo = true
    },
    // 题目类型
    typeSelect (val) {
      var questionType = null
      switch (val) {
        case 1:
          questionType = '单选'
          break
        case 2:
          questionType = '多选'
          break
        case 3:
          questionType = '简答'
      }
      return questionType
    },

    //
    closePreview () {
      this.$emit('closeFn')
    },
    formMyData (val) {
      return html2Text(val)
    }
  }
}
</script>

<style scoped lang='less'>
.btnTip{
  margin-right: 20px;
}
.que_type1 {
  margin: 15px 0 30px;
}

.que_type2 {
  margin-bottom: 10px;
}

.answer {
  margin: 10px 0 10px;
}
</style>
