export default (function (env) {
    let envObj = {
      env: '请配置工程环境~~~',
      serverUrl: ''
    }
    if (env == 'production') {
      // 使控制台 console 输出失效
      // console.log = console.warn = console.error = console.info = function(){}
      envObj.env = '当前工程环境：production'
      envObj.serverUrl = 'http://59.110.152.54:8200/mgr/works/pc/'
      envObj.nodeServerUrl = 'http://59.110.152.54:8200/mgr/works/pc/'
    } else if (env == 'development') {
      envObj.env = '当前工程环境：development'
      envObj.serverUrl = 'http://59.110.152.54:8200/mgr/works/pc/'
      envObj.nodeServerUrl = 'http://59.110.152.54:8200/mgr/works/pc/'
    }
    return envObj
  })(process.env.NODE_ENV === 'production' ? 'production' : 'development')
  