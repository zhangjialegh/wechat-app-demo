// components/listview/listview.js
const gd = getApp().globalData
Component({

  behaviors: [],

  properties: {
    search: { // search字段名
      type: String,
      value: '' // 为空不显示search组件，不为空此值为查询字段
    },
    url: {
      type: String,
      value: ''
    }
  },
  
  data: {
    page: 1,
    limit: 10,
    searchText: '',
    loading: true,
    lists: []
  }, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    created () {},
    attached () {},
    ready () {},
    detached () {},
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {},
    hide: function () {},
    resize: function () {},
  },

  methods: {
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh () {
      this.setData({
        page: 1
      })
      this.getData()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom () {
      this.setData({
        page: this.data.page + 1
      })
      this.getData()
    },
    getData () {
      const vx = this
      let params = {
        page: this.data.page,
        limit: this.data.limit
      }
      if (this.properties.search) {
        params[this.properties.search] = this.data.searchText
      }
      gd.wxRequest({
        url:this.properties.url,
        isGet: true,
        data: params
      }).then(res=>{
        let data = res.data.data || res.data
        let total = res.data.total || res.total
        let lists = []
        if (vx.data.page > 1) {
          lists = vx.data.lists.concat(data)
        } else {
          lists = data
        }
        if (lists.length < total) {
          vx.setData({
            loading: true,
            lists
          })
        } else {
          vx.setData({
            loading: false,
            lists
          })
        }
        vx.triggerEvent('datachange', lists)
      }).catch(err => {
        vx.triggerEvent('datachange', err)
      })
    },
    handleInput(e) {
      const { value } = e.detail
      this.setData({
        searchText: value
      })
    },
    handleConfirm() {
      this.getData()
    },
    handleFocus(e) {
      const { value } = e.target.dataset
      this.setData({
        ['active' + value]: value
      })
    },
    handleBlur(e) {
      const { value } = e.target.dataset
      this.setData({
        ['active' + value]: ''
      })
    }
  }

})
