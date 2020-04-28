// pages/detail.js
const app = getApp()
const gd = getApp().globalData

const {getFileUrl} = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    color: '',
    isLoading: true,
    page: 1,
    limit: 10,
    lists: [],
    content: '',
    url: 'convenientService/page/provider?type=UNLOCK_OR_CHANGE_LOCK'
  }, 
  getData (data) {
    this.setData({
      isLoading: false,
      lists: data.detail.map(item => {
        item.descriptionPicture = getFileUrl(item.descriptionPicture)
        return item
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.daynamicBgs()
    app.setTitle('开锁换锁')
    console.log('load')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      isLoading: true
    })
    console.log('ready')
    this.selectComponent('#listview').getData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.selectComponent('#listview').onPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('end')
    this.selectComponent('#listview').onReachBottom()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})