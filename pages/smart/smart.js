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
    failedDialogShow: false, // 通信失败的对话框
    tempSaveCmd: '', // 临时保存发送的命令
    currentTimeOutName: '', // 当前定时器的name
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let connected = configManager.getCurrentConnected();
    let sleepInduction = app.globalData.sleepInduction;
    console.info('onLoad', sleepInduction, connected);
    let timer = this.getTimer(sleepInduction.status);
    let fuweiDialogShow = sleepInduction.gexingModel == '01' ? false : true;
    this.setData({
      skin: app.globalData.skin,
      connected: connected,
      sleepInduction: sleepInduction,
      timer: timer,
      fuweiDialogShow: fuweiDialogShow,
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
    console.info('smart->askBack', cmd, prefix);
    // 压力带蓝牙回复实时数据或者实时在床数据 ，会回复三次帧数据
    let tempSaveCmd = this.data.tempSaveCmd;
    let that = this;
    if (cmd == tempSaveCmd) {
      // 下一步处理
      this.clearCurrentTimeOut();
      // 更新全局变量
      let sleepInduction = this.data.sleepInduction;
      app.globalData.sleepInduction = sleepInduction;
      wx.navigateBack({
        delta: 1,
      })
      return;
    }
    if (cmd == 'FFFFFFFF0500000208D7A6') {
      let timeOutName = this.startCurrentTimeOut('复位中...', 100);
      this.setData({
        currentTimeOutName: timeOutName
      })

      // FIXME TEST 
      // setTimeout(() => {
      //   that.blueReply('FFFFFFFF0500008208B666')
      // }, 2000);

    }
    if (cmd == 'FFFFFFFF0500008208B666') {
      this.clearCurrentTimeOut();
      this.setData({
        nextDialogShow: true,
        currentTimeOutName: ''
      })

    }
    if (cmd == 'FFFFFFFF050000F03FD310') {
      // 下一步处理
      this.clearCurrentTimeOut();
      this.setData({
        currentTimeOutName: ''
      })
      this.turnToGexingset();
    }

    if (cmd == 'FFFFFFFF050000FF3FD6E0') {
      // 重新设置
      this.clearCurrentTimeOut();
      this.setData({
        currentTimeOutName: '',
        fuweiDialogShow: true
      })
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
      // 一键复位
      util.sendBlueCmd(connected, "FFFFFFFF0500000208D7A6");

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
    let that = this;
    let connected = this.data.connected;
    util.sendBlueCmd(connected, cmd, ({
      success: (res) => {
        console.info('onNextModalClick->发送成功');
        let timeOutName = that.startCurrentTimeOut('加载中...', 3);
        that.setData({
          currentTimeOutName: timeOutName
        })

        // FIXME TEST
        // setTimeout(() => {
        //     that.blueReply(cmd);
        // }, 2000);

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
    // this.setData({
    //   fuweiDialogShow: true
    // })
    let that = this;
    let connected = this.data.connected;
    let cmd = 'FFFFFFFF050000FF3FD6E0';
    util.sendBlueCmd(connected, cmd, ({
      success: (res) => {
        console.info('resetMode->发送成功');
        let timeoutName = that.startCurrentTimeOut("加载中...", 3);
        that.setData({
          currentTimeOutName: timeoutName,
        })

      },
      fail: (res) => {
        console.error('resetMode->发送失败', res);
        util.showToast("通讯不成功，请检查硬件连接");
      }
    }));
  },



  turnToGexingset() {
    let connected = this.data.connected;
    let name = connected.name.toUpperCase();
    console.info('turnToGexingset:', connected, name);
    if (name.indexOf('SEALY') >= 0 || name.indexOf('QMS2') >= 0 ||
      name.indexOf('QMS-MQ') >= 0) {
      wx.navigateTo({
        url: '/pages/gexingset/gexingset-2',
      })
    } else {
      wx.navigateTo({
        url: '/pages/gexingset/gexingset-1',
      })
    }
  },

  /**
   * 保存按钮
   * 
   */
  save: function () {
    let connected = this.data.connected;
    let sleepInduction = this.data.sleepInduction;
    let preCmd = "FFFFFFFF0200020F04";
    let cmd = preCmd + sleepInduction.status + sleepInduction.nightLight + sleepInduction.mode + sleepInduction.gexingModel;
    let cmdCrc = crcUtil.HexToCSU16(cmd);
    cmd = cmd + cmdCrc;
    let that = this;
    util.sendBlueCmd(connected, cmd, ({
      success: (res) => {
        console.info('save->发送成功');
        let timeoutName = that.startCurrentTimeOut("加载中...", 3);
        that.setData({
          tempSaveCmd: cmd,
          currentTimeOutName: timeoutName,
        })

        // setTimeout(() => {
        //   that.blueReply(cmd);
        // }, 200);

      },
      fail: (res) => {
        console.error('onNextModalClick->发送失败', res);
        util.showToast("通讯不成功，请检查硬件连接");
      }
    }));
  },


  /**
   * 检查通讯正常
   */
  startCurrentTimeOut(loadingStr, timeOutSeconds) {
    let that = this;
    util.showLoading(loadingStr);
    let timeOutName = setTimeout(() => {
      console.info('startCurrentTimeOut', loadingStr, timeOutSeconds);
      util.hideLoading();
      that.setData({
        failedDialogShow: true,
        currentTimeOutName: '',
      })
    }, timeOutSeconds * 1000);
    return timeOutName;
  },

  /**
   * 清除当前的定时器
   */
  clearCurrentTimeOut() {
    let timeOutName = this.data.currentTimeOutName;
    if (timeOutName) {
      clearTimeout(timeOutName);
      util.hideLoading();
      this.setData({
        currentTimeOutName: '',
      })
    }
  },

  /**
   * 关闭对话框
   */
  onFailedModalClick: function () {
    this.setData({
      failedDialogShow: false
    })
  }

})