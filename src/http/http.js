import axios from 'axios'
// 设置请求地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 设置header
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

const http = {
  get: function(url, params) {
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          params: params
        })
        .then(res => {
          if (res.data.meta.status !== 200) {
            reject(res.data.meta.msg)
          } else {
            resolve(res.data.data)
          }
        })
        .catch(err => {
          reject(err.data)
        })
    })
  },
  delete: function(url) {
    return new Promise((resolve, reject) => {
      axios
        .delete(url)
        .then(res => {
          if (res.data.meta.status !== 200) {
            reject(res.data.meta.msg)
          } else {
            resolve(res.data.data)
          }
        })
        .catch(err => {
          reject(err.data.message || err.data)
        })
    })
  },
  post: function(url, params) {
    return new Promise((resolve, reject) => {
      axios
        .post(url, params)
        .then(res => {
          if (res.data.meta.status !== 200 && res.data.meta.status !== 201) {
            reject(res.data.meta.msg)
          } else {
            resolve(res.data.data)
          }
        })
        .catch(err => {
          reject(err.data.message || err.data)
        })
    })
  },
  put: function(url, params) {
    return new Promise((resolve, reject) => {
      axios
        .put(url, params)
        .then(res => {
          if (res.data.meta.status !== 200) {
            reject(res.data.meta.msg)
          } else {
            resolve(res.data.data)
          }
        })
        .catch(err => {
          reject(err.data.message || err.data)
        })
    })
  }
}

export default http
