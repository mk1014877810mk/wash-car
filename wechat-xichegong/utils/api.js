// const ajaxUrl = `http://teng.com/carWash/web/`;
const ajaxUrl = `https://xc.100uv.cn/carWash/web/`;

const requestApi = (url, method, data, complete) => {
  const header = method == 'post' ? {
    'content-type': 'application/x-www-form-urlencoded'
  } : {
    'content-type': 'application/json'
  };
  return new Promise((resolve, reject) => {
    wx.request({
      url: ajaxUrl + url,
      method,
      data,
      header,
      success: res => {
        wx.hideLoading();
        if (res.statusCode == 200) {
          resolve(res.data);
        } else {
          showTips('服务器响应失败');
          console.log('请求状态不为200', res)
        }
      },
      fail: error => {
        wx.hideLoading();
        const title = (error.errMsg.indexOf('fail') != -1 && error.errMsg.indexOf('timeout') != -1) ? '网络请求超时' : '网络请求失败';
        showTips(title);
        reject(error);
      },
      complete: () => {
        complete && complete();
      }
    })
  });
}
const showTips = (title, icon = 'none', complete) => {
  wx.showToast({
    title,
    icon,
    duration: 1500,
    complete: () => {
      complete && complete();
    }
  });
}

// 用户拒绝访问位置再次访问
const reGetPosition = app => {
  wx.showModal({
    title: '温馨提示',
    content: '您当前未授权地理位置信息，点击确定设置',
    success: function(res) {
      if (res.confirm) {
        wx.openSetting({
          success: function(data) {
            if (data) {
              if (data.authSetting["scope.userLocation"] == true) {
                wx.getLocation({
                  type: 'wgs84',
                  success: res => {
                    // console.log('后来获取的用户位置',res)
                    app.globalData.lat = res.latitude;
                    app.globalData.long = res.longitude;
                  }
                })
              }
            }
          },
          fail: function() {
            console.info("设置失败返回数据");
          }
        });
      }
    }
  });
}
// 获取用户位置信息
const getPosition = app => {
  const that = this;
  wx.getLocation({
    success: res1 => {
      // console.log('当前地址', res1);
      app.globalData.lat = res1.latitude;
      app.globalData.long = res1.longitude;
    },
    fail: err1 => {
      wx.getSetting({
        success: res2 => {
          if (!res2.authSetting['scope.userLocation']) {
            reGetPosition(app);
          }
        },
        fail: err2 => {
          console.log('获取用户地理位置权限失败'.err2);
        }
      })

    }
  })
}


export default {
  ajaxUrl,
  showTips,
  getPosition,
  goLogin: status => {
    const temp = status ? '?status=' + status : '';
    wx.navigateTo({
      url: '/pages/login/login' + temp,
    });
  },
  needToLogin: () => {
    wx.showModal({
      title: '温馨提示',
      content: '您尚未登录，请登录！',
      success: res => {
        if (res.confirm) {
          goLogin();
        }
      }
    })
  },


  /**
   * login
   */
  // 登录前检测
  hadLogined: data => requestApi('car-waher/carwasher-first-login', 'post', data),
  // 登录向后台发送数据
  sendLoginData: data => requestApi('car-waher/login', 'post', data),
  // 用户是否绑定手机号和代理商
  hadBindInfo: data => requestApi('car-waher/binding-info', 'get', data),
  // 获取用户手机号
  getPhoneNum: data => requestApi('car-waher/obtain-phone', 'post', data),
  // 向后台发送绑定手机号
  sendPhoneNum: data => requestApi('car-waher/phone-entry', 'post', data),

  /**
   * index
   */
  // 获取首页未接单信息
  getOrderList: data => requestApi('car-waher-order', 'post', data),
  // 接单、清洗、完成(status=3/4/5)
  doSomething: data => requestApi('car-waher-order/order-operaing', 'post', data),

  /**
   * order
   */
  // 查看自己已接订单列表
  getOwnOrderList: data => requestApi('car-waher-order/picked-up-order', 'post', data),

  /**
   * mine
   */
  // 获取用户信息
  getUserInfo: data => requestApi('car-waher/info', 'get', data),

  /**
   * myMoney
   */
  // 获取我的钱包数据
  getMyMoney: data => requestApi('car-waher/wallet', 'get', data),
  // 提现
  getMoneyToMyself: data => requestApi('withdraw', 'post', data),

  /**
   * bill
   */
  // 获取账单信息
  getBillList: data => requestApi('car-waher/bill', 'post', data),

  /**
   * myLastData
   */
  // 获取洗车记录
  getLastDataList: data => requestApi('car-waher/car-wash-record', 'get', data),
}