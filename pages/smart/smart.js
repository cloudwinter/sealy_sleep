// pages/smart/smart.js
const util = require('../../utils/util');
const crcUtil = require('../../utils/crcUtil');
const configManager = require('../../utils/configManager')
const app = getApp();
const preCMD = 'FFFFFFFF050000';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    connected: {}, // 当前连接的设备
    skin: app.globalData.skin,
    navbar: {
      loading: false,
      color: '#FFFFFF',
      background: '#0A0A0C',
      show: true,
      animated: false,
    },
    sleepInduction: {  //智能睡眠感应信息
      status:'00',  // 00 关闭，01开启 其他定时
      nightLight:'00', // 智能夜灯 00 关闭 01开启
      mode:'00', // 模式 00 预设位置 01 个性位置
      gexingModel:'00'  // 个性模式 00 个性未设置 01 个性已设置
    },
    timer:"", // 定时时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let connected = configManager.getCurrentConnected();
    let sleepInduction = app.globalData.sleepInduction;
    let timer = this.getTimer(sleepInduction.status)
    this.setData({
      skin: app.globalData.skin,
      connected: connected,
      sleepInduction:sleepInduction
    })
  },

  /**
   * 根据状态码获取定时的时间
   * @param {*} status 
   */
  getTimer:function(status) {
    let result;
    if(status == '11') {
      result = "20:00";
    } else if(status == '12') {
      result = "20:30";
    } else if(status == '13') {
      result = "21:00";
    } else if(status == '14') {
      result = "21:30";
    } else if(status == '15') {
      result = "22:00";
    } else if(status == '16') {
      result = "22:30";
    } else if(status == '17') {
      result = "23:00";
    } else if(status == '18') {
      result = "23:30";
    }
    return result;
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },


  /**
   * 智能睡眠感应开关
   */
  smartSwitch:function() {
    var connected = this.data.connected;
    var openSmart = this.data.openSmart;
    if(openSmart) {
      // 发送关的命令
      util.sendBlueCmd(connected,preCMD+'F03FD310');
    } else {
      // 发送开的命令
      util.sendBlueCmd(connected,preCMD+'003F9710');
    }
    this.setData({
      openSmart: !openSmart
    })
  },

  /**
   * 跳转到睡眠报告页面
   */
  report:function() {
    wx.navigateTo({
      url: '/pages/report/report',
    })
  }

})