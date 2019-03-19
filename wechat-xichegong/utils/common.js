const common = {
  startLoad: app => {
    let lat, long, hadBindInfo, x_id;
    lat = app.globalData.lat;
    long = app.globalData.long;
    hadBindInfo = app.globalData.hadBindInfo.phoneNum && app.globalData.hadBindInfo.agent;
    x_id = app.globalData.x_id;
    // console.log(lat, long, hadBindInfo, x_id)
    return (lat && long && hadBindInfo && x_id)
  }
}

export default common;