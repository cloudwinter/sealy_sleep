// pages/report/report.js
// pages/smart/smart.js
const util = require('../../utils/util');
const time = require('../../utils/time');
const crcUtil = require('../../utils/crcUtil');
const configManager = require('../../utils/configManager')
const WxNotificationCenter = require('../../utils/WxNotificationCenter');
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
    openSmart: false,
    date: {
      year: '2021',
      month: '7',
      day: '23'
    },
    timeShuimian: '489',
    timePingtang: '489',
    timeCetang: '489',
    timeFanshen: '489',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let connected = configManager.getCurrentConnected();
    let date = time.getDateInfo(new Date());
    this.setData({
      skin: app.globalData.skin,
      connected: connected,
      date: {
        year: date.year,
        month: date.month,
        day: date.day
      }
    })
    WxNotificationCenter.addNotification("BLUEREPLY", this.blueReply, this);
    this.sendInitCmd();
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
    WxNotificationCenter.removeNotification("BLUEREPLY", this);
  },



  /**
   * 发送初始化命令
   */
  sendInitCmd() {
    let cmd = 'FFFFFFFF0200030B01'
    let end = crcUtil.HexToCSU16(cmd);
    util.sendBlueCmd(this.data.connected,cmd+end);
  },

  /**
   * 蓝牙回复回调
   * @param {*} cmd 
   */
  blueReply(cmd) {
    cmd = cmd.toUpperCase();
    var prefix = cmd.substr(0, 12);
    console.info('report->askBack', cmd, prefix);
    if (prefix != 'FFFFFFFF0200') {
      return;
    }

    // 获取翻身次数
    let fanshenNum  = util.str16To10(cmd.substr(12,2));
    let pingtangTime = util.str16To10(cmd.substr(20,2));
    let cetangTime = util.str16To10(cmd.substr(22,2));
    let shuimianTime = parseInt(pingtangTime) + parseInt(cetangTime);
    this.setData({
      timeShuimian:shuimianTime,
      timePingtang:pingtangTime,
      timeCetang:cetangTime,
      timeFanshen:fanshenNum
    })
  },


})