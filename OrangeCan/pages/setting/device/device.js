// pages/setting/device/device.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneInfo: [],
    softInfo: [],
    screenInfo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取系统信息
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          phoneInfo: [
            {
              key: "手机型号",
              val: res.model
            },
            {
              key: "手机语言",
              val: res.language
            }
          ],
          softInfo: [
            {
              key: "微信版本",
              val: res.version
            },
            {
              key: "操作系统版本",
              val: res.system
            },
            {
              key: "客户端平台",
              val: res.platform
            }
          ],
          screenInfo: [
            {
              key: "屏幕像素比",
              val: res.pixelRatio
            },
            {
              key: "屏幕尺寸",
              val: res.windowWidth + "X" + res.windowHeight
            }
          ]
        }) 
      }
    })
  }

})