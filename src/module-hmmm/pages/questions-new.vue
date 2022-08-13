<template>
  <div class="container">
    <el-row>
      <el-col :span="24" class="col">
        <el-card class="box-card">
          <!-- 头部 -->
          <div slot="header" class="clearfix">
            <span>试题录入</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text"
              >操作按钮</el-button
            > -->
          </div>
          <!-- 主体内容 -->
          <el-form
            :model="entryForm"
            :rules="entryRules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <!-- 学科 -->
            <el-form-item label="学科" prop="subjectID">
              <el-select
                filterable
                class="select"
                v-model="entryForm.subjectID"
                placeholder="请选择"
                @change="subjectChange"
              >
                <el-option
                  v-for="item3 in subjectList"
                  :key="item3.value"
                  :label="item3.label"
                  :value="item3.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- 目录 -->
            <el-form-item label="目录" prop="catalogID">
              <el-select
                filterable
                class="select"
                v-model="entryForm.catalogID"
                placeholder="请选择"
              >
                <el-option
                  v-for="item4 in directorysList"
                  :key="item4.value"
                  :label="item4.label"
                  :value="item4.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- 企业 -->
            <el-form-item label="企业" prop="enterpriseID">
              <el-select
                filterable
                class="select"
                v-model="entryForm.enterpriseID"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item6, index6) in companyList"
                  :key="index6"
                  :label="item6.company"
                  :value="item6.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- 城市 -->
            <el-form-item label="城市" prop="province">
              <!-- 省 -->
              <el-select
                filterable
                v-model="entryForm.province"
                placeholder="请选择省份"
                style="margin-right: 20px"
                @change="provinceChange"
              >
                <!-- 循环遍历省 -->
                <el-option
                  v-for="(item, index) in provincesList"
                  :key="index"
                  :value="item"
                  :label="item"
                ></el-option>
              </el-select>
              <!-- 市 -->
              <el-select
                v-model="entryForm.city"
                filterable
                placeholder="请选择区域"
              >
                <el-option
                  v-for="(item1, index1) in citysList"
                  :key="index1"
                  :label="item1"
                  :value="item1"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- 方向 -->
            <el-form-item label="方向" prop="direction">
              <el-select
                filterable
                class="select"
                v-model="entryForm.direction"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item5, index5) in direction"
                  :key="index5"
                  :label="item5"
                  :value="item5"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- 题型 -->
            <el-form-item label="题型" prop="questionType">
              <el-radio-group v-model="entryForm.questionType">
                <el-radio
                  v-for="(item7, index7) in typeList"
                  :key="index7"
                  :label="item7.label"
                  :value="item7.value"
                ></el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 难度 -->
            <el-form-item label="难度" prop="difficulty">
              <el-radio-group v-model="entryForm.difficulty">
                <el-radio
                  v-for="(item8, index8) in difficultyList"
                  :key="index8"
                  :label="item8.label"
                  :value="item8.value"
                ></el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 题干-富文本编辑器 -->
            <el-form-item label="题干" class="richtext" prop="question">
              <RichText
                class="richText"
                v-model="entryForm.question"
                @focus="onEditorFocus()"
                @change="onEditorChange()"
                @blur="onEditorBlur()"
              />
            </el-form-item>

            <!-- 选项 -->
            <el-form-item label="选项" class="options">
              <el-radio-group
                v-model="entryForm.options.code"
                v-for="(item9, index9) in optionsList"
                :key="index9"
                class="group"
              >
                <el-radio :label="item9.code">
                  <span>{{ item9.code }}</span>
                  <el-input
                    v-model="item9.title"
                    style="width: 240px"
                  ></el-input>
                  <el-upload
                    class="upload"
                    action="http://jsonplaceholder.typicode.com/posts/"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatatUpload"
                  >
                    <span>上传图片</span>
                    <img src="#" />
                    <i class="el-icon-circle-close"></i>
                  </el-upload>
                </el-radio>
              </el-radio-group>

              <el-button type="danger" plain disabled
                >+增加选项与答案</el-button
              >
            </el-form-item>

            <!-- 解析视频 -->
            <el-form-item label="解析视频" prop="videoURL">
              <el-input class="select" v-model="entryForm.videoURL"></el-input>
            </el-form-item>

            <!-- 答案解析-富文本编辑器 -->
            <el-form-item label="答案解析" class="richtext" prop="answer">
              <RichText
                class="richText"
                v-model="entryForm.answer"
                @focus="onEditorFocus()"
                @change="onEditorChange()"
                @blur="onEditorBlur()"
              />
            </el-form-item>

            <!-- 题目备注 -->
            <el-form-item label="题目备注" prop="remarks">
              <el-input
                type="textarea"
                class="select"
                v-model="entryForm.remarks"
              ></el-input>
            </el-form-item>

            <!-- 试题标签 -->
            <el-form-item label="试题标签" prop="tags">
              <el-select
                v-model="entryForm.tags"
                multiple
                filterable
                default-first-option
                placeholder="请选择"
              >
                <el-option
                  v-for="item9 in tagsList"
                  :key="item9.id"
                  :label="item9.tagName"
                  :value="item9.tagName"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')"
                >确认提交</el-button
              >
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 富文本组件
import RichText from '../components/rich-text'
// 省市的JS文件
import { provinces, citys } from '@/api/hmmm/citys.js'
// 学科的接口
import { simple } from '@/api/hmmm/subjects.js'
// 目录的接口
import { directorysSimple } from '@/api/hmmm/directorys.js'
// 方向的JS文件
import { direction, questionType, difficulty } from '@/api/hmmm/constants.js'
// 企业的接口
import { getCompanyListAPI } from '@/api/hmmm/companys'
// 标签管理的接口
import { getTags } from '@/api/hmmm/tags'
export default {
  components: {
    RichText
  },
  mounted () {
    // console.log(provinces())
    // console.log(citys('北京市'))
    this.getSubject() // 获取学科列表
    this.getCompanyListAPI()
    console.log(getTags())
  },
  computed: {
    // 省
    provincesList () {
      return provinces()
    },
    // 市
    citysList () {
      return citys(this.entryForm.province)
    }
  },
  data () {
    return {
      // 试题录入-form表单
      entryForm: {
        subjectID: '', // 学科
        catalogID: '', // 目录
        enterpriseID: '', // 企业
        province: '', // 城市-省
        city: '', // 城市-市
        direction: '', // 方向
        questionType: '单选', // 题型
        difficulty: '简单', // 难度
        question: '请输入题干内容', // 题干
        options: {
          // 选项
          code: '',
          title: '',
          img: '',
          isRight: false
        },
        videoURL: '', // 解析视频
        answer: '', // 答案解析
        remarks: '', // 题目备注
        tags: '' // 试题标签
      },
      // 试题录入-表单校验规则
      entryRules: {
        subjectID: [{ required: true, message: '请选择学科', trigger: 'blur' }],
        catalogID: [{ required: true, message: '请选择目录', trigger: 'blur' }],
        enterpriseID: [
          { required: true, message: '请选择企业', trigger: 'blur' }
        ],
        province: [{ required: true, message: '请选择省', trigger: 'blur' }],
        city: [{ required: true, message: '请选择区域', trigger: 'blur' }],
        direction: [{ required: true, message: '请选择方向', trigger: 'blur' }],
        question: [{ required: true, message: '请输入题干', trigger: 'blur' }]
      },
      subjectList: [], // 学科的数组
      directorysList: [], // 目录的数组
      direction: direction, // 方向的数组
      companyList: [], // 企业的数组
      typeList: questionType, // 题型的数组
      difficultyList: difficulty, // 难度的数组
      tagsList: [], // 试题标签的数组
      optionsList: [
        {
          // 选项数组
          code: 'A',
          title: '1111',
          img: '',
          isRight: false
        },
        {
          code: 'B',
          title: '2222',
          img: '',
          isRight: false
        },
        {
          code: 'C',
          title: '3333',
          img: '',
          isRight: false
        },
        {
          code: 'D',
          title: '4444',
          img: '',
          isRight: false
        }
      ]
    }
  },
  methods: {
    // 省的下拉菜单变化的时候
    provinceChange () {
      console.log(this.entryForm.province)
    },
    // 学科下拉的时候触发
    subjectChange () {
      this.getDirectorysSimple()
      this.getTags()
    },
    // 富文本的事件
    onEditorFocus () {},
    onEditorChange () {},
    onEditorBlur () {},
    // 提交重置按钮
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 调用学科的
    async getSubject () {
      try {
        const data = await simple()
        if (data.status !== 200) {
          return new Promise(new Error('11'))
        }
        this.subjectList = data.data
      } catch (error) {
        console.log(error)
      }
    },
    // 调用目录的
    async getDirectorysSimple () {
      try {
        const { data } = await directorysSimple(this.entryForm.subjectID)
        this.directorysList.push(...data)
      } catch (error) {
        console.log(error)
      }
    },
    // 获取企业的
    async getCompanyListAPI () {
      try {
        const {
          data: { items }
        } = await getCompanyListAPI()
        // console.log(items)
        this.companyList.push(...items)
      } catch (error) {
        console.log(error)
      }
    },
    // 获取标签
    async getTags () {
      try {
        const {
          data: { items }
        } = await getTags(this.entryForm.subjectID)
        this.tagsList.push(...items)
      } catch (error) {
        console.log(error)
      }
    },
    // on-success文件上传成功时的钩子
    handleAvatarSuccess () {},
    /// before-upload上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    beforeAvatatUpload () {}
  }
}
</script>

<style scoped lang="scss">
.container {
  .col {
    height: 100%;
    padding: 10px;
    border-radius: 10px;
  }
  .select {
    width: 463px;
  }
  // 富文本
  .richtext {
    width: 100%;
    // padding: 0 55px;
    // height: 500px;
  }
  .options {
    display: flex;
    flex-direction: column;

    // .group{
    //   // width: 200px;
    //   // background-color: pink;
    // }
  }

  .upload {
    position: relative;
    left: 285px;
    top: -48px;
    width: 100px;
    height: 50px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    span {
      line-height: 60px;
      position: relative;
      left: 20px;
      text-align: center;
    }
    i {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
  height: 100%;
}
</style>
