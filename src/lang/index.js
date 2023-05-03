// 多语言实例化文件
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEN from 'element-ui/lib/locale/lang/en' // 引入饿了么的英文包
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入饿了么的中文包
import customZH from './zh' // 自定义语言包
import customEN from './en'
Vue.use(VueI18n) // 完成VueI18n的注册
export default new VueI18n({
  locale: Cookies.get('language') || 'zh', // 指的是当前的多语言类型
  messages: { // 指的是当前的语言包
    en: {
      ...elementEN, // 语言包 elementUI 语言包 + 自定义语言包
      ...customEN
    },
    zh: {
      ...elementZH,
      ...customZH
    }
  }
})
