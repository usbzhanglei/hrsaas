<template>
  <div>
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :class="{ disable : fileComputed }"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" :percentage="percent" style="width: 180px;" />
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img :src="imgUrl" alt="" style="width: 100%;">
    </el-dialog>
  </div>

</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDjIh5iAPUKwKUTYdfUhhWAcsvnTxD9uRl', // 身份识别 ID
  SecretKey: '81Zv32nz2ua4KOGwRjsrlTzJQN8g196q' // 身份密钥
})
export default {
  // 组件名称
  name: '',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data() {
    return {
      showPercent: false,
      fileList: [],
      showDialog: false,
      imgUrl: '',
      currentFileUid: '', // 记录当前正在上传的uid
      percent: 0 // 进度条百分比
    }
  },
  // 计算属性
  computed: {
    // 如果为true表示就不应该显示加号上传了
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
  * 组件实例创建完成，属性已绑定，但DOM还未生成，el属性还不存在
  */
  created() {},
  /**
  * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
  * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
  */
  mounted() {},
  // 组件方法
  methods: {
    preview(file) {
      this.imgUrl = file.url
      this.showDialog = true
    },
    // file 是点击删除的文件
    // fileList 是删过后的文件
    handleRemove(file, fileList) {
      // 两种方法都可以
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      // this.fileList = fileList
    },
    // 不能又push 因为这个钩子会执行多次
    changeFile(file, fileList) {
      // file是当前的文件 fileList是当前的最新数组
      this.fileList = fileList.map(item => item)
      // 修改文件时触发
      // 此时可以用fileList 因为该方法会进来很多遍 不能每次都去push
      // fileList因为fileList参数是当前传进来的最新参数 我们只需要将其转化成数组即可 需要转化成一个新的数组
      // [] => [...fileList] [] => fileList.map()
      // 上传成功之后 还会进来 需要实现上传代码的逻辑 这里才会成功
    },
    beforeUpload(file) {
      // 先检测文件的类型
      const type = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      console.log(11)
      if (!type.some(item => item === file.type)) {
        // 如果不存在
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false // 终止上传
      }
      // 检测文件大小
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        // 超过了限制文件的大小
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      // 显示进度条
      this.showPercent = true
      // 当校验通过之后切记一定要return true 放行，允许上传
      this.currentFileUid = file.uid
      return true
    },
    // 进行上传操作
    upload(params) {
      if (params.file) {
        // 如果存在文件 执行上传
        cos.putObject({
          // 存储桶名称
          Bucket: 'images-1318020983',
          // 存储桶所在地域
          Region: 'ap-chengdu',
          Key: params.file.name, // 文件名
          Body: params.file, // 要上传的文件对象,
          StorageClass: 'STANDARD', // 上传的模式类型 默认标准模式
          // 上传的进度
          onProgress: (params) => {
            this.percent = params.percent * 100
          }
        }, (err, data) => {
          // data 返回数据之后
          // console.log(data)
          if (!err && data.statusCode === 200) {
            //   此时说明文件上传成功  要获取成功的返回地址
            // fileList才能显示到上传组件上 此时我们要将fileList中的数据的url地址变成 现在上传成功的地址
            // 目前虽然是一张图片 但是请注意 我们的fileList是一个数组
            // 需要知道当前上传成功的是哪一张图片
            this.fileList = this.fileList.map(item => {
              if (item.uid === this.currentFileUid) {
                return { url: 'http://' + data.Location, upload: true }
              }
              return item
            })
            // 关闭进度条 重置百分比
            setTimeout(() => {
              this.showPercent = false
              this.percent = 0
            }, 1000)
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.disable /deep/.el-upload--picture-card{
  display: none;
}
</style>
