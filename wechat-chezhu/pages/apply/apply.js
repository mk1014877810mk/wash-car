// pages/apply/apply.js
const app = getApp();
const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57]|19[8])[0-9]{8}$/;
let submitFlag = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['请选择省/市/区', '', ''],
    choosePicker: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  chooseCity(e) {
    this.setData({
      region: e.detail.value,
      choosePicker: true
    })
  },

  formSubmit: function(e) {
    const submitData = e.detail.value;
    if (!submitFlag) {
      app.request.showTips('数据提交中...');
      return;
    }
    if ((submitData.application_name).trim().length <= 0) {
      app.request.showTips('请输入你的姓名');
      return;
    } else if ((submitData.application_phone).trim().length <= 0) {
      app.request.showTips('请输入你的手机号码');
      return;
    } else if (!reg.test((submitData.application_phone).trim())) {
      app.request.showTips('请输入正确的手机号码');
      return;
    } else if (!this.data.choosePicker) {
      app.request.showTips('请输入地区');
      return;
    } else if ((submitData.street).trim().length <= 0) {
      app.request.showTips('请输入地区');
      return;
    }
    submitData.application_address = submitData.application_address.join('-') + '-' + submitData.street;
    console.log(submitData)
    app.request.submitApplyData({
      data: submitData,
      success: res => {
        // console.log('申请提交', res);
        if (res.status == 1000) {
          wx.showModal({
            title: '温馨提示',
            content: '提交成功，我们将尽快联系您！',
            showCancel: false,
            success: res => {
              if (res.confirm) {
                wx.navigateBack();
              }
            }
          })
        } else if (res.status == 40004) {
          app.request.showTips('手机格式不正确');
        }
      },
      fail: err => {
        console.log('申请提交失败', err);
      },
      complete: () => {
        submitFlag = true;
      }
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