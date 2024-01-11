// pages/standard/standard.js
const app = getApp();
const util = require('../../../utils/util')
const WxNotificationCenter = require('../../../utils/WxNotificationCenter')
const askPrefix = 'FFFFFFFF0300'; // 询问码前缀
const sendPrefix = 'FFFFFFFF050000'; // 发送码前缀
const sendXHPrefix = 'FFFFFFFF050005'; // 循环发送码前缀
Component({

  /**
   * 页面的初始数据
   */
  data: {
    skin: app.globalData.skin,
    imgSanjiao: {
      imgSanjiaoBottomSelected: '../../../images/' + app.globalData.skin + '/sanjiao-bottom-selected@3x.png',
      imgSanjiaoBottomNormal: '../../../images/' + app.globalData.skin + '/sanjiao-bottom-normal@3x.png',
      imgSanjiaoTopSelected: '../../../images/' + app.globalData.skin + '/sanjiao-top-selected@3x.png',
      imgSanjiaoTopNormal: '../../../images/' + app.globalData.skin + '/sanjiao-top-normal@3x.png'
    },
    connected: {},
    startTime: '',
    endTime: '',
    jiyi1: false,
    kandianshi: false,
    lingyali: false,
    askType: '1', // 记忆类型 记忆1，记忆2
  },


  lifetimes: {
    created: function () {
      // 在组件实例刚刚被创建时执行
      console.info("weitiao-W4-->created");
      var that = this;
      WxNotificationCenter.addNotification("INIT", that.initConnected, that);
      WxNotificationCenter.addNotification("BLUEREPLY", that.blueReply, that);
      WxNotificationCenter.addNotification("VIEWSHOW", that.viewShow, that);
    },
    attached: function () {
      // 在组件实例进入页面节点树时执行
      console.info("attached");
      this.setData({
        display: app.globalData.display
      })
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
      console.info("detached");
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  methods: {
    /**
     * 连接后初始化
     * @param {*} connected 
     */
    initConnected(connected) {
      var that = this.observer;
      console.info('jindian>initConnected:', connected, this.observer);
      that.setData({
        connected: connected,
      })
      WxNotificationCenter.removeNotification("INIT", that);
      that.askJiyiStatus(connected, that);
    },


    /**
     * 询问记忆状态
     */


    askJiyiStatus(connected, cur) {
      var name = connected.name.toUpperCase();
      if (name.indexOf('QMS-MQ') >= 0 || name.indexOf('QMS2') >= 0 || name.indexOf('SEALY') >= 0) {
        cur.setData({
          askType: '2'
        })
        // 记忆1
        var jiyi1 = '2800039F09';
        // 记忆2
        var jiyi2 = '3000031F0E';
        // 看电视
        var kandianshi = '1800039F06';
        // 零压力
        var lingyali = '2000031ECB';
        // 止鼾
        var zhihan = '3800039ECC';
        setTimeout(() => {
          cur.sendAskBlueCmd(jiyi1)
        }, 100);
        setTimeout(() => {
          this.sendAskBlueCmd(jiyi2)
        }, 200);
        setTimeout(() => {
          this.sendAskBlueCmd(kandianshi)
        }, 300);
        setTimeout(() => {
          this.sendAskBlueCmd(lingyali)
        }, 400);
        setTimeout(() => {
          this.sendAskBlueCmd(zhihan)
        }, 500);
      } else {
        cur.setData({
          askType: '1'
        })
        // 记忆1
        var jiyi1 = '2800091F0E';
        // 记忆2
        var jiyi2 = '310009CEC9';
        // 看电视
        var kandianshi = '1600097EC2';
        // 零压力
        var lingyali = '1F0009AEC0';
        // 止鼾
        var zhihan = '3A0009BF0B';
        setTimeout(() => {
          cur.sendAskBlueCmd(jiyi1)
        }, 100);
        setTimeout(() => {
          this.sendAskBlueCmd(jiyi2)
        }, 200);
        setTimeout(() => {
          this.sendAskBlueCmd(kandianshi)
        }, 300);
        setTimeout(() => {
          this.sendAskBlueCmd(lingyali)
        }, 400);
        setTimeout(() => {
          this.sendAskBlueCmd(zhihan)
        }, 500);
      }
      setTimeout(() => {
        this.sendSleepAskBlueCmd()
      }, 800);

      setTimeout(() => {
        this.sendSleepAskBlueCmd()
      }, 1200);

    },

    /**
     * 发送询问记忆状态命令
     * @param {}} cmd 
     */
    sendAskBlueCmd(cmd) {
      var connected = this.data.connected;
      util.sendBlueCmd(connected, askPrefix + cmd);
    },

     /**
     * 发送智能睡眠记忆状态命令
     */
    sendSleepAskBlueCmd() {
      var connected = this.data.connected;
      util.sendBlueCmd(connected, 'FFFFFFFF02000A0A1204');
    },


    /**
     * 发送蓝牙命令
     */
    sendBlueCmd(cmd, options) {
      var connected = this.data.connected;
      util.sendBlueCmd(connected, sendPrefix + cmd, options);
      app.globalData.zhinengShuimian = '00';
    },

    /**
     * 循环蓝牙发送命令
     * @param {}} cmd 
     * @param {*} options 
     */
    sendBlueXHCmd(cmd, options) {
      var connected = this.data.connected;
      util.sendBlueCmd(connected, sendXHPrefix + cmd, options);
    },


    /***************** 点击事件 */
    /**
     * 按下事件
     * @param {*} e 
     */
    touchStart(e) {
      this.startTime = e.timeStamp;
      console.log("touchStart", this.startTime);
      var type = e.currentTarget.dataset.type;
      if (type == 'beibutzTop') {
        this.tapBeibutz(true, true);
      } else if (type == 'beibutzBottom') {
        this.tapBeibutz(false, true);
      } else if (type == 'tuibutzTop') {
        this.tapTuibutz(true, true);
      } else if (type == 'tuibutzBottom') {
        this.tapTuibutz(false, true);
      }
    },
    /**
     * 抬起事件
     * @param {*} e 
     */
    touchEnd(e) {
      this.endTime = e.timeStamp;
      console.log("touchEnd", this.endTime);
      var type = e.currentTarget.dataset.type;
      if (type == 'beibutzTop') {
        this.tapBeibutz(true, false);
      } else if (type == 'beibutzBottom') {
        this.tapBeibutz(false, false);
      } else if (type == 'tuibutzTop') {
        this.tapTuibutz(true, false);
      } else if (type == 'tuibutzBottom') {
        this.tapTuibutz(false, false);
      }
    },


    /**
     * 判断单击 1 和长按 2 事件 其他0
     * @param {*} e 
     */
    longClick() {
      if (this.endTime - this.startTime > 1000) {
        console.log("长按了");
        return true;
      }
      return false;
    },

    /**
     * 背部调整
     * @param {*} top 上
     * @param {*} start 按下
     */
    tapBeibutz(top, start) {
      var cmd = '';
      if (!start) {
        // 松开 发停止码
        cmd = '0000D700';
        this.sendBlueCmd(cmd);
      } else {
        // 按下
        if (top) {
          cmd = '00039701';
        } else {
          cmd = '0004D6C3';
        }
        this.sendBlueCmd(cmd);
      }
    },


    /**
     * 腿部调整
     * @param {*} top 上
     * @param {*} start 按下
     */
    tapTuibutz(top, start) {
      var cmd = '';
      if (!start) {
        // 松开 发停止码
        cmd = '0000D700';
        this.sendBlueCmd(cmd);
      } else {
        // 按下
        if (top) {
          cmd = '00065702';
        } else {
          cmd = '000796C2';
        }
        this.sendBlueCmd(cmd);
      }
    },


    /**
     * 复原的点击事件
     */
    tapFuyuan() {
      console.info("tapFuyuan");
      // 单击
      this.sendBlueCmd('0008D6C6');
    },

    


    /**
     * 记忆1的点击事件
     */
    tapJiyi1() {
      console.info("tapJiyi1");
      var that = this;
      var longClick = this.longClick();
      var jiyi1Status = this.data.jiyi1;
      if (!jiyi1Status) {
        // 无记忆
        if (longClick) {
        // 长按
        this.sendBlueCmd('A00A2F07', ({
          success: (res) => {
            console.info('tapJiyi1->发送成功');
            that.setData({
              jiyi1: true
            });
          },
          fail: (res) => {
            console.error('tapJiyi1->发送失败', res);
          }
        }));
        }
      } else {
        // 有记忆
        if (longClick) {
          // 长按
          this.sendBlueCmd('AF0A2AF7', ({
            success: (res) => {
              console.info('tapJiyi1->发送成功');
              that.setData({
                jiyi1: false
              });
            },
            fail: (res) => {
              console.error('tapJiyi1->发送失败', res);
            }
          }));

        } else {
          // 单击
        this.sendBlueCmd('A10A2E97');
        }
      }
    },

    tapKandianshi() {
      console.info("tapKandianshi");
      var that = this;
      var longClick = this.longClick();
      var kandianshiStatus = this.data.kandianshi;
      if (!kandianshiStatus) {
        // 无记忆
        if (longClick) {
          // 长按
          this.sendBlueCmd('50052B03', ({
            success: (res) => {
              console.info('kandianshi->发送成功');
              that.setData({
                kandianshi: true
              });
            },
            fail: (res) => {
              console.error('kandianshi->发送失败', res);
            }
          }));
        } else {
          // 单击
          this.sendBlueCmd('00051703');
        }
      } else {
        // 有记忆
        if (longClick) {
          // 长按
          this.sendBlueCmd('5F052EF3', ({
            success: (res) => {
              console.info('kandianshi->发送成功');
              that.setData({
                kandianshi: false
              });
            },
            fail: (res) => {
              console.error('kandianshi->发送失败', res);
            }
          }));

        } else {
          // 单击
          this.sendBlueCmd('51052A93');
        }
      }
    },


    /**
     * 零压力的点击事件
     */
    tapLingyali() {
      console.info("tapLingyali");
      var that = this;
      var longClick = this.longClick();
      var lingyaliStatus = this.data.lingyali;
      if (!lingyaliStatus) {
        // 无记忆
        if (longClick) {
          // 长按
          this.sendBlueCmd('90097B06', ({
            success: (res) => {
              console.info('tapLingyali->发送成功');
              that.setData({
                lingyali: true
              });
            },
            fail: (res) => {
              console.error('tapLingyali->发送失败', res);
            }
          }));
        } else {
          // 单击
          this.sendBlueCmd('00091706');
        }
      } else {
        // 有记忆
        if (longClick) {
          // 长按
          this.sendBlueCmd('9F097EF6', ({
            success: (res) => {
              console.info('tapLingyali->发送成功');
              that.setData({
                lingyali: false
              });
            },
            fail: (res) => {
              console.error('tapLingyali->发送失败', res);
            }
          }));

        } else {
          // 单击
          this.sendBlueCmd('91097A96');
        }
      }
    },

  },
})