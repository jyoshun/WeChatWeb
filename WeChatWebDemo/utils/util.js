const formatTime = date => {
  const year = date.getFullYear() // 获取年份
  const month = date.getMonth() + 1 // 获取月份 getMonth()从0开始需要加1
  const day = date.getDate() // 获取日期
  const hour = date.getHours() // 获取小时
  const minute = date.getMinutes() // 获取分钟
  const second = date.getSeconds() // 获取秒数

  // 格式化数组，在年、月、日之间添加"/" 时分秒之间添加":"
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n // 条件运算符，数字小于两位前面补0
}

// 暴露formatTime方法
module.exports = {
  formatTime: formatTime
}
