// pages/set.js
const configManager = require('../../utils/configManager');
const util = require('../../utils/util');
const WxNotificationCenter = require('../../utils/WxNotificationCenter');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    connected: {},
    status: '已连接',
    skin: app.globalData.skin,
    navbar: {
      loading: false,
      color: '#FFFFFF',
      background: '#0A0A0C',
      show: true,
      animated: false,
    },
    items: [{
        value: 'dark',
        name: '深黑',
        checked: 'true'
      },
      {
        value: 'orange',
        name: '紫色'
      },
    ],
    dialogShow: false,
    selectedRadio: 'drak',
    alarmStatus: '未设置',
    alarmSwitch: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let connected = configManager.getCurrentConnected();
    let alarmSwitch = false;
    let status = this.data.status;
    if (util.isNotEmptyObject(connected)) {
      status = '已连接';
      alarmSwitch = configManager.showAlarmSwitch(connected.deviceId);
      faultDebugShow = this.isShowFaultDebug(connected.name);
    } else {
      status = '未连接';
    }
    this.setData({
      skin: app.globalData.skin,
      selectedRadio: app.globalData.skin,
      connected: connected,
      status: status,
      alarmSwitch: alarmSwitch,
    })
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },


    /**
   * 
   */
  onShow: function () {
    let alarmStatus = this.data.alarmStatus;
    if (util.isNotEmptyObject(this.data.connected)) {
      let alarm = configManager.getAlarm(this.data.connected.deviceId);
      if (util.isNotEmptyObject(alarm)) {
        if(alarm.isOpenAlarm) {
          alarmStatus = '已开启';
        } else {
          if(alarm.time) {
            alarmStatus = '已关闭';
          } else {
            alarmStatus = '未设置';
          }
          
        }
      } else {
        alarmStatus = '未设置';
      }
    } else {
      alarmStatus = '未连接';
    }


    this.setData({
      alarmStatus: alarmStatus
    })
  },



  /******----------------->自定义函数 */

  /**
   * 设置
   * @param {}} e 
   */
  set: function (e) {
    wx.navigateBack({
      delta: 2,
      complete: (res) => {
        console.info('返回蓝牙搜索界面')
      },
    })
  },

  /**
   * 型号说明
   * @param {*} e 
   */
  introduce: function (e) {
    wx.navigateTo({
      url: '../introduce/introduce',
    })
  },

  /**
   * 换肤
   * @param {*} e 
   */
  changeSkip: function (e) {
    // var skin = e.target.dataset.flag;
    // console.log(skin);
    // configManager.setSkin(skin);
    this.setData({
      dialogShow: true
    })
  },


  /**
   * 闹钟
   * @param {*} e 
   */
  alarm: function (e) {
    wx.navigateTo({
      url: '/pages/alarm/alarm',
    })
  },

  /**
   * 单选时间
   * @param {*} e 
   */
  radioChange: function (e) {
    console.info('radioChange', e);
    this.setData({
      selectedRadio: e.detail.value
    })
  },

  onModalClick: function (e) {
    var ctype = e.target.dataset.ctype;
    var selectedRadio = this.data.selectedRadio;
    this.setData({
      dialogShow: false
    })
    if (ctype == 'confirm') {
      // 确认
      configManager.setSkin(selectedRadio);
      app.globalData.skin = selectedRadio;
      this.setData({
        skin: selectedRadio
      })
    } else {
      // 取消
      this.setData({
        selectedRadio: this.data.skin
      })
    }
  }
})