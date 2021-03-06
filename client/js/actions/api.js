"use strict";

import Request       from "superagent";
import User          from "../stores/user";
import Constants     from "../constants";
import Dispatcher    from "../dispatcher";
import SettingsStore from '../stores/settings';

const TIMEOUT = 10000;

var _pendingRequests = {};

function abortPendingRequests(key) {
  if(_pendingRequests[key]) {
    _pendingRequests[key]._callback = function() {};
    _pendingRequests[key].abort();
    _pendingRequests[key] = null;
  }
}

// Get the JWT from the user
function jwt() {
  return User.jwt();
}

function csrfToken() {
  return SettingsStore.current().csrfToken;
}

function makeUrl(part){
  if(part.indexOf("http") >= 0){
    return part;
  } else {
    return SettingsStore.current().apiUrl + '/' + part;
  }
}

// GET request with a JWT token and CSRF token
function get(url) {
  return Request
    .get(url)
    .timeout(TIMEOUT)
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer ' + jwt())
    .set('X-CSRF-Token', csrfToken());
}

// POST request with a JWT token and CSRF token
function post(url, body) {
  return Request
    .post(url)
    .send(body)
    .set('Accept', 'application/json')
    .timeout(TIMEOUT)
    .set('Authorization', 'Bearer ' + jwt())
    .set('X-CSRF-Token', csrfToken());
}

// PUT request with a JWT token and CSRF token
function put(url, body) {
  return Request
    .put(url)
    .send(body)
    .set('Accept', 'application/json')
    .timeout(TIMEOUT)
    .set('Authorization', 'Bearer ' + jwt())
    .set('X-CSRF-Token', csrfToken());
}

// DELETER request with a JWT token and CSRF token
function del(url) {
  return Request
    .del(url)
    .set('Accept', 'application/json')
    .timeout(TIMEOUT)
    .set('Authorization', 'Bearer ' + jwt())
    .set('X-CSRF-Token', csrfToken());
}

function dispatch(key, response) {
  Dispatcher.dispatch({
    action: key,
    data: response
  });
}

// Dispatch a response based on the server response
function dispatchResponse(key) {
  return function(err, response) {
    if(err && err.timeout === TIMEOUT) {
      dispatch(Constants.TIMEOUT, response);
    } else if(response.status === 400 || response.status === 401) {
      dispatch(Constants.NOT_AUTHORIZED, response);
    } else if(!response.ok) {
      dispatch(Constants.ERROR, response);
    } else {
      dispatch(key, response);
    }
  };
}

function doRequest(key, url, callback){
  if(key != Constants.DELETE_USERS)
    abortPendingRequests(key);
  var request = _pendingRequests[key] = callback(makeUrl(url));
  request.end(dispatchResponse(key));
  return request;
}

export default {

  get(key, url){
    return doRequest(key, url, function(fullUrl){
      return get(fullUrl);
    });
  },

  post(key, url, body){
    return doRequest(key, url, function(fullUrl){
      return post(fullUrl, body);
    });
  },

  put(key, url, body){
    return doRequest(key, url, function(fullUrl){
      return put(fullUrl, body);
    });
  },

  del(key, url){
    return doRequest(key, url, function(fullUrl){
      return del(fullUrl);
    });
  }

};
