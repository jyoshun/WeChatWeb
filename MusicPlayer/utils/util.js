const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

(function () {
  var utils
  module.exports = utils = {
  }
}(typeof module === 'undefined' ? { module: { exports: {} } } : module
))

function dealColor(rgb) {
  if (!rgb) {
    return
  }
  var css
  var r = (rgb & 0x00ff0000) >> 16
  var g = (rgb & 0x0000ff00) >> 8
  var b = (rgb & 0x000000ff)
  return 'rgb(' + r + ',' + g + ',' + b + ')'
}

module.exports = {
  formatTime: formatTime,
  dealColor: dealColor
}
