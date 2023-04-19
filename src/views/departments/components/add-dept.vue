<template>
  <!-- 放置弹层组件 -->
  <el-dialog
    :title="showTitle"
    :visible="showDialog"
    @close="btnCancel"
  >
    <!-- 表单数据 -->
    <el-form ref="deptForm" abel-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width: 80%;" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width: 80%;" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <!-- native会找到原生元素的事件 -->
        <el-select v-model="formData.manager" style="width: 80%;" placeholder="请选择" @focus="getEmployeeSimple">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width: 80%;" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- 确认和提交 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button type="primary" size="small" @click="btnOK">确认</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartment, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  // 组件名称
  name: '',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  // 组件状态值
  data() {
    // 检测部门名称是否重复
    const checkNameRepeat = async(rule, value, callback) => {
      // value是部门名称 要去同级部门下的部门去比较  没用相同的 才能过
      const { depts } = await getDepartment()
      // depts是所有的部门数据
      // 如何去找技术部所有的子节点
      let isRepeat = false
      if (this.formData.id) {
        // 有id编辑模式
        // 编辑是数据在数据库有  同级部门下 我的名字不能和其他部门的名字重复
        // isRepeat = depts.filter(item => item.pid === this.treeNode.id) 一样
        isRepeat = depts.filter(item => item.pid === this.formData.pid && item.id !== this.formData.id).some(item => item.name === value)
      } else {
        // 没有id 新增
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      // 如果isRepeat为true 表示找到了一样的名字
      isRepeat ? callback(new Error(`同级部门下已经存在${value}部门了`)) : callback()
    }
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartment()
      // 要求编码 和所有的部门都不能重复 由于历史数据可能没用code 所有加一个强制性条件 value不能为空
      let isRepeat = false
      if (this.formData.id) {
        // 有id编辑模式
        // 不能有一样的code
        isRepeat = depts.filter(item => item.id !== this.formData.id).some(item => item.code === value && value)
      } else {
        // 没有id 新增
        isRepeat = depts.some(item => item.code === value && value)
      }

      isRepeat ? callback(new Error(`组织架构下已经存在这个${value}编码了`)) : callback()
    }
    return {
      // 定义一个表单数据
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称在1-50之间', trigger: 'blur' },
          { trigger: 'blur', validator: checkNameRepeat }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码在1-50之间', trigger: 'blur' },
          { trigger: 'blur', validator: checkCodeRepeat }
        ],
        manager: [
          { required: true, message: '部门管理者不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍在1-300之间', trigger: 'blur' }
        ]
      },
      peoples: []
    }
  },
  // 计算属性
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增子部门'
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
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    btnOK() {
      this.$refs.deptForm.validate(async isOK => {
        if (isOK) {
          if (this.formData.id) {
            // 编辑
            await updateDepartments(this.formData)
          } else {
            // 表单校验通过
            // 将ID设置为子元素的pid
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }
          // 告诉父组件更新数据
          this.$emit('addDepts')
          // 此时应该修改showDialog的值
          // update:props名称
          this.$emit('update:show-dialog', false)
        }
      })
    },
    btnCancel() {
      // 重置数据  因为resetFields() 只能重置 表单上的数据 非表单上的 比如 id 不能重置
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 关闭弹层
      this.$emit('update:show-dialog', false)
      // 清除之前的校验
      this.$refs.deptForm.resetFields()
    },
    // 获取详情方法
    async getDepartDetail(id) {
      // 因为我们是父组件调用子主键的方法 先设置了node 数据 直接调用方法
      // props传值是异步的
      this.formData = await getDepartDetail(id)
    }
  }
}
</script>

<style scoped lang="less">

</style>
