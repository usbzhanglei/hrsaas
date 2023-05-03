<template>
  <!-- 工作日历 -->
  <div>
    <!-- 年和月 -->
    <el-row type="flex" justify="end">
      <el-select v-model="currentYear" size="small" style="width: 120px;" @change="dataChange">
        <el-option v-for="item in yearList" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="currentMonth" size="small" style="width: 120px;margin-left: 10px;" @change="dataChange">
        <el-option v-for="item in 12" :key="item" :label="item" :value="item" />
      </el-select>
    </el-row>
    <!-- 日历组件 -->
    <el-calendar v-model="currentDate">
      <template #dateCell="{ date, data }">
        <div class="date-content">
          <span class="text">{{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  // 组件名称
  name: '',
  // 局部注册的组件
  components: {},
  filters: {
    getDay(value) {
      const day = value.split('-')[2] // 08  18
      return day.startsWith('0') ? day.substr(1) : day // 8 18
    }
  },
  // 组件参数 接收来自父组件的数据
  props: {
    startDate: {
      type: Date,
      default: () => new Date()
    }
  },
  // 组件状态值
  data() {
    return {
      yearList: [],
      currentYear: null,
      currentMonth: null,
      currentDate: null
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
  * 组件实例创建完成，属性已绑定，但DOM还未生成，el属性还不存在
  */
  created() {
    this.currentMonth = this.startDate.getMonth() + 1
    this.currentYear = this.startDate.getFullYear()
    this.yearList = Array.from(Array(11), (value, index) => index + this.currentYear - 5)
    this.dataChange()
  },
  /**
  * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
  * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
  */
  mounted() {},
  // 组件方法
  methods: {
    dataChange() {
      this.currentDate = new Date(`${this.currentYear}-${this.currentMonth}-1`)
    },
    isWeek(value) {
      return value.getDay() === 6 || value.getDay() === 0
    }
  }
}
</script>
<style  scoped>
 /* /deep/ 如果报了语法错误，那么改成::v-deep这种写法就不报错了 */
 ::v-deep .el-calendar-day {
  height:  auto;
 }
 ::v-deep .el-calendar-table__row td,::v-deep .el-calendar-table tr td:first-child,  ::v-deep .el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
::v-deep .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
 ::v-deep .el-calendar__header {
   display: none
 }
</style>
