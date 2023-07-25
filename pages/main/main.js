const configManager = require('../../utils/configManager')
const time = require('../../utils/time');
const util = require('../../utils/util')
const WxNotificationCenter = require('../../utils/WxNotificationCenter')
const crcUtil = require('../../utils/crcUtil')
const app = getApp();
const weekArray = [
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
  '日',
];

Page({
  data: {
    skin: app.globalData.skin,
    hasBottonLine: app.globalData.hasBottonLine,
    navbar: {
      loading: false,
      color: '#FFFFFF',
      show: true,
      animated: false,
    },
    nowPage: "kuaijie",
    nowIndex: 0,
    tabBar: [{
        "selectedIconPath": "../../images/" + app.globalData.skin + "/tab_kuaijie_selected@2x.png",
        "iconPath": "../../images/" + app.globalData.skin + "/tab_kuaijie_normal@2x.png",
        "text": "快捷",
        "tapFunction": "toKuaijie",
        "active": "active",
        "show": true
      },
      {
        "selectedIconPath": "../../images/" + app.globalData.skin + "/tab_smartbed_selected@2x.png",
        "iconPath": "../../images/" + app.globalData.skin + "/tab_smartbed_normal@2x.png",
        "text": "智能床",
        "tapFunction": "toSmartBed",
        "active": "active",
        "show": false
      },
      {
        "selectedIconPath": "../../images/" + app.globalData.skin + "/tab_weitiao_selected@2x.png",
        "iconPath": "../../images/" + app.globalData.skin + "/tab_weitiao_normal@2x.png",
        "text": "微调",
        "tapFunction": "toWeitiao",
        "active": "",
        "show": true
      },
      {
        "selectedIconPath": "../../images/" + app.globalData.skin + "/tab_anno_selected@2x.png",
        "iconPath": "../../images/" + app.globalData.skin + "/tab_anno_normal@2x.png",
        "text": "按摩",
        "tapFunction": "toAnmo",
        "active": "active",
        "show": true
      },
      {
        "selectedIconPath": "../../images/" + app.globalData.skin + "/tab_dengguang_selected@2x.png",
        "iconPath": "../../images/" + app.globalData.skin + "/tab_dengguang_normal@2x.png",
        "text": "灯光",
        "tapFunction": "toDengguang",
        "active": "",
        "show": true
      },
      {
        "selectedIconPath": "../../images/" + app.globalData.skin + "/tab_sleep_selected@2x.png",
        "iconPath": "../../images/" + app.globalData.skin + "/tab_sleep_normal@2x.png",
        "text": "智能睡眠",
        "tapFunction": "toSmartSleep",
        "active":"",
        "show":false,
      },
      {
        "selectedIconPath": "../../images/" + app.globalData.skin + "/编组 17.png",
        "iconPath": "../../images/" + app.globalData.skin + "/编组 17备份.png",
        "text": "智能检测",
        "tapFunction": "jumpToApp",
        "active": "",
        "show": false

      },
      {
        "selectedIconPath": "../../images/" + app.globalData.skin + "/售后无忧.png",
        "iconPath": "../../images/" + app.globalData.skin + "/售后无忧备份.png",
        "text": "售后&OA",
        "tapFunction": "shouhouOA",
        "active": "",
        "show": true
      }
    ],
   
    periodList: [{
        id: 1,
        name: '周一',
        checked: false
      },
      {
        id: 2,
        name: '周二',
        checked: false
      },
      {
        id: 3,
        name: '周三',
        checked: false
      },
      {
        id: 4,
        name: '周四',
        checked: false
      },
      {
        id: 5,
        name: '周五',
        checked: false
      },
      {
        id: 6,
        name: '周六',
        checked: false
      },
      {
        id: 7,
        name: '周日',
        checked: false
      },
    ],
    kuaijieType: 'K2',
    weitiaoType: 'W4',
    connected: {},
    sleepClickTime: 0,
    kuaijieClickTime: 0,
    smartBedClickTime: 0,
    smartSleepClickTime: 0,
    mac:"",
    appId:"",
  },
  jumpToApp: function (e) {
    
    this.setData({
      nowIndex: 6
    })
    var jumpPath = 'pages/index/index?mac=' + this.data.mac;
    wx.navigateToMiniProgram({
      appId: "wxbbdd4b1b88358610",
      path: jumpPath,
      envVersion: 'trial', //develop,trial,release
      success(res) {
        // 打开成功
        console.info('跳转成功');
      }
    })
  },
  shouhouOA(){
    
    this.setData({
     nowPage:"shouhou",
     nowIndex: 7, 
    })
  },
  /**
   * 初始化加载
   */
  onLoad: function (option) {
    
    console.info('main.Onshow');
    if (option && option.connected) {
      console.info("main.onLoad option", option);
      var connected = JSON.parse(option.connected);
      console.info("main->onLoad connected:", connected);
      this.setData({
        connected: connected,
        kuaijieType: option.kuaijieType,
        weitiaoType: option.weitiaoType
      })
      
      this.notifyBLECharacteristicValueChange();
      
    } 
  },
  sendInitCmda() {
    var that = this
    // 发码询问主板是否连接心率带
    setTimeout(() => {
      that.sendBlueCmd('FFFFFFFF01000C0B0F2304');
    }, 5000);
  },
  /**
   * 显示时触发
   */
  onShow: function () {
   
    // 获取皮肤
    this.sendInitCmda()
    console.info('main.Onshow');
    var skin = app.globalData.skin;
    this.setData({
      skin: skin
    })

    //this.showStressBeltTab();
  },


  /**
   * 发送蓝牙命令
   * @param {*} cmd 
   */
  sendBlueCmd(cmd) {
    util.sendBlueCmd(this.data.connected, cmd);
  },


  /**
   * 初始化发送时间校验闹钟请求
   */
  sendRequestAlarmCmd() {
    console.info('main->sendInitCmd 发送闹钟指令 time ', new Date().getTime());
    let cmdPrefix = 'FFFFFFFF01000111';
    let date = time.getDateInfo(new Date());
    let cmdTime = date.hour + date.minute + date.second + date.week + date.year + date.month + date.day;
    let cmdCrc = crcUtil.HexToCSU16(cmdPrefix + cmdTime);
    let cmd = cmdPrefix + cmdTime + cmdCrc;
    console.log('sendRequestAlarmCmd:', cmd);

    this.sendBlueCmd(cmd);

  },


  /******------>tab切换 start */


  toKuaijie() {
    let kuaijieClickTime = this.data.kuaijieClickTime;
    let currentTime = new Date().getTime();
    if (currentTime - kuaijieClickTime > 1000) {
      WxNotificationCenter.postNotificationName('VIEWSHOW');
    }
    this.setData({
      nowPage: "kuaijie",
      nowIndex: 0,
      kuaijieClickTime: currentTime
    })
  },

  toSmartBed() {
    let smartBedClickTime = this.data.smartBedClickTime;
    let currentTime = new Date().getTime();
    if (currentTime - smartBedClickTime > 1000) {
      WxNotificationCenter.postNotificationName('TAB_SMARTBED');
    }
    this.setData({
      nowPage: "smartbed",
      nowIndex: 1,
      smartBedClickTime: currentTime
    })
  },

  toWeitiao() {
    this.setData({
      nowPage: "weitiao",
      nowIndex: 2
    })
  },

  toAnmo() {
    this.setData({
      nowPage: "anmo",
      nowIndex: 3
    })
  },
  toDengguang() {
    this.setData({
      nowPage: "dengguang",
      nowIndex: 4
    })
  },

  toSmartSleep() {
    let smartSleepClickTime = this.data.smartSleepClickTime;
    let currentTime = new Date().getTime();
    if (currentTime - smartSleepClickTime > 1000) {
      WxNotificationCenter.postNotificationName('TAB_SMARTSLEEP');
    }
    this.setData({
      nowPage: "smartsleep",
      nowIndex: 5,
      smartSleepClickTime: currentTime
    })
  },

  /**
   * 设置压力带显示的tab
   */
  showStressBeltTab() {
    let tabbar = this.data.tabBar;
    tabbar[0].show = false;
    tabbar[1].show = true;
    tabbar[2].show = false;
    tabbar[3].show = true;
    tabbar[4].show = true;
    tabbar[5].show = true;
    this.setData({
      tabBar: tabbar,
      // nowPage: "smartbed",
      // nowIndex: 1,
    })

  },

  /**
   * 设置默认显示的tab
   */
  showDefaultTab() {
    let tabbar = this.data.tabBar;
    tabbar[0].show = true;
    tabbar[1].show = false;
    tabbar[2].show = true;
    tabbar[3].show = true;
    tabbar[4].show = true;
    tabbar[5].show = false;
    this.setData({
      tabBar: tabbar,
      nowPage: "kuaijie",
      nowIndex: 0,
    })
  },

  /******------>tab切换 end */


  /*******-------------->蓝牙回调 start */
  /**
   * 获取连接设备的service服务
   */
  getBLService(deviceId) {
    var that = this;
    wx.getBLEDeviceServices({
      deviceId: deviceId,
      success: function (res) {
        console.log('device services:', JSON.stringify(res.services));
        var services = res.services;
        if (services && services.length > 0) {
          for (let i = 0; i < services.length; i++) {
            if (services[i].isPrimary) {
              // 获取 主serviceId 
              console.log('getBLEDeviceServices:[' + i + "]", services[i])
              that.setData({
                ['connected.serviceId']: services[i].uuid
              })
              setTimeout(function () {
                //获取characterstic值
                that.getBLcharac(deviceId, services[i].uuid);
              }, 100)
              return;
            }
          }
        }
      },
      fail: function (res) {
        wx.hideLoading();
        util.showModal(res.errMsg);
      }
    })
  },

  /**
   * 获取特征值
   * @param {*} deviceId 
   * @param {*} serviceId 
   */
  getBLcharac(deviceId, serviceId) {
    var that = this;
    wx.getBLEDeviceCharacteristics({
      deviceId: deviceId,
      serviceId: serviceId,
      success: function (res) {
        console.log("getBLcharac", res);
        for (var i = 0; i < res.characteristics.length; i++) {
          if (res.characteristics[i].properties.notify) {
            console.log("getBLcharac", res.characteristics[i].uuid);
            that.setData({
              ['connected.notifyCharacId']: res.characteristics[i].uuid
            })
          }
          if (res.characteristics[i].properties.write) {
            that.setData({
              ['connected.writeCharacId']: res.characteristics[i].uuid
            })
          } else if (res.characteristics[i].properties.read) {
            that.setData({
              ['connected.readCharacId']: res.characteristics[i].uuid
            })
          }
        }
        console.log('device connected:', that.data.connected);
        that.notifyBLECharacteristicValueChange()
      },
      fail: function (res) {
        console.error("getBLcharac->fail", res);

        util.showModal(res.errMsg);
      },
      complete: function () {
        wx.hideLoading();

      }
    })
  },




  /**
   * 开启监听
   */
  notifyBLECharacteristicValueChange: function () {
    var that = this;
    var connected = this.data.connected;
    wx.notifyBLECharacteristicValueChange({
      state: true, // 启用 notify 功能  
      deviceId: connected.deviceId,
      serviceId: connected.serviceId,
      characteristicId: connected.notifyCharacId,
      success: function () {
        console.info("notifyBLECharacteristicValueChange->success");
        // 初始化通知
        that.sendInitCmd(that.data.connected);
      },
      fail: function (res) {
        console.error("main->notifyBLECharacteristicValueChange error", res);
        util.showModal('开启监听失败，请重新进入');
      }
    });
    wx.onBLECharacteristicValueChange((res) => {
      console.info('main->onBLECharacteristicValueChange', res);
      var buffer = res.value;
      var received = util.ab2hex(buffer);
      //received = 'ffffffff0200020f04010101011704'
      console.info('main->onBLECharacteristicValueChange-->received', received);
      that.blueReply(received, connected);
      WxNotificationCenter.postNotificationName('BLUEREPLY', received);
    });

  },

  /**
   * 蓝牙回传
   */
  onBLECharacteristicValueChange: function () {
    wx.onBLECharacteristicValueChange(function (res) {
      console.info('main->onBLECharacteristicValueChange2', res);
      var buffer = res.value;
      var received = util.ab2hex(buffer);
      console.info('main->onBLECharacteristicValueChange2-->received', received);
      WxNotificationCenter.postNotificationName('BLUEREPLY', received);
    })
  },
  /*******-------------->蓝牙回调 end */


  /**
   * 在各个页面发送指令之前发送指令
   */
  sendInitCmd: function (connected) {

    let that = this;

    that.sendBlueCmd('FFFFFFFF01000C0B0F2304');
    // 发送压力板指令
    console.info('main->sendInitCmd 发送压力指令 time', new Date().getTime());
    that.sendBlueCmd('FFFFFFFF02000E0B001704');

    // 延迟150ms发送时间指令
    setTimeout(function () {
      console.info('main->sendInitCmd 发送灯光指令 time', new Date().getTime());
      // 先发送灯光指令
      that.sendBlueCmd('FFFFFFFF050005FF23C728');

      setTimeout(function () {
        // 延时150ms页面初始化指令
        that.postInit(connected)
        // 延时150ms发送闹钟指令(时间校验指令)
        setTimeout(that.sendRequestAlarmCmd, 1000, connected);
      }, 150)
    }, 300)

  },







  /**
   * 页面初始化操作
   * @param {*} connected 
   */
  postInit: function (connected) {
    console.info('main->sendInitCmd 发送个页面指令 time ', new Date().getTime());
    WxNotificationCenter.postNotificationName('INIT', connected);
  },


  /**
   * 蓝牙回复
   * @param {*} received 
   */
  blueReply: function (received, connected) {
    
    console.info('main->blueReply-->received', received, connected);
    if (received) {
      received = received.toUpperCase();
      let deviceId = connected.deviceId;
      if (received.indexOf('FFFFFFFF0100030B00') >= 0 ||
        received.indexOf('FFFFFFFF01000413') >= 0) {
        // 有闹钟功能
        this.setAlarm(received, deviceId);
      } else if (received.indexOf('FFFFFFFF02000E0B') >= 0) {
        // 有智能睡眠感应
        this.showStressBeltTab();
        let nowIndex = this.data.nowIndex
        if (nowIndex == 0) {
          this.setData({
            nowPage: "smartbed",
            nowIndex: 1,
          })
        }
        this.setTimer(received, deviceId);
      }
    }
    var cmd  = received.toUpperCase()
    console.info("main->blueReply-->123")
    if (cmd.indexOf('FFFFFFFF01000C0B00') >= 0) {
      var tabbar = this.data.tabBar
      tabbar[6].show = false
      this.setData({
        tabBar : tabBar
      })
      return;
    } else if (cmd.indexOf('FFFFFFFF01000C0B01') >= 0) {
      var macCmd = cmd.substr(18, 12);
      var tabbar = this.data.tabBar
      tabbar[6].show = true
      this.setData({
        tabBar: tabBar,
        mac: macCmd,
        appId:'wxbbdd4b1b88358610'
      });
      return;
    } else if (cmd.indexOf('FFFFFFFF01000C0B02') >= 0){
      var macCmd = cmd.substr(18,12);
      var tabbar = this.data.tabBar
      tabbar[6].show = true
      this.setData ({
        tabBar: tabBar,
        mac:macCmd,
        appId:'wx89783978e44773d0'
      })
      return
    }
  },

  /**
   * 设置智能睡眠感应
   * @param {*} cmd 
   * @param {*} deviceId 
   */
  setTimer: function (cmd, deviceId) {
    console.error('main->setSmart-->设置智能睡眠定时', cmd, deviceId);
    app.globalData.hasSleepInduction = true;
    app.globalData.sleepTimer = cmd.substr(16, 2);
    WxNotificationCenter.postNotificationName('VIEWSHOW');
  },

  /**
   * 设置闹钟
   * @param {*} cmd 
   * @param {*} deviceId 
   */
  setAlarm: function (cmd, deviceId) {
    console.error('main->setAlarm-->开启闹钟设置', cmd, deviceId);
    let alarm = {};
    if (cmd.indexOf('FFFFFFFF0100030B00') >= 0) {
      // 有闹钟未设置
      configManager.putAlarmSwitch(true, deviceId);
      alarm.isOpenAlarm = false;
      configManager.putAlarm(alarm, deviceId);
    } else if (cmd.indexOf('FFFFFFFF01000413') >= 0) {

      // 有闹钟已设置
      configManager.putAlarmSwitch(true, deviceId)
      let cmdStatus = cmd.substr(16, 2);
      if ('0F' == cmdStatus) {
        // 开启
        alarm.isOpenAlarm = true;
      } else {
        // 关闭
        alarm.isOpenAlarm = false;
      }
      // 时间
      let timeHour = cmd.substr(18, 2);
      let timeMin = cmd.substr(20, 2);
      alarm.time = timeHour + ':' + timeMin;



      // 星期
      let cmdWeek = util.str16To2(cmd.substr(24, 2));
      let cmdweekArray = util.strToArray(cmdWeek, 1);
      let period = [];
      let periodDesc = '';
      for (let i = cmdweekArray.length - 2; i >= 0; i--) {
        if (cmdweekArray[i] == '1') {
          period.push(this.data.periodList[6 - i].id);
        }
      }
      console.log('main.alarm->blueReply :period:,' + period);
      if (period.length > 0) {
        period.forEach(j => {
          periodDesc += weekArray[j - 1];
        });
      } else {
        periodDesc = '不重复';
      }
      alarm.period = period;
      alarm.periodDesc = periodDesc;

      // 重复
      // let cmdRepeat = cmd.substr(26, 2);
      // alarm.repeat = cmdRepeat == '01' ? true : false;

      // 模式
      let cmdMode = cmd.substr(28, 2);
      if ('01' == cmdMode) {
        alarm.modeVal = 'lingyali';
        alarm.modeName = '零压力';
      } else if ('02' == cmdMode) {
        alarm.modeVal = 'jiyi1';
        alarm.modeName = '记忆一';
      } else {
        alarm.modeVal = 'close';
        alarm.modeName = '不动作';
      }

      // 按摩
      let cmdAnmo = cmd.substr(30, 2);
      alarm.anmo = '01' == cmdAnmo ? true : false;

      // 响铃
      let cmdRing = cmd.substr(32, 2);
      alarm.ring = '01' == cmdRing ? true : false;
      configManager.putAlarm(alarm, deviceId);
    }
  },











})