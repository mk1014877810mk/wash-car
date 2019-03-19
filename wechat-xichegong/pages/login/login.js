// pages/login/login.js
const app = getApp();
const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57]|19[8])[0-9]{8}$/;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNum: '',
    inputVal: '',
    showModel: false, // 是否显示手机号确认模态框
    hadLogin: false, // 是否已经提交过用户信息
    showCurrent: true // 是否为微信默认手机号
  },

  onLoad(options) {
    this.setData({
      hadLogin: options.status == 1091
    });
  },


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
      code,
      iv,
      encryptedData
    }).then(res => {
      // console.log('登录向后台发送个人信息', res);
      if (res.status == 1000) {
        app.globalData.x_id = res.data.x_id;
        this.setData({
          hadLogin: true
        });
      }
    }).catch(err => {
      console.log('登录向后台发送个人信息数据失败', err)
    })

  },

  getPhoneNum(code, iv, encryptedData) {
    app.request.getPhoneNum({
      code,
      iv,
      encryptedData
    }).then(res => {
      // console.log('手机号', res);
      if (res.status == 1000) {
        this.showOrHideModel();
        this.setData({
          phoneNum: res.data.phone_number
        });
      } else if (res.status == 41003) {
        app.request.showTips('手机号获取失败，请重试!');
      }
    }).catch(err => {
      console.log('手机号获取失败', err);
    })
  },




  getPhoneNumber(e) {
    // console.log('手机号', e);
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '温馨提示',
        showCancel: false,
        content: '未授权手机号，会导致无法绑定用户,请授权手机号'
      })
    } else { // 同意授权
      this.getCode(code => {
        this.getPhoneNum(code, e.detail.iv, e.detail.encryptedData);
      });
    }
  },


  showOrHideModel() {
    this.setData({
      showModel: !this.data.showModel,
      showCurrent: true
    })
  },

  changeNum() {
    this.setData({
      showCurrent: !this.data.showCurrent
    })
  },

  inputPhoneNum(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },


  sendPhoneNum() {
    const phoneNum = this.data.showCurrent ? this.data.phoneNum : this.data.inputVal;
    if (!reg.test(phoneNum)) return app.request.showTips('请输入合法的手机号');

    app.request.sendPhoneNum({
      x_id: app.globalData.x_id,
      phone: phoneNum
    }).then(res => {
      // console.log('绑定手机号成功', res);
      if (res.status == 1000) {
        wx.navigateBack();
      } else if (res.status == 40004){
        app.request.showTips('请输入合法的手机号')
      }
    }).catch(err => {
      console.log('绑定手机号失败', err);
    })
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