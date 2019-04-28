// pages/order/order.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bindInfo: false,
    page: 1,
    limit: 10,
    orderList: [],
    hideTips: false,
    flag: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading();
    let timer = setInterval(() => {
      if (app.common.startLoad(app)) {
        wx.showLoading();
        clearInterval(timer);
        this.getOwnOrderList(true);
        this.setData({
          bindInfo: true
        })
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
          app.request.showTips('请绑定代理商');
        }
      }
    }, 3000);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  getOwnOrderList(init, callback) { //params:init=>是否初始化列表
    app.request.getOwnOrderList({
      x_id: app.globalData.x_id,
      page: this.data.page,
      limit_number: this.data.limit
    }).then(res => {
      // console.log('已接订单', res);
      if (res.status == 1000) {
        if (init) {
          this.setData({
            orderList: []
          });
        }
        res.data.forEach(el => {
          el.time = el.add_time.slice(0, 16);
        });
        this.setData({
          orderList: this.data.orderList.concat(res.data)
        });
        if (this.data.orderList.length >= res.count) {
          this.setData({
            flag: false
          });
        }
        callback && callback();
      } else if (res.status == 1006) {
        this.setData({
          flag: false
        });
        if (this.data.page == 1) {
          this.setData({
            orderList: []
          });
        }
      }
    }).catch(err => {
      console.log('已接订单获取失败', err);
    })
  },
  lookInMap(e) {
    const latitude = e.currentTarget.dataset.position.split(',')[1] * 1;
    const longitude = e.currentTarget.dataset.position.split(',')[0] * 1;
    wx.openLocation({
      latitude,
      longitude,
      scale: 18
    });
  },

  doSomething(e) {
    const status = e.currentTarget.dataset.status;
    app.request.doSomething({
      x_id: app.globalData.x_id,
      order_status: status * 1 + 1,
      order_id: e.currentTarget.dataset.order_id
    }).then(res => {
      // console.log('改变订单状态', res);
      if (res.status == 1000) {
        const tempPage = this.data.page;
        const tempLimit = this.data.limit;
        this.setData({
          page: 1,
          limit: tempPage * tempLimit
        });
        this.getOwnOrderList(true,() => {
          this.setData({
            page: tempPage,
            limit: tempLimit
          });
        })
      } else if (res.status == 1001) {
        app.request.showTips('该订单已被别人抢走啦！');
        this.getOwnOrderList(true);
      }
    }).catch(err => {
      console.log('改变订单状态失败', err);
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.data.bindInfo) {
      this.getOwnOrderList(true);
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
    if (!this.data.flag) return;
    this.setData({
      page: ++this.data.page
    });
    this.getOwnOrderList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})