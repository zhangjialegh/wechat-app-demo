// pages/login/login.js
const {validateMobile} = require('../../utils/util')
const md5 = require('../../assets/script/md5')
const app = getApp()
const gd = app.globalData

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: 1,
    phone: '',
    code: '',
    password: '',
    hidePwd: true
  },

  tabChange (e) {
    const {tab} = e.target.dataset
    this.setData({
      tab: Number(tab)
    })
  },
  handlePhone (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  handleCode (e) {
    this.setData({
      code: e.detail.value
    })
  },
  handlePassword (e) {
    this.setData({
      password: e.detail.value
    })
  },
  handleHidePwd () {
    console.log(this.data.hidePwd, 'pwd')
    this.setData({
      hidePwd: !this.data.hidePwd
    })
  },
  handleSubmit () {
    const {phone, code, password, tab} = this.data
    if (!phone) {
      app.wxToast({title:'请输入手机号'})
      return
    } else {
      if (!validateMobile(phone)) {
        app.wxToast({title:'请输入有效的手机号码'})
        return
      }
      if (tab === 1) {
        if (!code) {
          app.wxToast({title:'请输入验证码'})
          return
        }
      } else if (tab === 2) {
        if (!password) {
          app.wxToast({title: '请输入密码'})
          return
        }
      }
    }

    let data = {}

    if (tab === 1) {
      data = {
        appVersion: "TODO",
        mobile: phone,
        verificationCode: code,
        systemVersion: "TODO"
      }
    } else if (tab === 2) {
      data = {
        appVersion: "TODO",
        mobile: phone,
        password: md5(password),
        systemVersion: "TODO"
      }
    }

    gd.dlLogin({
      url: tab===2 ? `accounts/login` : 'accounts/loginByVerificationCode',
      isGet: false,
      data
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})