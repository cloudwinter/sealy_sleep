// pages/gexingset/gexingset-1.js
const util = require('../../utils/util');
const crcUtil = require('../../utils/crcUtil');
const configManager = require('../../utils/configManager')
const WxNotificationCenter = require('../../utils/WxNotificationCenter')
const app = getApp();
const imgSanjiaoBottomSelected = '../../images/' + app.globalData.skin + '/sanjiao-bottom-selected@3x.png';
const imgSanjiaoBottomNormal = '../../images/' + app.globalData.skin + '/sanjiao-bottom-normal@3x.png';
const imgSanjiaoTopSelected = '../../images/' + app.globalData.skin + '/sanjiao-top-selected@3x.png';
const imgSanjiaoTopNormal = '../../images/' + app.globalData.skin + '/sanjiao-top-normal@3x.png';


const sendPrefix = 'FFFFFFFF050000'; // 发送码前缀

Page({

  /**
   * 页面的初始数据
   */
  data: {
    connected: {}, // 当前连接的设备
    skin: app.globalData.skin,
    display: app.globalData.display,
    navbar: {
      loading: false,
      color: '#FFFFFF',
      background: '#0A0A0C',
      show: true,
      animated: false,
    },
    imgSanjiao: {
      imgSanjiaoBottomSelected: imgSanjiaoBottomSelected,
      imgSanjiaoBottomNormal: imgSanjiaoBottomNormal,
      imgSanjiaoTopSelected: imgSanjiaoTopSelected,
      imgSanjiaoTopNormal: imgSanjiaoTopNormal
    },
    currentAnjian: {
      anjian: 'beibutz', // beibutz,yaobutz
      name: '背部调整' // 背部调整，腰部调整
    },
    animationPosition: 1, //动画，1，2，3 或者 3，2，1 初始化都是1
    animationStop: true, //停止动画
    startTime: '',
    endTime: '',
    beibutzTop: false,
    beibutzBottom: false,
    yaobutzTop: false,
    yaobutzBottom: false,
    pingtangSelected: false,
    cetangSelected: false,
    startTime: '',
    endTime: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let connected = configManager.getCurrentConnected();
    this.setData({
      skin: app.globalData.skin,
      connected: connected,
      display: app.globalData.display,
      imgSanjiao: {
        imgSanjiaoBottomSelected: '../../images/' + app.globalData.skin + '/sanjiao-bottom-selected@3x.png',
        imgSanjiaoBottomNormal: '../../images/' + app.globalData.skin + '/sanjiao-bottom-normal@3x.png',
        imgSanjiaoTopSelected: '../../images/' + app.globalData.skin + '/sanjiao-top-selected@3x.png',
        imgSanjiaoTopNormal: '../../images/' + app.globalData.skin + '/sanjiao-top-normal@3x.png'
      },
    })
  },



  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },


  /**
   * 发送蓝牙命令
   */
  sendBlueCmd(cmd, options) {
    var connected = this.data.connected;
    util.sendBlueCmd(connected, sendPrefix + cmd, options);
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
    if (type) {
      console.info('touchStart', type);
      // 启动动画
      this.setData({
        animationStop: false
      })
    }
    if (type == 'beibutzTop') {
      this.setData({
        currentAnjian: {
          anjian: 'beibutz',
          name: '背部调整'
        },
        beibutzTop: true
      });
      this.donghua(true, this);
      this.tapBeibutz(true, true);
    } else if (type == 'beibutzBottom') {
      this.setData({
        currentAnjian: {
          anjian: 'beibutz',
          name: '背部调整'
        },
        beibutzBottom: true
      });
      this.donghua(false, this);
      this.tapBeibutz(false, true);

    } else if (type == 'yaobutzTop') {
      this.setData({
        currentAnjian: {
          anjian: 'yaobutz',
          name: '腿部调整'
        },
        yaobutzTop: true
      });
      this.donghua(true, this);
      this.tapYaobutz(true, true);
    } else if (type == 'yaobutzBottom') {
      this.setData({
        currentAnjian: {
          anjian: 'yaobutz',
          name: '腿部调整'
        },
        yaobutzBottom: true
      });
      this.donghua(false, this);
      this.tapYaobutz(false, true);
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
    if (type) {
      // 停止动画
      console.info('touchEnd', type);
      this.setData({
        animationStop: true
      })
    }
    // 还原动画
    this.setData({
      animationPosition: 1
    });
    if (type == 'beibutzTop') {
      this.setData({
        beibutzTop: false
      });
      this.tapBeibutz(true, false);
    } else if (type == 'beibutzBottom') {
      this.setData({
        beibutzBottom: false
      });
      this.tapBeibutz(false, false);
    } else if (type == 'yaobutzTop') {
      this.setData({
        yaobutzTop: false
      });
      this.tapYaobutz(true, false);
    } else if (type == 'yaobutzBottom') {
      this.setData({
        yaobutzBottom: false
      });
      this.tapYaobutz(false, false);
    }
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
   * 腰部调整
   * @param {*} top 上
   * @param {*} start 按下
   */
  tapYaobutz(top, start) {
    var cmd = '';
    if (!start) {
      // 松开 发停止码
      cmd = '0000D700';
      this.sendBlueCmd(cmd);
    } else {
      // 按下
      if (top) {
        cmd = '000D16C5';
      } else {
        cmd = '00OE56C4';
      }
      this.sendBlueCmd(cmd);
    }
  },



  /********************动画处理 */
  /**
   * 顺序就是1，2，3，倒序就是3，2，1
   * @param {是否倒序} reversal 
   */
  donghua(reversal, cur) {
    var that = cur;
    console.info('donghua', that);
    var stop = that.data.animationStop;
    var position = that.data.animationPosition;
    if (stop) {
      // 还原初始值
      that.setData({
        animationPosition: 1
      })
      // 停止
      return;
    }
    if (reversal) {
      // 倒序
      position--;
      if (position <= 0) {
        position = 3;
      }
    } else {
      // 顺序
      position++;
      if (position >= 4) {
        position = 1;
      }
    }
    that.setData({
      animationPosition: position
    });
    setTimeout(that.donghua, 400, reversal, that);
  },




  /*************-------------点击事件--------------------*********** */
  touchLongStart(e) {
    this.startTime = e.timeStamp;
  },
  touchLongEnd(e) {
    this.endTime = e.timeStamp;
  },

  /**
   * 判断单击 1 和长按 2 事件 其他0
   * @param {*} e 
   */
  longClick() {
    if (this.endTime - this.startTime > 2000) {
      console.log("长按了");
      return true;
    }
    return false;
  },


  /**
   * 平躺点击
   */
  tapPingtang: function () {
    var that = this;
    var longClick = this.longClick();
    if (longClick) {
      // 长按
      this.sendBlueCmd('D05D4B39', ({
        success: (res) => {
          console.info('tapPingtang->发送成功');
          that.setData({
            pingtangSelected: true
          });
        },
        fail: (res) => {
          console.error('tapPingtang->发送失败', res);
        }
      }));
    }
  },


  /**
   * 侧躺
   */
  tapCetang: function () {
    var that = this;
    var longClick = this.longClick();
    if (longClick) {
      // 长按
      this.sendBlueCmd('C05C8739', ({
        success: (res) => {
          console.info('tapCetang->发送成功');
          that.setData({
            cetangSelected: true
          });
        },
        fail: (res) => {
          console.error('tapCetang->发送失败', res);
        }
      }));
    }
  },


  /**
   * 保存
   */
  tabSave: function () {
    var that = this;
    var longClick = this.longClick();
    if (longClick) {
      // 长按
      let pingtangSelected = this.data.pingtangSelected;
      let cetangSelected = this.data.cetangSelected;
      if (pingtangSelected && cetangSelected) {
        this.sendBlueCmd('005E56F8', ({
          success: (res) => {
            console.info('tabSave->发送成功');
            util.showToast('设置完成');
            // 返回上一页
            wx.navigateBack({
              delta: 1,
            })
          },
          fail: (res) => {
            console.error('tabSave->发送失败', res);
          }
        }));
      } else {
        util.showToast('请先完成 平躺/侧躺的个性位置设置!');
        return;
      }


    }
  },



})