// component/kuaijie/kuaijie-K2.js
const util = require('../../../utils/util')
const crcUtil = require('../../../utils/crcUtil')
const WxNotificationCenter = require('../../../utils/WxNotificationCenter');
const configManager = require('../../../utils/configManager');
const app = getApp();
const askPrefix = 'FFFFFFFF0300'; // 询问码前缀
const askReply1Prefix = 'FFFFFFFF031200'; // 询问码1回复前缀
const askReply2Prefix = 'FFFFFFFF030600'; // 询问码2回复前缀
const sendPrefix = 'FFFFFFFF050000'; // 发送码前缀
const musicPrefix = 'FFFFFFFF0100130B' //音乐发码前缀
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的初始数据
   */
  data: {
    musicItems: [{
        value: '01',
        name: '波浪拍岸',
      },
      {
        value: '02',
        name: '清新自然',
      },
      {
        value: '03',
        name: '水洞蟋蟀',
      },
      {
        value: '04',
        name: '雨声绵绵',
      },
      {
        value: '05',
        name: '夏季蝉鸣',
      },
    ],
    skin: app.globalData.skin,
    display: app.globalData.display,
    connected: {},
    currentAnjian: {
      anjian: 'kandianshi', // kandianshi,lingyali,zhihan,fuyuan
      name: '看电视' // 看电视，零压力，止鼾，复原，
    },
    askType: '1', // 记忆类型 记忆1，记忆2
    jiyi1: false,
    jiyi2: false,
    kandianshi: false,
    lingyali: false,
    zhihan: false,
    startTime: '',
    endTime: '',
    hasSleepInduction: false,
    zhinengShuimian: '00',
    kjMusicType: 1, // 1标准，2带音乐
    musicDialogShow: false,
    musicSelectRadio: 'FF',
    musicSelected: 'FF',
    slideDialogShow: false, //音量对话框
    slideValue: 3,
  },


  /**
   * 页面的生命周期
   */
  pageLifetimes: {
    show: function () {
      // 设置当前的皮肤样式
      console.info("kuaijie-K2->show", app.globalData);
      let connected = configManager.getCurrentConnected();
      let hasSleepInduction = app.globalData.hasSleepInduction;
      let kjMusicType = 2;
      if (util.isNotEmptyObject(connected)) {
        kjMusicType = configManager.getKJAndAlarmType(connected.deviceId);
      }
      this.setData({
        hasSleepInduction: hasSleepInduction,
        skin: app.globalData.skin,
        kjMusicType: kjMusicType,
        slideDialogShow: false
      })
    }

  },

  lifetimes: {
    created: function () {
      // 在组件实例刚刚被创建时执行
      console.info("kuaijie-k2-->created");
      var that = this;
      WxNotificationCenter.addNotification("INIT", that.initConnected, that);
      WxNotificationCenter.addNotification("BLUEREPLY", that.blueReply, that);
      WxNotificationCenter.addNotification("VIEWSHOW", that.viewShow, that);
    },
    ready: function () {
      // 在组件在视图层布局完成后执行
      console.info("kuaijie-k2-->ready");
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
      console.info("kuaijie-k2-->detached");
      var that = this;
      WxNotificationCenter.removeNotification("BLUEREPLY", that);
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 连接后初始化
     * @param {*} connected 
     */
    initConnected(connected) {
      var that = this.observer;
      console.info('kuaijie-K2->initConnected:', connected, this.observer);
      that.setData({
        connected: connected,
      })
      WxNotificationCenter.removeNotification("INIT", that);
      that.askJiyiStatus(connected, that);
    },

    viewShow() {
      var that = this.observer;
      console.info('kuaijie-K2->viewShow:', this.observer);
      let hasSleepInduction = app.globalData.hasSleepInduction;
      that.setData({
        hasSleepInduction: hasSleepInduction,
      })
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
     * 蓝牙回复回调
     * @param {*} cmd 
     */
    blueReply(cmd) {
      var that = this.observer;
      cmd = cmd.toUpperCase();
      if (cmd.indexOf('FFFFFFFF0100030B') >= 0 || cmd.indexOf('FFFFFFFF01000413') >= 0) {
        let kjMusicType = configManager.getKJAndAlarmType(that.data.connected.deviceId);
        that.setData({
          kjMusicType: kjMusicType
        })
      } else if (cmd.indexOf('FFFFFFFF0100150B') >= 0) {
        that.setData({
          slideValue: cmd.substr(17, 1)
        })
      }
      var prefix = cmd.substr(0, 14);
      console.info('kuaijie-k2->askBack', cmd, prefix);
      var askType = that.data.askType;
      if (askType == '1') {
        if (prefix == askReply1Prefix) {
          var status = cmd.substr(14, 2).toUpperCase();
          if ('AA' == status) {
            that.setData({
              jiyi1: true
            })
          }
          if ('AB' == status) {
            that.setData({
              jiyi2: true
            })
          }
          if ('A5' == status) {
            that.setData({
              kandianshi: true
            })
          }
          if ('A9' == status) {
            that.setData({
              lingyali: true
            })
          }
          if ('AF' == status) {
            that.setData({
              zhihan: true
            })
          }
        }
      } else {
        if (prefix == askReply2Prefix) {
          var status = cmd.substr(14, 2).toUpperCase();
          if ('0A' == status) {
            that.setData({
              jiyi1: true
            })
          }
          if ('0B' == status) {
            that.setData({
              jiyi2: true
            })
          }
          if ('05' == status) {
            that.setData({
              kandianshi: true
            })
          }
          if ('09' == status) {
            that.setData({
              lingyali: true
            })
          }
          if ('0F' == status) {
            that.setData({
              zhihan: true
            })
          }
        }
      }

      var sleepPrefix = cmd.substr(0, 16).toUpperCase();
      if (sleepPrefix == 'FFFFFFFF02000A14') {
        let zhinengShuimian = cmd.substr(32, 2);
        that.setData({
          zhinengShuimian: zhinengShuimian
        })
      }

    },


    /**
     * 发送智能睡眠记忆状态命令
     */
    sendAudioAskBlueCmd() {
      var connected = this.data.connected;
      let cmd = 'FFFFFFFF0100150B00';
      let sendCmd = cmd + crcUtil.HexToCSU16(cmd)
      util.sendBlueCmd(connected, sendCmd);
    },

    /**
     * 发送智能睡眠记忆状态命令
     */
    sendSleepAskBlueCmd() {
      var connected = this.data.connected;
      util.sendBlueCmd(connected, 'FFFFFFFF02000A0A1204');
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
     * 发送蓝牙命令
     */
    sendBlueCmd(cmd, options) {
      var connected = this.data.connected;
      util.sendBlueCmd(connected, sendPrefix + cmd, options);
      app.globalData.zhinengShuimian = '00';
      this.setData({
        zhinengShuimian: '00'
      })
    },

    /**
     * 发送蓝牙命令
     */
    sendFullBlueCmd(cmd, options) {
      var connected = this.data.connected;
      util.sendBlueCmd(connected, cmd, options);
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
      if (this.endTime - this.startTime > 1000) {
        console.log("长按了");
        return true;
      }
      return false;
    },



    /**
     * 空白处的点击事件
     */
    tapBlank(e) {
      console.info('tapBlank', e);
      this.sendBlueCmd('0000D700');
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



    /**
     * 记忆2的点击事件
     */
    tapJiyi2() {
      console.info("tapJiyi2");
      var that = this;
      var longClick = this.longClick();
      var jiyi2Status = this.data.jiyi2;
      if (!jiyi2Status) {
        // 无记忆
        if (longClick) {
          // 长按
          this.sendBlueCmd('B00BE307', ({
            success: (res) => {
              console.info('tapJiyi2->发送成功');
              that.setData({
                jiyi2: true
              });
            },
            fail: (res) => {
              console.error('tapJiyi2->发送失败', res);
            }
          }));
        }
      } else {
        // 有记忆
        if (longClick) {
          // 长按
          this.sendBlueCmd('BF0BE6F7', ({
            success: (res) => {
              console.info('tapJiyi2->发送成功');
              that.setData({
                jiyi2: false
              });
            },
            fail: (res) => {
              console.error('tapJiyi2->发送失败', res);
            }
          }));

        } else {
          // 单击
          this.sendBlueCmd('B10BE297');
        }
      }
    },


    /**
     * 看电视的点击事件
     */
    tapKandianshi() {
      console.info("tapKandianshi");
      this.setData({
        currentAnjian: {
          anjian: 'kandianshi',
          name: '看电视'
        }
      })
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
      this.setData({
        currentAnjian: {
          anjian: 'lingyali',
          name: '零压力'
        }
      })
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

    /**
     * 止鼾的点击事件
     */
    tapZhihan() {
      console.info("tapZhihan");
      this.setData({
        currentAnjian: {
          anjian: 'zhihan',
          name: '止鼾'
        }
      })
      var that = this;
      var longClick = this.longClick();
      var zhihanStatus = this.data.zhihan;
      if (!zhihanStatus) {
        // 无记忆
        if (longClick) {
          // 长按
          this.sendBlueCmd('F00FD304', ({
            success: (res) => {
              console.info('tapZhihan->发送成功');
              that.setData({
                zhihan: true
              });
            },
            fail: (res) => {
              console.error('tapZhihan->发送失败', res);
            }
          }));
        } else {
          // 单击
          this.sendBlueCmd('000F9704');
        }
      } else {
        // 有记忆
        if (longClick) {
          // 长按
          this.sendBlueCmd('FF0FD6F4', ({
            success: (res) => {
              console.info('tapZhihan->发送成功');
              that.setData({
                zhihan: false
              });
            },
            fail: (res) => {
              console.error('tapZhihan->发送失败', res);
            }
          }));

        } else {
          // 单击
          this.sendBlueCmd('F10FD294');
        }
      }
    },


    /**
     * 复原的点击事件
     */
    tapFuyuan() {
      console.info("tapFuyuan");
      this.setData({
        currentAnjian: {
          anjian: 'fuyuan',
          name: '复原'
        }
      })
      // 单击
      this.sendBlueCmd('0008D6C6');
    },

    /**
     * 睡前放松
     */
    tapShuiqianfangsong() {
      console.info("tapShuiqianfangsong");
      this.setData({
        currentAnjian: {
          anjian: 'shuiqianfangsong',
          name: '睡前放松'
        }
      })
      // 单击
      this.sendFullBlueCmd('FFFFFFFF050000006A572F');
    },

    /**
     * 助眠音乐
     */
    tapZhumianyinyue() {
      console.info("tapZhumianyinyue");
      this.setData({
        currentAnjian: {
          anjian: 'zhumianyinyue',
          name: '助眠音乐'
        }
      })
      var longClick = this.longClick();
      console.log(longClick);
      if (longClick) {
        // 长按
        this.sendFullBlueCmd('FFFFFFFF0100130B00' + crcUtil.HexToCSU16('FFFFFFFF0100130B00'))
        return
      } else {
        // 单击
        let cmd = 'FFFFFFFF0100130BFF';
        cmd = cmd + crcUtil.HexToCSU16(cmd);
        this.sendFullBlueCmd(cmd);
        return
      }

    },


    /**
     * 助眠音乐
     */
    tabSelectYinyue() {
      console.info("tabSelectYinyue");
      this.setData({
        musicDialogShow: true
      })
    },

    /**
     * 模式选择
     * @param {*} e 
     */
    musicRadioChange: function (e) {

      var cmd = musicPrefix + e.detail.value
      cmd = cmd + crcUtil.HexToCSU16(cmd);
      setTimeout(() => {
        console.log(cmd)
        this.sendFullBlueCmd(cmd)
      }, 500);

      this.setData({
        musicSelectRadio: e.detail.value
      })
    },


    /**
     * 模式选择点击
     * @param {*} e 
     */
    onModalMusicClick: function (e) {
      // let cType = e.currentTarget.dataset.ctype;
      // if (cType == 'cancel') {
      //   this.setData({
      //     musicDialogShow: false
      //   })
      //   return;
      // }
      this.sendFullBlueCmd('FFFFFFFF0100130B00' + crcUtil.HexToCSU16('FFFFFFFF0100130B00'))
      // let musicSelectRadio = this.data.musicSelectRadio;
      this.setData({
        musicDialogShow: false,
        // musicSelected: musicSelectRadio,
      })
      // let cmd = 'FFFFFFFF0100130B' + musicSelectRadio;
      // cmd = cmd + crcUtil.HexToCSU16(cmd);
      // this.sendFullBlueCmd(cmd);
    },


    /**
     * 智能睡眠设置
     * @param {*} e 
     */
    smart: function (e) {
      var connected = this.data.connected;
      let zhinengShuimian = this.data.zhinengShuimian;
      let cmd = '';
      if (zhinengShuimian == '01') {
        cmd = 'FFFFFFFF050000F03FD310'
        zhinengShuimian = '00';
      } else {
        cmd = 'FFFFFFFF050000003F9710'
        zhinengShuimian = '01';
      }
      util.sendBlueCmd(connected, cmd);
      this.setData({
        zhinengShuimian: zhinengShuimian
      })
      app.globalData.zhinengShuimian = zhinengShuimian;

    },

    tapAudio: function (e) {
      let slideDialogShow = this.data.slideDialogShow;
      this.setData({
        slideDialogShow: !slideDialogShow
      })
    },

    tapPlus: function (e) {
      let slideValue = this.data.slideValue;
      slideValue++;
      if (slideValue > 5) {
        util.showToast('当前音量已经调整到最大');
        return;
      }
      this.setData({
        slideValue: slideValue
      })
      this.sendFullSetAudioCmd(this.data.slideValue);
    },

    tapMinus: function (e) {
      let slideValue = this.data.slideValue;
      slideValue--;
      if (slideValue < 0) {
        util.showToast('当前音量已经调整到最小');
        return;
      }
      this.setData({
        slideValue: slideValue
      })
      this.sendFullSetAudioCmd(this.data.slideValue);
    },

    sliderchange: function (e) {
      console.log("change：", e)
      this.setData({
        slideValue: e.detail.value
      })
      console.log("date", this.data.slideValue);
      this.sendFullSetAudioCmd(this.data.slideValue);
    },


    sendFullSetAudioCmd: function (value) {
      var cmd = 'FFFFFFFF0100140B' + '0' + value
      cmd = cmd + crcUtil.HexToCSU16(cmd);
      this.sendFullBlueCmd(cmd)
    },
  },

})