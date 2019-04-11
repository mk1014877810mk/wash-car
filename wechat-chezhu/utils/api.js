// export const ajaxUrl = `http://teng.com/carWash/web/`;
export const ajaxUrl = `https://xc.100uv.cn/carWash/web/`;
const requestApi = (reqObj) => {
  const method = reqObj.method || 'get';
  const header = method == 'post' ? {
    'content-type': 'application/x-www-form-urlencoded'
  } : {
    'content-type': 'application/json'
  };
  wx.request({
    url: ajaxUrl + reqObj.url,
    method: method,
    header: header,
    data: reqObj.data,
    success: res => {
      wx.hideLoading();
      if (res.statusCode == 200) {
        reqObj.success && reqObj.success(res.data);
      } else {
        showTips('服务器响应失败');
        console.log('请求状态不为200', res)
      }
    },
    fail: err => {
      wx.hideLoading();
      const title = (err.errMsg.indexOf('timeout') != -1 && err.errMsg.indexOf('fail') != -1) ? '网络请求超时' : '网络请求失败';
      showTips(title);
      reqObj.fail && reqObj.fail(err);
    },
    complete: () => {
      reqObj.complete && reqObj.complete();
    }
  });
}
/**
 * common
 */

export const goLogin = () => {
  wx.navigateTo({
    url: '/pages/login/login',
  });
}

export const needToLogin = () => {
  wx.showModal({
    title: '温馨提示',
    content: '您尚未登录，请登录！',
    success: res => {
      if (res.confirm) {
        goLogin();
      }
    }
  })
}

export const showTips = (title, icon, complete) => {
  wx.showToast({
    title,
    icon: icon || 'none',
    duration: 1500,
    complete: () => {
      complete && complete();
    }
  });
}


// 重新让用户授权地理位置
export const reGetPosition = (id) => {
  const u_id = id;
  wx.openSetting({
    success: (data) => {
      console.log('当前位置', data);
    },
    fail: (err) => {
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
                        sendUserPosition({
                          data: {
                            u_id,
                            longitude: res.longitude,
                            latitude: res.latitude
                          },
                          success: res2 => {
                            // console.log('发送用户位置信息', res2);
                            if (res2.status == 1000 || res2.status == 40007) {
                              console.log('位置发送后台成功');
                            }
                          },
                          fail: err => {
                            console.log('发送用户位置信息失败', err);
                          }
                        })
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
  });
}
// 根据经纬度计算代理商
export const sendUserPosition = reqObj => {
  requestApi({
    url: `owner/compared`,
    method: 'post',
    data: reqObj.data,
    success: reqObj.success,
    fail: reqObj.fail,
    complete: reqObj.complete
  });
}

/**
 * index
 */
// 获取当前供应商服务类型

export const getCurrentServerType = reqObj => {
  requestApi({
    url: `owner/service-type`,
    method: 'get',
    data: reqObj.data,
    success: reqObj.success,
    fail: reqObj.fail
  });
}



/**
 * login
 */
// 登录前检测
export const hadLogined = reqObj => {
  requestApi({
    url: `owner/owner-first-login`,
    method: 'post',
    data: reqObj.data,
    success: reqObj.success,
    fail: reqObj.fail
  });
};

// 登录向后台发送数据
export const sendLoginData = reqObj => {
  wx.showLoading();
  requestApi({
    url: `owner/login`,
    method: 'post',
    data: reqObj.data,
    success: reqObj.success,
    fail: reqObj.fail
  });
};

/**
 * apply
 */
// 提交申请人信息
export const submitApplyData = reqObj => {
  requestApi({
    url: `owner/application`,
    method: 'post',
    data: reqObj.data,
    success: reqObj.success,
    fail: reqObj.fail,
    complete: reqObj.complete
  });
}


/**
 * appointment
 */
// 获取洗车详细信息
export const getWashCarInfo = reqObj => {
  wx.showLoading();
  requestApi({
    url: 'owner/propag',
    method: 'get',
    data: reqObj.data,
    success: reqObj.success,
    fail: reqObj.fail
  });
}
// 获取车牌信息
export const getCarList = reqObj => {
  wx.showLoading();
  requestApi({
    url: `owner/vehicle-list`,
    method: 'get',
    data: reqObj.data,
    success: reqObj.success,
    fail: reqObj.fail
  });
}

// 当前代理商是否录入价格
export const hasPrise = reqObj => {
  requestApi({
    url: `owner/price`,
    method: 'get',
    data: reqObj.data,
    success: reqObj.success,
    fail: reqObj.fail
  })
}

// 提交订单信息
export const submitFormData = reqObj => {
  requestApi({
    url: `owner/order-submit`,
    method: 'post',
    data: reqObj.data,
    success: reqObj.success,
    fail: reqObj.fail,
    complete: reqObj.complete
  });
}

/**
 * addCarInfo
 */
// 添加车辆信息
export const submitCarInfo = reqObj => {
  requestApi({
    url: `owner/vehicle-add`,
    method: 'post',
    data: reqObj.data,
    success: reqObj.success,
    fail: reqObj.fail,
    complete: reqObj.complete
  });
}

/**
 * orderForm
 */
// 获取订单信息
export const getOrderInfo = reqObj => {
  requestApi({
    url: `owner/order-info`,
    method: 'post',
    data: reqObj.data,
    success: reqObj.success,
    fail: reqObj.fail
  });
}

export const payMoney = reqObj => {
  requestApi({
    url: `pay`,
    method: 'post',
    data: reqObj.data,
    success: reqObj.success,
    fail: reqObj.fail
  });
}

export const changePayStatus = reqObj => {
  requestApi({
    url: `pay/modify-order-status`,
    method: 'post',
    data: reqObj.data,
    complete: reqObj.complete
  });
}


/**
 * mine
 */
// 获取用户信息
export const getUserInfo = reqObj => {
  requestApi({
    url: `owner/owner-info`,
    method: 'get',
    data: reqObj.data,
    success: reqObj.success,
    fail: reqObj.fail
  });
}

/**
 * carInfoList
 */
// 删除车辆信息
export const delCarInfo = reqObj => {
  wx.showLoading()
  requestApi({
    url: `owner/vehicle-delete`,
    method: 'get',
    data: reqObj.data,
    success: reqObj.success,
    fail: reqObj.fail
  });
}

/**
 * appraise
 */
// 获取未完成
export const getNotFinishOrder = reqObj => {
  requestApi({
    url: `owner/order-undone`,
    method: 'get',
    data: reqObj.data,
    success: reqObj.success,
    fail: reqObj.fail
  });
}
// 查询未评价列表
export const getNotAppraiseList = reqObj => {
  requestApi({
    url: `owner/evaluation`,
    method: 'get',
    data: reqObj.data,
    success: reqObj.success,
    fail: reqObj.fail
  });
}
// 提交评价
export const submitAppraise = reqObj => {
  requestApi({
    url: `owner/submit-evaluation`,
    method: 'post',
    data: reqObj.data,
    success: reqObj.success,
    fail: reqObj.fail
  });
}

/**
 * 洗车记录
 */

export const getLastData = reqObj => {
  requestApi({
    url: `owner/completed`,
    method: 'get',
    data: reqObj.data,
    success: reqObj.success,
    fail: reqObj.fail
  });
}