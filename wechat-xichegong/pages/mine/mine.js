// pages/mine/mine.js
const app = getApp();
let hadGetInfo = false;
let firstLoad = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    userImg: '',
    phoneNum: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading();
    let timer = setInterval(() => {
      if (app.common.startLoad(app)) {
        wx.showLoading();
        clearInterval(timer);
        this.getUserInfo();
      }
    }, 500);
    setTimeout(() => {
      clearInterval(timer);
      wx.hideLoading();
      if (!app.common.startLoad(app)) {
        if (!app.globalData.x_id) {
          app.request.needToLogin(1091);
        } else if (!app.globalData.hadBindInfo.phoneNum) {
          app.request.needToLogin(1093);
        } else {
          this.getUserInfo(() => {
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

  getUserInfo(callback) {
    app.request.getUserInfo({
      x_id: app.globalData.x_id
    }).then(res => {
      // console.log('用户信息', res);
      if (res.status == 1000) {
        hadGetInfo = true;
        firstLoad = false;
        this.setData({
          name: res.data.user_name || '',
          userImg: res.data.user_img || '/images/user.png',
          phoneNum: res.data.user_phone || ''
        })
      }
      callback && callback();
    }).catch(err => {
      console.log('用户信息获取失败', err);
    })
  },

  goMyMoney() {
    wx.navigateTo({
      url: '/pages/myMoney/myMoney',
    });
  },
  goMyReferrer() {
    wx.navigateTo({
      url: '/pages/myReferrer/myReferrer',
    });
  },
  goMyLastData() {
    wx.navigateTo({
      url: '/pages/myLastData/myLastData',
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (!app.common.startLoad(app)) {
      if (!app.globalData.x_id) {
        app.request.needToLogin(1091);
      } else if (!app.globalData.hadBindInfo.phoneNum) {
        app.request.needToLogin(1093);
      } else {
        if (hadGetInfo || firstLoad) return;
        this.getUserInfo(() => {
          app.request.showTips('请绑定代理商');
        });
      }
    }
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