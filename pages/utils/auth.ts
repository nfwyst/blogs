import cookie from 'js-cookie';
import axios, { AxiosError } from 'axios';
import { User } from '../interfaces';

export const removeCookie = (key: string): void => {
  if (process.browser) {
    cookie.remove(key)
  }
}

export const getCookie = (key: string): string => {
  if (process.browser) {
    return cookie.get(key)
  }
}

export const setLocalStorage = (key: string, value: object | string): void => {
  const val = typeof value === 'string' ? value : JSON.stringify(value)
  if (process.browser) {
    localStorage.setItem(key, val)
  }
}

export const removeLocalStorage = (key: string): void => {
  if (process.browser) {
    localStorage.removeItem(key)
  }
}

export const authenticate = (data: { user: object }, next: Function) => {
  const { user } = data
  setLocalStorage('user', user)
  next()
}

export const isAuth = (): boolean | User => {
  if (process.browser) {
    const cookieChecked: string = getCookie('token')
    const user: string = localStorage.getItem('user')
    if (cookieChecked && user) return JSON.parse(user)
    return false
  }
}

export const signOut = (next: Function): void => {
  axios.post('/auth/user/signout')
    .then(({ data }) => {
      removeLocalStorage('user')
      next(data.message, 'success')
    })
    .catch((e: AxiosError) => {
      const { response: { data } } = e
      next(data.error, 'error')
    })
}
