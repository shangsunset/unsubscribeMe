import * as types from '../constants/ActionTypes'

export const receiveSubscriptions = (data) => {
  return {
    type: types.RECEIVE_SUBSCRIPTIONS,
    subscriptions: data
  }
}

export function removeSubscription(index) {
  return {
    type: types.REMOVE_SUBSCRIPTION,
    index
  }
}

export function sendUnsubscribeRequest(index, method) {
  return dispatch => {
    dispatch(removeSubscription(index))

    return fetch('/api/subscriptions', {
      credentials: 'same-origin',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      method: 'post',
      body: JSON.stringify({
        method: method
      })
    })
    .then(checkStatus)
    .then(response => {
      return response.json()
    })
    .then(result => {
      console.log(result);
      
    })
    .catch(error => {
      console.error(error)
    })
  }
}

export const fetchSubscriptions = () => {
  return (dispatch) => {

      return fetch('/api/subscriptions', {
        credentials: 'same-origin'
      })
      .then(checkStatus)
      .then(response => {
        return response.json()
      })
      .then(data => {
        dispatch(receiveSubscriptions(data.subscriptions))
      })
      .catch(error => {
        if (error.status == 403) {
          dispatch(informSessionExpired())
        }
      })
  }
}

export function informSessionExpired() {
  return {
    type: types.INFORM_SESSION_EXPIRED
  }
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response.message
    error.status = response.status
    throw error
  }
}