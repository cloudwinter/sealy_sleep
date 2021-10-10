// component/tab/sleep/sleep.js
// component/dengguang/dengguang.js

const app = getApp();
const util = require('../../../utils/util')
const WxNotificationCenter = require('../../../utils/WxNotificationCenter')
const crcUtil = require('../../../utils/crcUtil');
const configManager = require('../../../utils/configManager');



Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    skin: app.globalData.skin,
    display: app.globalData.display,
    screenHeight: app.globalData.screenHeight,
    connected: {},
    currentSelected: '',
    canEdit: true,
    startGetRTDB: false,
    tezhegnzhi: 10,
    fuzhuzhi: 10,
    shenggao: 168,
    tizhong: 55,
    ptTezhengzhi: 120,
    ctTezhengzhi: 120,
    ptBeibujiaodu: 5,
    ctBeibujiaodu: 5,
    zhinengShuimian: false,
    zhinengYedeng: false,
    showExceptionParamDialog: false,
    topClickTime: 0,
  },


  pageLifetimes: {
    show: function () {
      // 设置当前的皮肤样式
      this.setData({
        skin: app.globalData.skin,
        screenHeight: app.globalData.screenHeight - 52
      })
    }
  },

  lifetimes: {
    created: function () {
      // 在组件实例刚刚被创建时执行
      console.info("sleep-->created", app.globalData.display);
      var that = this;
      WxNotificationCenter.addNotification("INIT", that.initConnected, that);
      WxNotificationCenter.addNotification("BLUEREPLY", that.blueReply, that);
      WxNotificationCenter.addNotification("VIEWSHOW", that.viewShow, that);
    },
    attached: function () {
      // 在组件实例进入页面节点树时执行
      console.info("sleep-->attached");
      this.setData({
        display: app.globalData.display
      })
      let that = this
      setTimeout(() => {
        that.setData({
          showExceptionParamDialog: true
        })
      }, 5000);
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
      console.info("sleep-->detached");
      var that = this;
      WxNotificationCenter.removeNotification("INIT", that);
      WxNotificationCenter.removeNotification("BLUEREPLY", that);
    },
  },


  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 发送蓝牙命令
     */
    sendBlueCmd(cmd, options) {
      var connected = this.data.connected;
      util.sendBlueCmd(connected, cmd, options);
    },

    /**
     * 连接后初始化
     * @param {*} connected 
     */
    initConnected(connected) {
      var that = this.observer;
      console.info('sleep->initConnected:', connected, this.observer);
      let saveStatus = configManager.getSleepTabSaveStatus(connected.deviceId);
      let zhinengShuimian = app.globalData.zhinengShuimian;
      that.setData({
        connected: connected,
        canEdit: !saveStatus,
        zhinengShuimian: zhinengShuimian
      })
    },

    /**
     * 界面显示
     */
    viewShow() {
      // 询问各个开关的状态
      var that = this.observer;
      that.sendBlueCmd('FFFFFFFF02000A0A1204');
    },



    /**
     * 蓝牙回复回调
     * @param {*} cmd 
     */
    blueReply(cmd) {
      var that = this.observer;
      cmd = cmd.toUpperCase();
      var prefix = cmd.substr(0, 16);
      if (prefix == 'FFFFFFFF02000A14') {
        // 开关状态回复
        let shenggao = util.str16To10(cmd.substr(16, 2));
        let tizhong = util.str16To10(cmd.substr(18, 2));
        let ptTezhengzhi = util.str16To10(cmd.substr(20, 2)) * 2;
        let ctTezhengzhi = util.str16To10(cmd.substr(22, 2)) * 2;
        let ptBeibujiaodu = util.str16To10(cmd.substr(28, 1));
        let ctBeibujiaodu = util.str16To10(cmd.substr(29, 1));
        let zhinengShuimian = cmd.substr(32, 2) == '01' ? true : false;
        let zhinengYedeng = cmd.substr(34, 2) == '01' ? true : false;
        that.setData({
          shenggao: shenggao,
          tizhong: tizhong,
          ptTezhengzhi: ptTezhengzhi,
          ctTezhengzhi: ctTezhengzhi,
          ptBeibujiaodu: ptBeibujiaodu,
          ctBeibujiaodu: ctBeibujiaodu,
          zhinengShuimian: zhinengShuimian,
          zhinengYedeng: zhinengYedeng,
        })
        app.globalData.zhinengShuimian = zhinengShuimian;
        return;
      }
      var prefixRTDB = cmd.substr(0, 18);
      if (prefixRTDB == 'FFFFFFFF0200090F03') {
        let AAAA = cmd.substr(20, 2) + cmd.substr(18, 2);
        let KKKK = cmd.substr(24, 2) + cmd.substr(22, 2);
        let tezhegnzhi = util.str16To10(AAAA);
        let fuzhuzhi = util.str16To10(KKKK);
        that.setData({
          tezhegnzhi: tezhegnzhi,
          fuzhuzhi: fuzhuzhi
        })
        return;
      }
      if (prefixRTDB == 'FFFFFFFF0200090D01') {
        let AAAA = cmd.substr(20, 2) + cmd.substr(18, 2);
        let tezhegnzhi = util.str16To10(AAAA);
        let showExceptionParamDialog = false;
        if (tezhegnzhi >= 100) {
          showExceptionParamDialog = true;
        }
        that.setData({
          tezhegnzhi: tezhegnzhi,
          ptTezhengzhi: tezhegnzhi,
          showExceptionParamDialog: showExceptionParamDialog
        })
        return;
      }
      if (prefixRTDB == 'FFFFFFFF0200090D02') {
        let AAAA = cmd.substr(20, 2) + cmd.substr(18, 2);
        let tezhegnzhi = util.str16To10(AAAA);
        let showExceptionParamDialog = false;
        if (tezhegnzhi <= 50) {
          showExceptionParamDialog = true;
        }
        that.setData({
          tezhegnzhi: tezhegnzhi,
          ctTezhengzhi: tezhegnzhi,
          showExceptionParamDialog: showExceptionParamDialog
        })
        return;
      }

    },







    /**********************点击事件************* */

    /**
     * 获取实时数值
     */
    getRTDB() {
      let topClickTime = this.data.topClickTime;
      let currentTime = new Date().getTime();
      if (currentTime - topClickTime < 2000) {
        console.info('getRTDB 连接点击事件小于2s 不处理');
        return;
      }

      let startGetRTDB = this.data.startGetRTDB;
      this.setData({
        startGetRTDB: !startGetRTDB,
        topClickTime: currentTime,
      })
      console.info('点击获取实时数值按钮');
      this.getRepeatRTDB(0);
    },

    /**
     * 重复获取实时数值
     * @param {}} count 
     */
    getRepeatRTDB(count) {
      let startGetRTDB = this.data.startGetRTDB;
      if (!startGetRTDB) {
        console.info('getRepeatRTDB 停止获取实时数值');
        return;
      }
      if (count > 30) {
        // 最多重复30次
        this.setData({
          startGetRTDB: !startGetRTDB,
        })
        console.info('getRepeatRTDB 最多重复30次获取实时数值');
        return;
      }
      console.info('getRepeatRTDB 重复获取实时数值 第' + count + '次');
      this.sendBlueCmd('FFFFFFFF0200090F03000000001904');
      count++;
      let that = this;
      setTimeout(() => {
        that.getRepeatRTDB(count);
      }, 2000);
    },

    /**
     * 点击平躺
     */
    getPT() {
      this.sendBlueCmd('FFFFFFFF0200090D0100001504');
    },

    /**
     * 点击侧躺
     */
    getCT() {
      this.sendBlueCmd('FFFFFFFF0200090D0200001604');
    },

    /**
     * 切换智能睡眠
     * @param {*} type 
     */
    switchSM() {
      let zhinengShuimian = this.data.zhinengShuimian;
      this.setData({
        zhinengShuimian: !zhinengShuimian
      })
    },

    /**
     * 切换智能夜灯
     */
    switchYD() {
      let zhinengYedeng = this.data.zhinengYedeng;
      this.setData({
        zhinengYedeng: !zhinengYedeng
      })
    },

    /**
     * 输入框监听事件
     * @param {*} e 
     */
    inputChange(e) {
      let val = e.detail.value;
      let dataType = e.currentTarget.dataset.type;
      console.info("inputChange", dataType, val);
      if (dataType == 'ptBeibujiaodu') {
        if (val > 10) {
          val = 10;
        }
        this.setData({
          ptBeibujiaodu: val
        })
        return val;
      } else if (dataType == 'ctBeibujiaodu') {
        if (val > 10) {
          val = 10;
        }
        this.setData({
          ctBeibujiaodu: val
        })
        return val;
      } else if (dataType == 'ptTezhengzhi') {
        if (val > 100) {
          val = 100;
        }
        this.setData({
          ptTezhengzhi: val
        })
        return val;
      } else if (dataType == 'ctTezhengzhi') {
        if (val > 500) {
          val = 500;
        } else if (val < 50) {
          val = 50
        }
        this.setData({
          ctTezhengzhi: val
        })
        return val;
      } else if (dataType == 'shenggao') {
        if (val > 255) {
          val = 255;
        }
        this.setData({
          shenggao: val
        })
        return val;
      } else if (dataType == 'tizhong') {
        if (val > 255) {
          val = 255;
        }
        this.setData({
          tizhong: val
        })
        return val;
      }
    },

    /**
     * 跳转到睡眠感应界面
     */
    jumpSleep() {
      wx.navigateTo({
        url: '/pages/induction/induction'
      })
    },

    /**
     * 保存
     */
    save() {
      let canEdit = this.data.canEdit;
      let connected = this.data.connected;
      configManager.putSleepTabSaveStatus(!canEdit, connected.deviceId)
      if (!canEdit) {
        this.setData({
          canEdit: true
        })
        return;
      }
      let cmdPrefix = 'FFFFFFFF02000B14';
      let DD = util.str10To16(this.data.shenggao == '' ? 0 : this.data.shenggao);
      let EE = util.str10To16(this.data.tizhong == '' ? 0 : this.data.tizhong);
      console.info('save', DD, EE);
      let BB = util.str10To16(parseInt(this.data.ptTezhengzhi / 2));
      let CC = util.str10To16(parseInt(this.data.ctTezhengzhi / 2));
      let RS = '00';
      let UV = '00';
      let G = util.str10To16(this.data.ptBeibujiaodu).substr(1, 1);
      let H = util.str10To16(this.data.ctBeibujiaodu).substr(1, 1);
      let MN = '00';
      let SS = this.data.zhinengShuimian ? '01' : '00';
      let LL = this.data.zhinengYedeng ? '01' : '00';
      let cmd = cmdPrefix + DD + EE + BB + CC + RS + UV + G + H + MN + SS + LL;
      let XXYY = crcUtil.HexToCSU16(cmd);
      cmd = cmd + XXYY;
      let that = this;
      this.sendBlueCmd(cmd, ({
        success: (res) => {
          console.info('save->发送成功');
          that.setData({
            canEdit: false
          })
          app.globalData.zhinengShuimian = SS;
        },
        fail: (res) => {
          console.error('save->发送失败', res);
          util.showToast("通讯不成功，请检查硬件连接");
        }
      }));
    },

    onModalClick() {
      this.setData({
        showExceptionParamDialog: false
      })
    },
  }
})