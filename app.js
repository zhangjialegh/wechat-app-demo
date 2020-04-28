//app.js
const config = require('./utils/config.js')
const { queryString, unionQuery } = require('./utils/util.js')
App({
  onLaunch: function (options) {
    // 记录进入小程序的参数
    this.globalData.system = wx.getSystemInfoSync()
    this.globalData.initOptions(options);
  },
  globalData: {
    userInfo: null,
    accessToken: '',
    query: {},
    path: '',
    system: null,
    scene: '',
    config: config,
    loginCallback: [],
    initOptions: function (options) {
      const { query } = options
      this.path = options.path
      this.query = query
      this.scene = options.scene
    },
    wxLogin: function (options) { //登录逻辑
      const vx = this;
      const scene = options.scene
      return new Promise((resolve, reject) => {
        wx.login({
          success: res => {
            wx.request({
              url: config.BASE_URL + '/api/' + 'wechat/login',
              method: 'post',
              header: {
                'content-type': 'application/json'
              },
              data: {
                code: res.code,
                scene: scene
              },
              success: function (res) {
                if (res.data.success) {
                  vx.userInfo = res.data;
                  vx.accessToken = res.data.third_session
                  wx.setStorageSync(config.STORAGE_KEY, res.data.third_session)
                  if (vx.loginCallback.length) {
                    for (let i = 0; i < vx.loginCallback.length; i++) {
                      const fn = vx.loginCallback[i]
                      Promise.resolve(fn())
                    }
                  }
                  resolve(vx.accessToken);
                } else {
                  getApp().wxToast({
                    icon: 'none',
                    title: '登录失败',
                    duration: 1500
                  });
                  reject();
                }
              },
              fail: function (res) {
                reject(res)
              }
            })
          }
        })
      })
    },
    dlLogin: function (obj) {
      const vx = this
      return new Promise((resolve, reject) => {
        wx.request({
          url: config.BASE_URL + '/api/' + obj.url,
          method: 'post',
          header: {
            'content-type': 'application/json'
          },
          data: obj.data,
          success: function (res) {
            if (res.data.status === 'yes') {
              const info = res.data.data || res.data
              vx.userInfo = info;
              vx.accessToken = info.token
              wx.setStorageSync(config.STORAGE_KEY, info.token)
              resolve(vx.accessToken);
              // TODO: 适配switch
              // const pages = getCurrentPages()
              // let redirectUrl = '/' + vx.path + unionQuery(vx.query)
              if (vx.loginCallback.length) {
                for (let i = 0; i < vx.loginCallback.length; i++) {
                  const fn = vx.loginCallback[i]
                  Promise.resolve(fn())
                }
              }
              vx.loginCallback = []
              wx.navigateBack()
            } else {
              getApp().wxToast({
                icon: 'none',
                title: '登录失败',
                duration: 1500
              });
              reject(res);
            }
          },
          fail: function (res) {
            // console.log(res, 'fail')
            reject(res)
          }
        })
      })
    },
    wxAll: function (objs) {  //Promise.all
      const vx = getApp().globalData
      const token = vx.accessToken || null
      // 如果还未登录，需要登录后再执行
      if (token) {
        return Promise.all(objs.map(item => {
          return getApp().globalData.wxFetch(item)
        }))
      } else {
        return new Promise((resolve, reject) => {
          vx.loginCallback = function (token) {
            Promise.all(objs.map(item => {
              return getApp().globalData.wxFetch(item, token)
            })).then((res) => {
              resolve(res)
            }).catch(err => {
              reject(err)
            })
          }
        })
      }

    },
    wxFetch: function (obj, accesstoken) { //封装的请求接口
      const vx = getApp().globalData
      const token = vx.accessToken || accesstoken || wx.getStorageSync(config.STORAGE_KEY) || null;
      let header = {
        'content-type': 'application/json'
      }
      if (!obj.auth) {
        header['token'] = obj.token
        ? obj.token
        : token
          ? token
          : null
      }
      return new Promise((resolve, reject) => {
        wx.request({
          url: config.BASE_URL + '/api/' + obj.url,
          method: obj.method ? obj.method:  obj.isGet ? 'get' : 'post',
          header: header,
          data: obj.data,
          success: function (result) {
            if (result.statusCode == 200) {
              if (result.data.status === 'yes') {
                resolve(result.data)
              } else {
                vx.reqOperation(obj, result.data)
                resolve(result.data)
              }
            } else {
              vx.reqOperation(obj, result.data)
              reject(result)
            };
          },
          fail: function (err) {
            vx.reqOperation(obj)
            reject(err)
          },
          complete: function () {
            getApp().stopPullDown()
          }
        })
      })
    },
    wxRequest: function (obj) {
      const vx = getApp().globalData
      const token = vx.accessToken|| wx.getStorageSync(config.STORAGE_KEY) || null
      // 如果还未登录，需要登录后再执行
      if (token) {
        return new Promise((resolve, reject) => {
          vx.wxFetch(obj)
            .then((res) => {
              resolve(res)
            })
            .catch(err => {
              reject(err)
            })
        })
      } else {
        return new Promise((resolve, reject) => {
          let fn = function (token) {
            vx.wxFetch(obj, token)
              .then((res) => {
                resolve(res)
              }).catch(err => {
                reject(err)
              })
          }
          vx.loginCallback.push(fn) 
          // 
          // const pages = getCurrentPages()
          // const nowPage = pages[pages.length - 1]
          // console.log(pages, 'pages')
          // vx.path = nowPage.route
          // vx.query = nowPage.options
          wx.navigateTo({
            url: '/pages/login/login'
          })
        })
      }
    },
    reqOperation: function (obj, data) {
      wx.showModal({
        content: data.message || '网络不给力，点击确定重试',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#28D4A1'
      })
    }
  },
  wxModal: function ({
    title = '',
    content,
    showCancel = false,
    confirmText = '知道了',
    confirm,
    cancel,
    complete
  }) {
    wx.showModal({
      title: title,
      content: content,
      confirmText,
      showCancel,
      confirmColor: '#28D4A1',
      success(res) {
        if (res.confirm) {
          confirm && confirm()
        } else if (res.cancel) {
          cancel && cancel()
        }
      },
      complete() {
        complete && complete()
      }
    })
  },
  wxToast: function ({
    title = '',
    icon = 'none',
    image = '',
    duration = 1000,
    mask = false,
    success,
    fail,
    complete
  }) {
    wx.showToast({
      title,
      icon,
      image,
      duration,
      mask,
      success() {
        success && success()
      },
      fail() {
        fail && fail()
      },
      complete() {
        complete && complete()
      }
    })
  },
  // showBarLoading: function() {
  //   getApp().showNavigationBarLoading && getApp().showNavigationBarLoading()
  // },
  // hideBarLoading: function() {
  //   getApp().hideNavigationBarLoading && getApp().hideNavigationBarLoading()
  // },
  onPullDownRefresh: function () {
    // this.showBarLoading()
    wx.showNavigationBarLoading()
  },
  stopPullDown: function () {
    // this.hideBarLoading()
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },
  setTitle: function (name) {
    wx.setNavigationBarTitle({
      title: name || config.WECHAT_NAME
    })
  }
})