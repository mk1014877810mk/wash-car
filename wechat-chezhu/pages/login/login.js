// pages/login/login.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {},

  getCode(callback) {
    wx.login({
      success: res => {
        // console.log(res.code);
        callback && callback(res.code);
      }
    })
  },

  getUserInfo(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.getCode(code => {
      this.sendLoginData(code, e.detail.iv, e.detail.encryptedData);
    });

  },

  sendLoginData(code, iv, encryptedData) {
    app.request.sendLoginData({
      data: {
        code,
        iv,
        encryptedData
      },
      success: res => {
        // console.log('登录数据发送成功', res);
        if (res.status == 1000) {
          app.globalData.u_id = res.data.u_id;

          wx.getLocation({
            success: res2 => {
              // console.log('当前地址', res2);
              app.request.sendUserPosition({
                data: {
                  u_id: res.data.u_id,
                  longitude: res2.longitude,
                  latitude: res2.latitude
                },
                success: res2 => {
                  // console.log('发送用户位置信息', res2);
                  if (res2.status == 1000 || res2.status == 40007) {
                    console.log('位置发送后台成功');
                    app.globalData.agent_id = res2.data;
                  }
                },
                fail: err => {
                  console.log('发送用户位置信息失败', err);
                }
              })
            },
            fail: err => {
              wx.getSetting({
                success: res => {
                  if (!res.authSetting['scope.userLocation']) {
                    app.request.reGetPosition(app.globalData.u_id);
                  }
                },
                fail: err => {
                  console.log('获取用户地理位置权限失败'.err);
                }
              })
            }
          });
          wx.navigateBack();
        } else if (res.status == 41003) {
          app.request.showTips('登录失败，请点击登录按钮重新登录');
        } else {
          app.request.showTips('登录失败');
          console.log('登录数据发送出问题', res)
        }
      },
      fail: err => {
        console.log('登录数据发送失败', err);
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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