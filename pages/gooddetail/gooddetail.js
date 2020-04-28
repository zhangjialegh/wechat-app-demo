// pages/detail.js
const gd = getApp().globalData
const app = getApp()
const {getFileUrl} = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    serviceTypeId: null,
    isLoading: true,
    businessInfoDetail: {},
    imgList: [],
    tableMap: null,
    peopleList: [],
    choosedItem: '',
    serviceTypeId: null,
    backgroundImage: '',
    tabNames: {
      tabOneName: '服务类型',
      tabTwoName: '收费标准',
      tabThreeName: '平台优势',
      tabFourName: '服务流程',
      tabFiveName: '服务人员列表'
    },
  }, 
  getData (id) {
    const vx = this
    this.setData({
      isLoading: true
    })
    gd.wxRequest({
      url:'convenientService/provider/'+id,
      isGet: true
    }).then(res => {
      let businessInfoDetail = res.data.data || res.data
      vx.setData({
        isLoading: false,
        businessInfoDetail
      })
      app.setTitle(businessInfoDetail.provider.name)
      if (!businessInfoDetail || !businessInfoDetail.provider || !businessInfoDetail.provider.descriptionPicture) {
        vx.setData({
          imgList: []
        })
      } else {
        vx.setData({
          imgList: businessInfoDetail.provider.descriptionPicture.split(',').map(item => getFileUrl(item))
        })
      }
      // 
      if (!businessInfoDetail || !businessInfoDetail.standards || !businessInfoDetail.standards.length) {
        vx.setData({
          tableMap: null
        })
      } else {
        vx.buildTableMap(businessInfoDetail.standards)
      }
      // 
      if (!businessInfoDetail || !businessInfoDetail.peoples || !businessInfoDetail.peoples.length) {
        let arr = vx.data.peopleList
        arr.splice(0)
        vx.setData({
          peopleList: arr
        })
      } else {
        businessInfoDetail.peoples.forEach(item => {
          let arr = vx.data.peopleList
          arr.push({
            src: item.avatar ? getFileUrl(item.avatar) : '',
            title: `${item.name}`,
            desc: item.serviceType.split(',')
          })
          console.log(arr, 'kkd')
          vx.setData({
            peopleList: arr
          })
        })
      }
      // 
      if (businessInfoDetail && businessInfoDetail.types && businessInfoDetail.types.length > 0) { vx.reFreshChargeStandard(businessInfoDetail.types[0]) }
    })
  },
  buildTableMap (totalData) {
    let fatherNodes = {}
    totalData.forEach(item => {
      if (item.parentId === 0) {
        fatherNodes[item.convenientServiceStandardId] = {
          fatherNodeName: item.name,
          sonNode: []
        }
      }
    })

    totalData.forEach(item => {
      if (item.parentId !== 0) {
        if (fatherNodes[item.parentId]) { fatherNodes[item.parentId].sonNode.push({ name: item.name, price: item.price }) }
      }
    })
  
    console.log(fatherNodes, 'fatherNodes')
    this.setData({
      tableMap: fatherNodes
    })
  },
  reFreshChargeStandard (targetService) {
    if (targetService.type === 'tap') {
      targetService = targetService.currentTarget.dataset.item
    }
    const vx = this
    let { convenientServiceProviderId, convenientServiceTypeId } = targetService
    this.setData({
      choosedItem: targetService,
      backgroundImage: getFileUrl(targetService.picture),
      serviceTypeId: convenientServiceTypeId
    })
    gd.wxRequest({
      url:`convenientService/list/standards?typeId=${convenientServiceTypeId}&providerId=${convenientServiceProviderId}`,
      isGet: true
    }).then((res) => {
      if (res.status === 'no') {
        console.log('err')
      }
      vx.buildTableMap(res.data)
    })
  },
  callPhone () {
    wx.makePhoneCall({
      phoneNumber: this.data.businessInfoDetail.provider.phone
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(options.id)
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