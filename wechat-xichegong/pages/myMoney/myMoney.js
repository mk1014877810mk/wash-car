// pages/myMoney/myMoney.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: {},
    hideModel: true,
    inputMoney: 0,
    canSubmit: false, // 能否提现
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading();
    let timer = setInterval(() => {
      if (app.common.startLoad(app)) {
        clearInterval(timer);
        wx.showLoading();
        this.getMyMoney();
      }
    }, 500);
    setTimeout(() => {
      wx.hideLoading();
      clearInterval(timer);
      if (!app.common.startLoad(app)) {
        if (!app.globalData.x_id) {
          app.request.needToLogin(1091);
        } else if (!app.globalData.hadBindInfo.phoneNum) {
          app.request.needToLogin(1093);
        } else {
          this.getMyMoney(() => {
            app.request.showTips('请绑定代理商');
          });
        }
      }
    }, 3000);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  getMyMoney() {
    app.request.getMyMoney({
      x_id: app.globalData.x_id
    }).then(res => {
      // console.log('我的钱包', res);
      if (res.status == 1000) {
        this.setData({
          money: res.data
        });
      }
    }).catch(err => {
      console.log('我的钱包数获取失败', err);
    })
  },

  bindInput(e) {
    var val = Number(e.detail.value);
    if (isNaN(val)) return app.request.showTips('请输入数字');
    this.setData({
      inputMoney: val.toFixed(2),
      canSubmit: val > 0 && val <= this.data.money.wallet_balance
    });
  },

  getMoneyToMyself() {
    if (!this.data.canSubmit) return;
    app.request.getMoneyToMyself({
      x_id: app.globalData.x_id,
      amount: this.data.inputMoney
    }).then(res => {
      console.log('提现成功', res);
      if (res.status == 1000) {
        app.request.showTips('提现成功', 'success');
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/mine/mine',
          });
        }, 2000);
      } else if (res.status == 1) {
        app.request.showTips('余额不足');
      } else if (res.status == 2) {
        app.request.showTips('提现不能小于500元');
      } else if (res.status == 4) {
        app.request.showTips('每日仅能提现一次');
      } else if (res.status == 5) {
        app.request.showTips('提现失败');
      } else if (res.status == 6) {
        app.request.showTips('余额不足');
      }
    }).catch(err => {
      console.log('提现失败', err);
    })
  },

  stopPropgation() {
    return false;
  },

  showOrHideModel() {
    this.setData({
      hideModel: !this.data.hideModel
    });
    wx.setNavigationBarTitle({
      title: this.data.hideModel ? '我的钱包' : '提现',
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})