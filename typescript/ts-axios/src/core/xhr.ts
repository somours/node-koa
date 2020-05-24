import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = 'get', headers, responseType, timeout } = config
    const request = new XMLHttpRequest()
    request.open(method.toUpperCase(), url!, true)

    configureRequest()
    addEvents()
    processHeaders()

    request.send(data)

    function configureRequest (): void {
      if(responseType) {
        request.responseType = responseType
      }
      if(timeout) {
        request.timeout = timeout
      }
    }
    function addEvents():void {
      request.onreadystatechange = function handleLoad() {
        if (request.readyState !== 4) {
          return
        }
        const responseHeaders = parseHeaders(request.getAllResponseHeaders())
        const responseData = responseType !== 'text' ? request.response : request.responseText
        const response: AxiosResponse = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        }
        handleResponse(response)
      }

      request.onerror = function handleError () {
        reject(createError('Network Error', config, null, request))
      }

      request.ontimeout = function handleTimeout () {
        reject(createError(
          `Timeout of ${request.timeout} ms exceeded`, config, 'ECONNABORTED', request
        ))
      }
    }

    function processHeaders(): void {
      Object.keys(headers).forEach(name => {
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    function handleResponse(response: AxiosResponse):void {
      if(response.status >=200 && response.status < 300) {
        resolve(response)
      } else {
        reject(createError(`Request failed with status code ${response.status}`,config, null, request, response))
      }
    }
  })
}
