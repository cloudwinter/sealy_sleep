// pages/smart/smart.js
const util = require('../../utils/util');
const crcUtil = require('../../utils/crcUtil');
const configManager = require('../../utils/configManager')
const WxNotificationCenter = require('../../utils/WxNotificationCenter')
const app = getApp();
const preCMD = 'FFFFFFFF050000';
const timerList = [{
    id: 11,
    name: '20:00',
  },
  {
    id: 12,
    name: '20:30',
  },
  {
    id: 13,
    name: '21:00',
  },
  {
    id: 14,
    name: '21:30',
  },
  {
    id: 15,
    name: '22:00',
  },
  {
    id: 16,
    name: '22:30',
  },
  {
    id: 17,
    name: '23:00',
  },
  {
    id: 18,
    name: '23:30',
  },
];


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
    sleepInduction: { //智能睡眠感应信息
      status: '00', // 00 关闭，01开启 其他定时
      nightLight: '00', // 智能夜灯 00 关闭 01开启
      mode: '00', // 模式 00 预设位置 01 个性位置
      gexingModel: '00' // 个性模式 00 个性未设置 01 个性已设置
    },
    timer: "", // 定时时间
    fuweiDialogShow: false,
    timerDialogShow: false,
    nextDialogShow: false,
    timerList: timerList,
    currentSelectedTimerId: '', // 当前选中的id
    currentSelectedTimerName: '', // 当前选中的名称
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let connected = configManager.getCurrentConnected();
    let sleepInduction = app.globalData.sleepInduction;
    let timer = this.getTimer(sleepInduction.status);
    let fuweiDialogShow = sleepInduction.gexingModel == '01' ? false : true;
    this.setData({
      skin: app.globalData.skin,
      connected: connected,
      sleepInduction: sleepInduction,
      timer: timer,
      fuweiDialogShow
    })

    WxNotificationCenter.addNotification("BLUEREPLY", this.blueReply, this);
  },

  /**
   * 根据状态码获取定时的时间
   * @param {*} status 
   */
  getTimer: function (status) {
    let result;
    if (status == '11') {
      result = "20:00";
    } else if (status == '12') {
      result = "20:30";
    } else if (status == '13') {
      result = "21:00";
    } else if (status == '14') {
      result = "21:30";
    } else if (status == '15') {
      result = "22:00";
    } else if (status == '16') {
      result = "22:30";
    } else if (status == '17') {
      result = "23:00";
    } else if (status == '18') {
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
    WxNotificationCenter.removeNotification("BLUEREPLY", this);
  },


  /**
   * 蓝牙回复回调
   * @param {*} cmd 
   */
  blueReply(cmd) {
    cmd = cmd.toUpperCase();
    var prefix = cmd.substr(0, 12);
    console.info('report->askBack', cmd, prefix);
    // 压力带蓝牙回复实时数据或者实时在床数据 ，会回复三次帧数据
    if (prefix != 'FFFFFFFF0200') {
      return;
    }
  },


  /**
   * 开启
   */
  open: function () {
    let sleepInduction = this.data.sleepInduction;
    sleepInduction.status = '01';
    this.setData({
      sleepInduction: sleepInduction
    })
  },

  /**
   * 关闭
   */
  close: function () {
    let sleepInduction = this.data.sleepInduction;
    sleepInduction.status = '00';
    this.setData({
      sleepInduction: sleepInduction
    })
  },


  /**
   * 定时开启
   */
  timerOpen: function () {
    this.setData({
      timerDialogShow: true
    })
  },

  /**
   * 定时开启item选中
   * @param {*} e 
   */
  timerItemSelect: function (e) {
    let selectedId = e.currentTarget.dataset.cid;
    let selectedName = e.currentTarget.dataset.cname;
    this.setData({
      currentSelectedTimerId: selectedId,
      currentSelectedTimerName: selectedName
    })
  },

  /**
   * 定时对话框按钮点击事件
   * @param {*} e 
   */
  onTimerModalClick: function (e) {
    var ctype = e.target.dataset.ctype;
    this.setData({
      timerDialogShow: false
    })
    if (ctype == 'confirm') {
      let sleepInduction = this.data.sleepInduction;
      let currentSelectedTimerId = this.data.currentSelectedTimerId;
      let currentSelectedTimerName = this.data.currentSelectedTimerName;
      sleepInduction.status = currentSelectedTimerId;
      this.setData({
        timer: currentSelectedTimerName,
        sleepInduction: sleepInduction
      })
    }
  },


  /**
   * 智能睡眠感应开关
   */
  nightSwitch: function (e) {
    let sleepInduction = this.data.sleepInduction;
    if (sleepInduction.nightLight == '01') {
      sleepInduction.nightLight = '00';
    } else {
      sleepInduction.nightLight = '01';
    }
    console.info('nightSwitch:', sleepInduction);
    this.setData({
      sleepInduction: sleepInduction
    })
  },

  /**
   * 模式选择
   * @param {*} e 
   */
  modeSelect: function (e) {
    var ctype = e.currentTarget.dataset.ctype;
    let sleepInduction = this.data.sleepInduction;
    if (ctype == '01') {
      // 个性设置
      sleepInduction.mode = '01';
    } else {
      sleepInduction.mode = '00';
    }
    this.setData({
      sleepInduction: sleepInduction
    })
  },


  /**
   * 复位对话框按钮点击事件
   * @param {*} e 
   */
  onFwModalClick: function (e) {
    var that = this;
    var ctype = e.target.dataset.ctype;
    console.info('onFwModalClick:', ctype, e.target.dataset);
    var connected = this.data.connected;
    this.setData({
      fuweiDialogShow: false
    })
    if (ctype == 'confirm') {
      // loading加载
      util.showLoading("复位中...");
      setTimeout(function () {
        util.hideLoading();
        that.setData({
          nextDialogShow: true
        })
      }, 2000);
      // 一键复位
      util.sendBlueCmd(connected, "FFFFFFFF0500000008D6C6");
    }
  },

  /**
   * 下一步跳转到睡眠设置页面
   */
  onNextModalClick: function () {
    this.setData({
      nextDialogShow: false
    })
    let cmd = 'FFFFFFFF050000F03FD310';
    util.sendBlueCmd(connected, cmd, ({
      success: (res) => {
        console.info('onNextModalClick->发送成功');
        wx.navigateTo({
          url: '/pages/gexingset/gexingset-1',
        })
      },
      fail: (res) => {
        console.error('onNextModalClick->发送失败', res);
      }
    }));
  },

  /**
   * 重新设置
   */
  resetMode: function () {
    util.showToast("功能开发中，请耐心等候");
    // wx.navigateTo({
    //   url: '/pages/report/report',
    // })
  },

  /**
   * 保存按钮
   * 
   */
  save: function () {
    //util.showToast("功能开发中，请耐心等候");
    let connected = this.data.connected;
    let sleepInduction = this.data.sleepInduction;
    let preCmd = "FFFFFFFF0200020E04";
    let cmd = preCmd + sleepInduction.status + sleepInduction.nightLight + sleepInduction.mode + sleepInduction.gexingModel;
    let cmdCrc = crcUtil.HexToCSU16(cmd);
    cmd = cmd + cmdCrc;
    util.sendBlueCmd(connected, cmd);
    // 返回上一页
    wx.navigateBack({
      delta: 1,
    })
  }

})