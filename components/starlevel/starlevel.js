// components/starlevel/starlevel.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    score: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    width: 0,
    stars: [1,2,3,4,5]
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    created () {},
    attached () {},
    ready () {
      this.setData({
        width: (this.properties.score / 2 - Number.parseInt(this.properties.score / 2)) * 100
      })
    },
    detached () {},
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
