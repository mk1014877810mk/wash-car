//index.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bindInfo: false,
    page: 1,
    limit: 10,
    sort: 1,
    orderList: [],
    hideTips: false,
    flag: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let timer = setInterval(() => {
      if (app.common.startLoad(app)) {
        clearInterval(timer);
        wx.showLoading();
        this.getOrderList(true);
        this.setData({
          bindInfo: true
        })
      }
    }, 500)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  getOrderList(init, callback) { //params:init=>是否初始化列表数据
    app.request.getOrderList({
      x_id: app.globalData.x_id,
      coordinate: app.globalData.long.toString() + ',' + app.globalData.lat.toString(),
      sort_type: this.data.sort,
      page: this.data.page,
      limit_number: this.data.limit
    }).then(res => {
      // console.log('首页未接单列表', res);
      if (res.status == 1000) {
        if (init) {
          this.setData({
            orderList: []
          });
        }
        res.data.forEach(el => {
          el.time = el.add_time.slice(0, 16);
        })
        this.setData({
          orderList: this.data.orderList.concat(res.data)
        });
        if (this.data.orderList.length >= res.count) {
          this.setData({
            flag: false,
          });
        }
        callback && callback();
      } else if (res.status == 1006) {
        this.setData({
          flag: false,
        });
        if (this.data.page == 1) {
          this.setData({
            orderList: []
          });
        }
      }
    }).catch(err => {
      console.log('首页未接单列表获取失败', err);
    })
  },
  // 排序
  sorList(e) {
    const sort = e.currentTarget.dataset.sort;
    if (sort == this.data.sort) return;
    this.setData({
      page: 1,
      sort
    });
    this.getOrderList(true);
  },
  // 接单
  doSomething(e) {
    const o_id = e.currentTarget.dataset.o_id;
    app.request.doSomething({
      x_id: app.globalData.x_id,
      order_status: 3,
      order_id: o_id
    }).then(res => {
      // console.log('接单', res);
      if (res.status == 1000) {
        const tempPage = this.data.page;
        const tempLimit = this.data.limit;
        this.setData({
          page: 1,
          limit: tempPage * tempLimit
        });
        this.getOrderList(true, () => {
          this.setData({
            page: tempPage,
            limit: tempLimit
          });
        });
      } else if (res.status == 1001) {
        app.request.showTips('该订单已被别人抢走啦！');
        this.getOrderList(true);
      }
    }).catch(err => {
      console.log('接单失败', err)
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.data.bindInfo) {
      this.getOrderList(true);
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
    this.getOrderList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})