<template>
  <div class="container">
    <el-card body-style>
      <el-row>
        <el-col :span="18">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="关键字" label-width="80px">
              <el-input
                v-model="keyword"
                placeholder="根据文章标题搜索"
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item label="状态" label-width="80px">
              <el-select v-model="state" placeholder="请选择" size="small">
                <el-option label="启用" value="1"></el-option>
                <el-option label="禁用" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button @click="onClear" size="small">清除</el-button>
              <el-button type="primary" @click="onSearch" size="small"
                >搜索</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6">
            <el-button
              type="success"
              size="small"
              style="float: right"
              :inline="true"
              icon="el-icon-edit"
              @click="addArticles"
              >新增技巧</el-button>
        </el-col>
      </el-row>
      <el-alert
        :title="`数据一共${page.counts}条`"
        type="info"
        show-icon
        style="margin-bottom: 15px"
        :closable="false"
      ></el-alert>
      <template>
        <el-table :data="list" style="width: 100%">
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column label="文章标题" width="400">
            <template slot-scope="scope">
              <span>{{ scope.row.title }}</span>
              <a class="el-icon-film" style="color:blue;font-size: 18px;" v-show="scope.row.videoURL" @click="openVideo"></a>
              <div class="mask" v-if="videoState == true" @click="closeVideo"></div>
              <div class="videomasks" v-if="videoState == true">
              <video :src="`${scope.row.videoURL}`" controls autoplay width="100%" height="100%"></video>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="visits" label="阅读数" width="173">
          </el-table-column>
          <el-table-column prop="username" label="录入人" width="172">
          </el-table-column>
          <el-table-column prop="createTime" label="录入时间" width="172">
            <template slot-scope="{ row }">{{ row.createTime | dateForm }}</template>
          </el-table-column>
          <el-table-column prop="state" label="状态" width="100" :formatter="showState">
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="text" size="medium" @click="previewArticles(scope.row)">预览</el-button>
              <el-button type="text" size="medium" @click="changeState(scope.row)">{{scope.row.state ? '禁用' : '启用'}}</el-button>
              <el-button type="text" size="medium" :disabled="scope.row.state === 0" @click="editArticles(scope.row)">修改</el-button>
              <el-button type="text" size="medium" :disabled="scope.row.state === 0" @click="removeArticles(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.page"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="page.pagesize"
          background
          :total="page.counts"
          layout="prev, pager, next, sizes, jumper"
        >
        </el-pagination>
      </div>
      <articles-add ref="addArt" :show-dialog.sync="showDialog" @addArt="addArticles"></articles-add>
      <articles-preview ref="preArt" :showdialogVisible.sync="dialogVisible"></articles-preview>
    </el-card>
  </div>
</template>

<script>
import { list, remove, changeState } from '../../api/hmmm/articles'
import articlesAdd from '../components/articles-add.vue'
import articlesPreview from '../components/articles-preview.vue'
export default {
  components: { articlesAdd, articlesPreview },
  data () {
    return {
      keyword: '',
      state: '',
      page: {
        page: 1,
        pagesize: 10,
        counts: 0
      },
      list: [],
      filterList: [],
      showDialog: false,
      textState: '',
      dialogVisible: false,
      videoState: false
    }
  },
  created () {
    this.getList()
  },
  methods: {
    onSearch () {
      if (this.keyword === '' && this.state === '') {
        this.getList()
      } else if (this.keyword !== '' && this.state === '') {
        this.list = this.filterList.filter(item => item.title.includes(this.keyword))
      } else if (this.keyword === '' && this.state !== '') {
        this.list = this.filterList.filter(item => item.state + '' === this.state)
      } else if (this.keyword !== '' && this.state !== '') {
        this.list = this.filterList.filter(item => item.title.includes(this.keyword) && item.state + '' === this.state)
      }
      this.page.counts = this.list.length
      console.log(this.state)
    },
    onClear () {
      this.keyword = ''
      this.state = ''
    },
    // 获取文章列表
    async getList () {
      const { data } = await list(this.page)
      this.filterList = data.items
      this.list = data.items
      this.page.counts = data.counts
      // console.log(this.list)
    },
    // 分页尺寸变化
    handleSizeChange (val) {
      this.page.pagesize = val
      if (this.page.page === 1) {
        this.getList(this.page)
      }
    },
    // 分页目录变化
    handleCurrentChange (val) {
      this.page.page = val
      this.getList()
    },
    // 状态值显示转换
    showState (row) {
      if (row.state === 0) {
        return '已禁用'
      } else if (row.state === 1) {
        return '已启用'
      }
    },
    // 删除文章列表
    removeArticles (data) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await remove(data)
        await this.getList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 新增文章
    addArticles (data) {
      this.getList()
      this.showDialog = true
    },
    // 编辑文章
    editArticles (data) {
      this.$refs.addArt.getDetail(data)
      this.showDialog = true
    },
    // 预览文章
    previewArticles (data) {
      this.$refs.preArt.getDetail(data)
      this.dialogVisible = true
    },
    async changeState (data) {
      data.state = data.state ? 0 : 1
      await changeState(data)
      this.getList()
    },
    openVideo () {
      this.videoState = true
    },
    closeVideo () {
      this.videoState = false
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  margin: 10px;
}
.pagination {
  margin-top: 20px;
  text-align: right;
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color:rgba(0, 0, 0, 0.05);
}
.videomasks {
  width: 800px;
  height: 600px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-10%,-50%)
}
</style>
