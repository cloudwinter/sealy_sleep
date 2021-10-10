// pages/set.js
const configManager = require('../../utils/configManager');
const util = require('../../utils/util');
const WxNotificationCenter = require('../../utils/WxNotificationCenter');
const app = getApp();
const timerList = [{
    id: '00',
    name: '无定时',
  },
  {
    id: '01',
    name: '20:00',
  },
  {
    id: '02',
    name: '20:30',
  },
  {
    id: '03',
    name: '21:00',
  },
  {
    id: '04',
    name: '21:30',
  },
  {
    id: '05',
    name: '22:00',
  },
  {
    id: '06',
    name: '22:30',
  },
  {
    id: '07',
    name: '23:00',
  },
  {
    id: '08',
    name: '23:30',
  },
];

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
    alarmSwitch: false,
    hasSleepInduction: false,
    timerList: timerList,
    currentSelectedTimerId: '', // 当前选中的id
    currentSelectedTimerName: '', // 当前选中的名称
    timerDialogShow: false,
    sleepTimer: '00',
    sleepTimerDesc: '无定时',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.info('set->onLoad:', app.globalData, this.data.hasSleepInduction);
    let connected = configManager.getCurrentConnected();
    let alarmSwitch = false;
    let status = this.data.status;
    if (util.isNotEmptyObject(connected)) {
      status = '已连接';
      alarmSwitch = configManager.showAlarmSwitch(connected.deviceId);
    } else {
      status = '未连接';
    }
    let hasSleepInduction = app.globalData.hasSleepInduction;
    let sleepTimerDesc = '无定时';
    let sleepTimer = app.globalData.sleepTimer;
    if (sleepTimer == '00') {
      sleepTimerDesc = '无定时';
    } else if (sleepTimer == '01') {
      sleepTimerDesc = '20:00';
    } else if (sleepTimer == '02') {
      sleepTimerDesc = '20:30';
    } else if (sleepTimer == '03') {
      sleepTimerDesc = '21:00';
    } else if (sleepTimer == '04') {
      sleepTimerDesc = '21:30';
    } else if (sleepTimer == '05') {
      sleepTimerDesc = '22:00';
    } else if (sleepTimer == '06') {
      sleepTimerDesc = '22:30';
    } else if (sleepTimer == '07') {
      sleepTimerDesc = '23:00';
    } else if (sleepTimer == '08') {
      sleepTimerDesc = '23:30';
    }
    this.setData({
      skin: app.globalData.skin,
      selectedRadio: app.globalData.skin,
      connected: connected,
      status: status,
      alarmSwitch: alarmSwitch,
      hasSleepInduction: hasSleepInduction,
      sleepTimer: sleepTimer,
      sleepTimerDesc: sleepTimerDesc,
      currentSelectedTimerId: sleepTimer,
      currentSelectedTimerName: sleepTimerDesc
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
    let sleepTimer = app.globalData.sleepTimer;
    let sleepTimerDesc = '无定时';
    if (util.isNotEmptyObject(this.data.connected)) {
      if (sleepTimer == '00') {
        sleepTimerDesc = '无定时';
      } else if (sleepTimer == '01') {
        sleepTimerDesc = '20:00';
      } else if (sleepTimer == '02') {
        sleepTimerDesc = '20:30';
      } else if (sleepTimer == '03') {
        sleepTimerDesc = '21:00';
      } else if (sleepTimer == '04') {
        sleepTimerDesc = '21:30';
      } else if (sleepTimer == '05') {
        sleepTimerDesc = '22:00';
      } else if (sleepTimer == '06') {
        sleepTimerDesc = '22:30';
      } else if (sleepTimer == '07') {
        sleepTimerDesc = '23:00';
      } else if (sleepTimer == '08') {
        sleepTimerDesc = '23:30';
      }
      let alarm = configManager.getAlarm(this.data.connected.deviceId);
      if (util.isNotEmptyObject(alarm)) {
        if (alarm.isOpenAlarm) {
          alarmStatus = '已开启';
        } else {
          if (alarm.time) {
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
      alarmStatus: alarmStatus,
      sleepTimer: sleepTimer,
      sleepTimerDesc: sleepTimerDesc,
      currentSelectedTimerId: sleepTimer,
      currentSelectedTimerName: sleepTimerDesc
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


  smart: function (e) {
    // wx.navigateTo({
    //   url: '/pages/smart/smart'
    // })
    this.setData({
      timerDialogShow: true
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
      // 发送设置定时指令
      var connected = this.data.connected;
      let currentSelectedTimerId = this.data.currentSelectedTimerId;
      let cmd = 'FFFFFFFF02000D0B' + currentSelectedTimerId + '1704';
      util.sendBlueCmd(connected, cmd);
      let currentSelectedTimerName = this.data.currentSelectedTimerName;
      app.globalData.sleepTimer = currentSelectedTimerId;
      this.setData({
        sleepTimer: currentSelectedTimerId,
        sleepTimerDesc: currentSelectedTimerName
      })
    }
  },
})