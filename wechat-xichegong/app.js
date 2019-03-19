//app.js
const request = require('./utils/api.js');
const common = require('./utils/common.js');
App({
  common: common.default,
  request: request.default,
  onLaunch: function() {
    wx.onNetworkStatusChange(res => {
      const title = !res.isConnected ? '网络已断开' : '网络已连接';
      request.default.showTips(title);
    });
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.showLoading();
        request.default.hadLogined({
          code: res.code
        }).then(res1 => {
          // console.log('登录前检测', res1)
          if (res1.status == 1091 || res1.status == 1093) {
            
            if (res1.status == 1093) this.globalData.x_id = res1.x_id;

            setTimeout(() => {
              request.default.goLogin(res1.status);
            }, 500);

            return Promise.reject('用户首次登录');

          } else if (res1.status == 1000) {
            this.globalData.x_id = res1.data.x_id;
            // 重复获取用户位置
            request.default.getPosition(this);
            setInterval(() => {
              request.default.getPosition(this);
            }, 300000);

            return res1.data.x_id;

          }
        }).then(res3 => {
          request.default.hadBindInfo({
            x_id: res3
          }).then(res2 => {
            // console.log('是否绑定手机号或代理商', res2);
            if (res2.status == 1000) {
              this.globalData.hadBindInfo.phoneNum = true;
              this.globalData.hadBindInfo.agent = true;
            } else if (res2.status == 1093) {
              this.globalData.hadBindInfo.phoneNum = false;
            } else if (res2.status == 1094) {
              this.globalData.hadBindInfo.agent = false;
            }
          }).catch(err => {
            console.log('查询用户是否绑定信息失败', err);
          });
        }).catch(err => {
          typeof(err) !== 'string' && console.log('登录前验证失败', err)
        });
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    x_id: '',
    lat: '', // 用户位置纬度
    long: '', // 用户位置经度
    hadBindInfo: { // 是否绑定信息
      phoneNum: false,  // 是否绑定手机号
      agent: false  // 是否绑定代理商
    },
  }
})