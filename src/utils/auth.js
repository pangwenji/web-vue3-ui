import Cookies from 'js-cookie'

const user_id = 'USER-ID'

const TokenKey = 'Web-Api-Token'

const TokenIdKey = 'Web-Api-TokenId'

const ExpiresInKey = 'Admin-Expires-In'


export function getToken() {
  if(Cookies.get(TokenKey)){
    return Cookies.get(TokenKey)
  }else{
    return window.localStorage.getItem(TokenKey)
  }
}

export function setToken(token) {
  window.localStorage.setItem(TokenKey,token)
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  window.localStorage.removeItem(TokenKey)
  return Cookies.remove(TokenKey)
}


export function setTokenId(tokenId) {
  window.localStorage.setItem(TokenIdKey,tokenId)
  return Cookies.remove(TokenIdKey)
}

export function getTokenId() {
  return window.localStorage.getItem(TokenIdKey)
}


export function removeTokenId() {
  window.localStorage.removeItem(TokenIdKey)
  return Cookies.remove(TokenIdKey)
}





export function getExpiresIn() {
  return Cookies.get(ExpiresInKey) || -1
}

export function setExpiresIn(time) {
  return Cookies.set(ExpiresInKey, time)
}

export function removeExpiresIn() {
  return Cookies.remove(ExpiresInKey)
}

export function getUserId() {
  if(Cookies.get(user_id)){
    return Cookies.get(user_id)
  }else{
    return window.localStorage.getItem(user_id)
  }
}

export function setUserId(userId) {
  window.localStorage.setItem(user_id,userId)
  return Cookies.set(user_id, userId)
}

export function removeUserId() {
  window.localStorage.removeItem(user_id)
  return Cookies.remove(user_id)
}