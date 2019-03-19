// pages/carInfoList/carInfoList.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    carList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getCarList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  // 获取车辆列表
  getCarList() {
    const u_id = app.globalData.u_id;
    if (!u_id) {
      app.request.goLogin();
    }
    app.request.getCarList({
      data: {
        u_id
      },
      success: res => {
        // console.log('车辆信息列表', res);
        if (res.status == 1000) {
          this.setData({
            carList: res.data.reverse()
          });
        } else if (res.status == 1006) {
          this.setData({
            carList: []
          });
        }
      },
      fail: err => {
        console.log('车辆信息列表获取失败', err);
      }
    });

  },
  // 添加车辆信息
  addCarInfo() {
    this.selectComponent('#add_car_info').showOrHideModel();
  },

  delCarInfo(e) {
    wx.showModal({
      title: '温馨提示',
      content: '确认要删除此车辆信息吗？',
      success: res => {
        if (res.confirm) {
          app.request.delCarInfo({
            data: {
              v_id: e.currentTarget.dataset.v_id
            },
            success: res1 => {
              // console.log('删除车辆信息', res1);
              if (res1.status == 1000) {
                this.getCarList();
              }
            },
            fail: err => {
              console.log('删除车辆信息失败', err);
            }
          });
        }
      }
    })
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