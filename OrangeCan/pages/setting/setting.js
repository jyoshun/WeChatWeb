// pages/setting/setting.js

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cache: [{
      iconurl: "/images/icon/wx_app_clear.png",
      title: "缓存清理",
      tap: "clearCache"
    }],
    device: [{
        iconurl: '/images/icon/wx_app_cellphone.png',
        title: '系统信息',
        tap: 'showSystemInfo'
      },
      {
        iconurl: '/images/icon/wx_app_network.png',
        title: '网络状态',
        tap: 'showNetWork'
      },
      {
        iconurl: '/images/icon/wx_app_location.png',
        title: '地图显示',
        tap: 'showMap'
      },
      {
        iconurl: '/images/icon/wx_app_compass.png',
        title: '指南针',
        tap: 'showCompass'
      },
      {
        iconurl: '/images/icon/wx_app_lonlat.png',
        title: '当前位置、速度',
        tap: 'showLonLat'
      },
      {
        iconurl: '/images/icon/wx_app_shake.png',
        title: '摇一摇',
        tap: 'shake'
      },
      {
        iconurl: '/images/icon/wx_app_scan_code.png',
        title: '二维码',
        tap: 'scanQRCode'
      }
    ],
    api: [{
        iconurl: '/images/icon/wx_app_list.png',
        title: '下载pdf、word文档',
        tap: 'downloadDocumentList'
      },
      {
        iconurl: '',
        title: '用户登陆',
        tap: 'login'
      },
      {
        iconurl: '',
        title: '校验用户信息',
        tap: 'check'
      },
      {
        iconurl: '',
        title: '获取用户加密信息',
        tap: 'decrypted'
      },
      {
        iconurl: '',
        title: '模板消息',
        tap: 'tplMessage'
      },
      {
        iconurl: '',
        title: '微信支付',
        tap: 'wxPay'
      }
    ],
    others: [{
        iconurl: '',
        title: 'wx:key示例',
        tap: 'showWxKeyDemo'
      },
      {
        iconurl: '',
        title: 'scroll-view高级用法演示',
        tap: 'showScrollViewDemo'
      }
    ],
    // 初始化罗盘所需的状态变量
    compassVal: 0,
    compassHidden: true,
    // 初始化摇一摇所需的状态变量
    shakeInfo: {
      gravityModalHidden: true,
      num: 0,
      enabled: false
    },
    shakeData: {
      x: 0,
      y: 0,
      z: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  /**
   * 显示模态窗口
   */
  showModal: function (title, content, callback) {
    wx.showModal({
      title: title,
      content: content,
      confirmColor: "#1F4BA5",
      cancelColor: "#7F8389",
      success: function (res) {
        if (res.confirm) {
          callback && callback()
        }
      }
    })
  },

  /**
   * 清除用户的数据缓存
   */
  clearCache: function () {
    this.showModal("缓存清理", "确定要清除本地缓存吗？", function () {
      wx.clearStorage({
        success: function (msg) {
          wx.showToast({
            title: "缓存清理成功",
            duration: 1000,
            mask: true,
            icon: "success"
          })
        },
        fail: function (e) {
          console.log(e)
        }
      })
    })
  },

  /**
   * 显示系统信息
   */
  showSystemInfo: function () {
    wx.navigateTo({
      url: "device/device"
    })
  },

  /**
   * 获取网络状态信息
   */
  showNetWork: function () {
    var that = this
    wx.getNetworkType({
      success: function (res) {
        var netWorkType = res.networkType
        that.showModal("网络状态", "您当前的网络：" + netWorkType)
      },
    })
  },

  /**
   * 获取当前位置经纬度与当前速度
   */
  getLonLat: function (callback) {
    var that = this
    wx.getLocation({
      type: "gcj02",
      success: function (res) {
        callback(res.longitude, res.latitude, res.speed)
      }
    })
  },

  /**
   * 显示当前位置和速度信息
   */
  showLonLat: function () {
    var that = this
    this.getLonLat(function (lon, lat, speed) {
      var lonStr = lon >= 0 ? '东经' : '西经',
          latStr = lat >= 0 ? '北纬' : '南纬'
      lon = lon.toFixed(2)
      lat = lat.toFixed(2)
      lonStr += lon
      latStr += lat
      speed = (speed || 0).toFixed(2)
      that.showModal("当前位置和速度", "当前位置：" + lonStr + "，" + latStr + "。速度：" + speed + "m/s")
    })
  },

  /**
   * 在地图上显示坐标点
   */
  showMap: function () {
    this.getLonLat(function (lon, lat) {
      wx.openLocation({
        latitude: lat,
        longitude: lon,
        scale: 15,
        name: "海底捞",
        address: "xx街xx号",
        fail: function () {
          wx.showToast({
            title: "地图打开失败",
            duration: 1000,
            icon: "cancel"
          })
        }
      })
    })
  },

  /**
   * 显示罗盘
   */
  showCompass: function () {
    var that = this
    this.setData({
      compassHidden: false
    })
    wx.onCompassChange(function (res) {
      if (!that.data.compassHidden) {
        that.setData({
          compassVal: res.direction.toFixed(2)
        })
      }
    })
  },

  /**
   * 隐藏罗盘
   */
  hideCompass: function () {
    this.setData({
      compassHidden: true
    })
  },

  /**
   * 摇一摇的具体实现
   */
  shake: function () {
    var that = this
    // 启用摇一摇
    this.gravityModalConfirm(true)

    wx.onAccelerometerChange(function (res) {
      // 摇一摇核心代码，判断手机晃动幅度
      var x = res.x.toFixed(4),
          y = res.y.toFixed(4),
          z = res.z.toFixed(4)
      var flagX = that.getDelFlag(x, that.data.shakeData.x),
          flagY = that.getDelFlag(y, that.data.shakeData.y),
          flagZ = that.getDelFlag(z, that.data.shakeData.z)
      
      that.data.shakeData = {
        x: res.x.toFixed(4),
        y: res.y.toFixed(4),
        z: res.z.toFixed(4)
      }
      if (flagX && flagY || flagX && flagZ || flagY && flagZ) {
        // 如果摇一摇幅度足够大，就认为摇一摇成功
        if (that.data.shakeInfo.enabled) {
          that.data.shakeInfo.enabled = false
          that.playShakeAudio()
        }
      }
    })
  },

  /**
   * 开启或关闭摇一摇
   */
  gravityModalConfirm: function (flag) {
    if (flag !== true) {
      flag = false
    }
    var that = this
    this.setData({
      shakeInfo: {
        gravityModalHidden: !that.data.shakeInfo.gravityModalHidden,
        num: 0,
        enabled: flag
      }
    })
  },

  /**
   * 计算偏移量
   */
  getDelFlag: function (val1, val2) {
    return (Math.abs(val1 - val2) >= 1)
  },

  /**
   * 摇一摇成功后播放声音
   */
  playShakeAudio: function () {
    var that = this
    wx.playBackgroundAudio({
      dataUrl: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46',
      title: '',
      coverImgUrl: ''
    })
    wx.onBackgroundAudioStop(function () {
      that.data.shakeInfo.num++
      that.setData({
        shakeInfo: {
          num: that.data.shakeInfo.num,
          enabled: true,
          gravityModalHidden: false
        }
      })
    })
  },

  /**
   * 扫码
   */
  scanQRCode: function () {
    var that = this
    wx.scanCode({
      success: function (res) {
        consolog.log(res)
        that.showModal("扫描二维码/条形码", res.result, false)
      },
      fail: function (res) {
        that.showModal("扫描二维码/条形码", "扫描失败，请重试", false)
      }
    })
  },

  /**
   * 跳转到download页面
   */
  downloadDocumentList: function () {
    wx.navigateTo({
      url: "/pages/setting/document/download/download"
    })
  },
  
  /*****************开放api示例代码***********************
   * 以下是开放api的示例代码，为避免本文件代码过多，首先将跳转到子页面
   */
  login: function () {
    wx.navigateTo({
      url: '/pages/setting/open-api/login/login'
    });
  },

  check: function () {
    wx.navigateTo({
      url: '/pages/setting/open-api/check/check'
    });
  },

  decrypted: function () {
    wx.navigateTo({
      url: '/pages/setting/open-api/decrypted/decrypted'
    });
  },

  tplMessage: function () {
    wx.navigateTo({
      url: '/pages/setting/open-api/tpl-message/tpl-message'
    });
  },

  wxPay: function () {
    wx.navigateTo({
      url: '/pages/setting/open-api/wx-pay/wx-pay'
    });
  },

  showWxKeyDemo: function () {
    wx.navigateTo({
      url: '/pages/setting/others/wx-key/wx-key'
    });
  },

  showScrollViewDemo: function () {
    wx.navigateTo({
      url: '/pages/setting/others/scroll-view/scroll-view'
    });
  }

})