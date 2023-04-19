<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
          <tree-tools slot-scope="{ data }" :tree-node="data" @editDepts="editDepts" @addDepts="addDepts" @delDepts="getDepartment" />
        </el-tree>
      </el-card>
    </div>
    <!-- 新增弹出组件 -->
    <add-dept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartment" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import { getDepartment } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import addDept from './components/add-dept.vue'
export default {
  components: {
    TreeTools,
    addDept
  },
  data() {
    return {
      // list: [
      //   {
      //     name: '张三',
      //     name1: '张三11',
      //     child: [{ name: '李四' }]
      //   }
      // ],
      departs: [],
      defaultProps: {
        label: 'name'
      },
      company: {
        name: '',
        manager: ''
      },
      showDialog: false, // 默认不显示弹层
      node: null // 记录当前点击的node节点
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    async getDepartment() {
      const result = await getDepartment()
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(result.depts, '')
      console.log(result)
    },
    // 监听tree-tools中触发的点击添加子部门的事件
    // node是我们点击的部门
    addDepts(node) {
      this.showDialog = true // 显示弹层
      this.node = node
    },
    editDepts(node) {
      this.showDialog = true
      this.node = node
      // 获取部门详情
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }
}
</script>

<style>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>
