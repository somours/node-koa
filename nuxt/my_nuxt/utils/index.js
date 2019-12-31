import basics from '@/utils/libs/basics'

/**
 * @desc:获取当天时间yyyy-mm-dd
 */
export function currentTime () {
  const now = new Date()
  const year = now.getFullYear() // 年
  const month = now.getMonth() + 1 // 月
  const day = now.getDate() // 日
  let clock = year + '-'
  if (month < 10) {
    clock += '0'
  }
  clock += month + '-'
  if (day < 10) {
    clock += '0'
  }
  // clock += day + " ";
  clock += day
  return clock
}
/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 */
export function deepClone (source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @description: 过滤枚举
 * @author:somours
 * @date:2019/7/29
 * @param:value 指定的值
 * @param:enums 需要过滤的枚举
 * @return:
 */
export const filterEnums = (value, enums) => {
  if (basics.isNull(value) || basics.isNull(enums)) {
    return {
      value: '-',
      label: '-'
    }
  }
  const filterEnum = enums.filter((item) => {
    if (String(item.value) === String(value)) { return item }
  })
  if (filterEnum.length > 0) { return filterEnum[0] } else {
    return {
      value: '-',
      label: '-'
    }
  }
}