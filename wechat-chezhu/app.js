//app.js
const request = require('./utils/api.js');
App({
  request,
  onLaunch: function() {
    wx.onNetworkStatusChange(res => {
      const title = !res.isConnected ? '网络已断开' : '网络已连接';
      request.showTips(title);
    });
    // 登录
    wx.login({
      success: res => {
        // console.log(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        request.hadLogined({
          data: {
            code: res.code
          },
          success: res1 => {
            // console.log('是否为第一次登录检测', res1);
            if (res1.status == 1091) {
              setTimeout(() => {
                request.goLogin();
              }, 500);
            } else {
              this.globalData.u_id = res1.data.u_id;
              wx.getLocation({
                success: res2 => {
                  // console.log('当前地址', res2);
                  request.sendUserPosition({
                    data: {
                      u_id: res1.data.u_id,
                      longitude: res2.longitude,
                      latitude: res2.latitude
                    },
                    success: res2 => {
                      // console.log('发送用户位置信息', res2);
                      if (res2.status == 1000 || res2.status == 40007) {
                        console.log('位置发送后台成功');
                        this.globalData.agent_id = res2.data;
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
                        request.reGetPosition(this.globalData.u_id);
                      }
                    },
                    fail: err => {
                      console.log('获取用户地理位置权限失败'.err);
                    }
                  })
                }
              })

            }
          },
          fail: err => {
            console.log('是否为第一次登录检测失败', err);
          }
        })
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
    userInfo: '',
    u_id: '',
    agent_id: '', // 供应商id
  }
})