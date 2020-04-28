const md5 = require('../assets/script/md5.js')
const config = require('./config.js')

export const formatTime = date => {
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export const unionQuery = obj => {
  let str = ''
  const array = Object.keys(obj)
  for (let i = 0; i < array.length; i++) {
    const key = array[i];
    const val = obj[key]
    if (i === 0) {
      str += '?' + key + '=' + val
    } else {
      str += '&' + key + '=' + val
    }
  }
  return str
}

export const queryString = str => {
  let arr = str.split('&')
  let obj = {}
  arr.forEach((item, index) => {
    const ele = item.split('=')
    const key = ele[0]
    const val = ele[1]
    obj[key] = val
  })
  return obj
}

export const formatTimeSlash = time => {
  const date = new Date(time)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [month, day, year].map(formatNumber).join('/')
}

export const checkPlatform = info => {
  const { system } = info
  if (/ios/i.test(system)) {
    return 'ios'
  } else {
    return 'android'
  }
}

/**
 * 
 * @param {Array} lists 全部数据
 * @param {Number} size 每页规定数据量
 * @param {String} key 被操作item的某个属性,必须unique
 * @param {*} value 被操作item的的某个属性对应的值,必须unique
 * @return {*} _list 被截取后剩余的lists
 * @return {*} _page 剩余页数
 * @return {Boolean} false //如果list不属性lists则直接false
 */
export const sliceLists = (lists, size, key, value) => {
  let _list_index = lists.findIndex(v => v[key] === value) + 1;
  if (_list_index == undefined) return false;

  let list_page = Math.ceil(_list_index / size); //被操作数所在页数
  let rest_page = list_page - 1;
  let rest_page_indexes = rest_page * size;
  let rest_lists = lists.filter((v, i) => i < rest_page_indexes);
  return { _page: rest_page, _list: rest_lists };
}

/**
 * 格式化时间
 * XX前
 * 
 */
export const smartTime = (date) => {
  const delta = Date.now() - date
  const ceil = Math.ceil
  const hours = ceil(delta/1000/60/60)
  const mins = ceil(delta/1000/60)
  if (mins < 60) {
    return mins + '分钟前'
  } else if (hours >= 24) {
    return formatTime(date)
  } else {
    return hours + '小时前'
  }
}

/**
 * 返回图片地址
 * 
 */
export const getFileUrl = (fileUrl, thumbnail) => {
  return fileUrl ? (fileUrl.indexOf('http') === 0 ? fileUrl : (thumbnail === true ? `${config.FLS_URL}/thumbnail-file${fileUrl}` : `${config.FLS_URL}/static-file${fileUrl}`)) : null
}

/**
 * 校验手机号
 * 
 */
export const validateMobile = (mobile) => {
  return /^1[3456789]\d{9}$/.test(mobile)
}

/**
 * 校验座机号
 * 
 */
export const validateLandline = (landline) => {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(landline)
}
