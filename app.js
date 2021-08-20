//app.js
const configManager = require('./utils/configManager')
App({
  onLaunch: function () {
    configManager.init();
    // configManager.setSkin('dark');
    //var skin = configManager.getSkin();
    this.globalData.skin = 'dark';

  },
  onShow: function () {
    wx.getSystemInfo({
      success: (res) => {
        console.info("app onShow->当前的设备信息：", res);
        // 设备品
        var brand = res.brand;
        var screenHeight = res.screenHeight;
        var screenWidth = res.screenWidth;
        var display = 'normal';
        if (brand.toLowerCase().indexOf('huawei') >= 0 ||
          brand.toLowerCase().indexOf('vivo') >= 0 ||
          brand.toLowerCase().indexOf('oppo') >= 0) {
          display = screenHeight > 690 ? 'high' : 'normal';
        } else {
          display = screenHeight > 790 ? 'high' : 'normal';
        }
        this.globalData.display = display
        this.globalData.screenHeight = screenHeight;
        this.globalData.screenWidth = screenWidth;
        console.info("app onShow->屏幕高度宽度：" + screenHeight, this.globalData.display, screenWidth);
      },
    })
  },
  globalData: {
    skin: 'dark',
    display: 'normal',
    screenHeight: '',
    screenWidth: '',
    navHeight: '',
    connected:{},  // 当前已连接的设备信息
    hasSleepInduction: true, // 智能睡眠感应开关
    sleepInduction: {  //智能睡眠感应信息
      status:'00',  // 00 关闭，01开启 其他定时
      nightLight:'00', // 智能夜灯 00 关闭 01开启
      mode:'00', // 模式 00 预设位置 01 个性位置
      gexingModel:'00'  // 个性模式 00 个性未设置 01 个性已设置

    }

  }
})