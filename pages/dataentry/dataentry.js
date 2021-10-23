// pages/dataentry/dataentry.js
const util = require('../../utils/util');
const crcUtil = require('../../utils/crcUtil');
const configManager = require('../../utils/configManager')
const WxNotificationCenter = require('../../utils/WxNotificationCenter');
const app = getApp();

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
      navTitle: '睡姿特征数据录入',
    },
    pingtangParam: 20,
    canPingtangParamEdit: false,
    cetangParam: 20,
    canCetangParamEdit: false,
    AA: '',
    KK: '',
    startTime: '',
    endTime: '',
    startDataEntry: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let connected = configManager.getCurrentConnected();
    this.setData({
      skin: app.globalData.skin,
      connected: connected,
    })
    WxNotificationCenter.addNotification("BLUEREPLY", this.blueReply, this);
  },



  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    WxNotificationCenter.removeNotification("BLUEREPLY", this);
  },

  /**
   * 发送完整蓝牙命令
   */
  sendFullBlueCmd(cmd, options) {
    var connected = this.data.connected;
    util.sendBlueCmd(connected, cmd, options);
  },


  /**
   * 蓝牙回复回调
   * @param {*} cmd 
   */
  blueReply(cmd) {
    cmd = cmd.toUpperCase();
    if (cmd.indexOf('FFFFFFFF0200090E01') >= 0) {
      let pingtangCmd = cmd.substr(18, 4);
      let pingtangParam = util.str16To10(pingtangCmd);
      this.setData({
        pingtangParam: pingtangParam
      })
      return;
    }
    if (cmd.indexOf('FFFFFFFF0200090E02') >= 0) {
      let cetangCmd = cmd.substr(18, 4);
      let cetangParam = util.str16To10(cetangCmd);
      this.setData({
        cetangParam: cetangParam
      })
      return;
    }
    if (cmd.indexOf('FFFFFFFF0200090F03') >= 0) {
      let AAAA = cmd.substr(18, 4);
      let KKKK = cmd.substr(22, 4);
      this.setData({
        AA: util.str16To10(AAAA),
        KK: util.str16To10(KKKK),
      })
      return;
    }
  },


  /**
   * 平躺
   */
  pingtangTap() {
    var longClick = this.longClick();
    if(longClick) {
      this.setData({
        canPingtangParamEdit:true
      })
      return;
    }
    this.sendFullBlueCmd('FFFFFFFF0200090D0100001504');
  },

  /**
   * 侧躺
   */
  cetangTap() {
    var longClick = this.longClick();
    if(longClick) {
      this.setData({
        canCetangParamEdit:true
      })
      return;
    }
    this.sendFullBlueCmd('FFFFFFFF0200090D0200001604');
  },

  /**
   * 保存
   */
  saveTap() {
    let cmd = 'FFFFFFFF0200120C';
    let pingtangCmd = util.str10To16(this.data.pingtangParam / 2);
    let cetangCmd = util.str10To16(this.data.cetangParam / 2);
    cmd = cmd + pingtangCmd + cetangCmd;
    cmd = cmd + crcUtil.HexToCSU16(cmd);
    this.sendFullBlueCmd(cmd);
    wx.navigateBack({
      delta: 1,
    })
  },

  /**
   * 数据录入点击事件
   */
  dataentryTap() {
    var that = this;
    let startDataEntry = this.data.startDataEntry;
    if (startDataEntry) {
      console.info('关闭数据录入实时获取');
      this.setData({
        startDataEntry: false
      })
      return;
    } else {
      var longClick = this.longClick();
      if (!longClick) {
        console.info('长按时间不足5s不做处理');
        return;
      }
      this.setData({
        startDataEntry: true
      })
      this.getDataEntry(0);
    }
  },

  /**
   * 获取睡姿数据录入实时数据
   */
  getDataEntry(count) {
    let startDataEntry = this.data.startDataEntry;
    if (!startDataEntry) {
      console.info('startDataEntry 停止获取实时数据录入');
      return;
    }
    if (count > 30) {
      console.info('startDataEntry 循环最多不能超过30次');
      this.setData({
        startDataEntry: false
      })
      return;
    }
    console.info('startDataEntry 重复获取实时数值 第' + count + '次');
    this.sendFullBlueCmd('FFFFFFFF0200090F03000000001904');
    count++;
    let that = this;
    setTimeout(() => {
      that.getDataEntry(count);
    }, 2000);
  },


  /*************-------------点击事件--------------------*********** */
  touchStart(e) {
    this.startTime = e.timeStamp;
  },
  touchEnd(e) {
    this.endTime = e.timeStamp;
  },

  /**
   * 判断单击 1 和长按 2 事件 其他0
   * @param {*} e 
   */
  longClick() {
    if (this.endTime - this.startTime > 5000) {
      console.log("长按了");
      return true;
    }
    return false;
  },

})