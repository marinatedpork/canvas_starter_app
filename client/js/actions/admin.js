"use strict";

import Constants   from   "../constants";
import Dispatcher  from   "../dispatcher";
import Api         from   "./api";
export default {

  loadAccounts(){
    Dispatcher.dispatch({action: Constants.ACCOUNTS_LOADING});
    Api.get(Constants.ACCOUNTS_LOADED, "admin/accounts/");
  },

  loadUsers(accountId, page){
    if(!page){
      page = 1;
    }
    var perPage = 100;
    Dispatcher.dispatch({action: Constants.USERS_LOADING});
    Api.get(Constants.USERS_LOADED, "admin/accounts/" + accountId + "/users?page=" + page + "&per_page=" + perPage);
  },

  resetUsersStore(){
    Dispatcher.dispatch({action: Constants.RESET_USERS});
  },

  changeMainTab(payload){
    Dispatcher.dispatch({ action: Constants.CHANGE_MAIN_TAB_PENDING, mainTab: payload.text });
  },

  getUserData(payload){
    Dispatcher.dispatch({action: Constants.LOADING_USER_DATA, userList: payload.userList});
  },

  setCurrentSelectedUser(payload){
    Dispatcher.dispatch({action: Constants.LOADING_SELECTED_USER_DATA, currentSelectedUser: payload.currentSelectedUser});
  },

  updateUser(accountID, userID, payload){
    Dispatcher.dispatch({action: Constants.USER_UPDATING});
    Api.put(Constants.USER_UPDATED, "admin/accounts/"+ accountID + "/users/" + userID, payload);
  },

  addToSelectedUsers(payload){
    Dispatcher.dispatch({action: Constants.ADD_USER, payload: payload});
  },

  removeFromSelectedUsers(payload){
    Dispatcher.dispatch({action: Constants.REMOVE_USER, payload: payload});
  },

  deleteUsers(payload){
    for(var i=0; i<payload.length; i++){
      var url = "admin/accounts/" + payload[i].account_id + "/users/" + payload[i].id;
      Dispatcher.dispatch({action: Constants.DELETING_USERS});
      Api.del(Constants.DELETE_USERS, url);
    }
    this.loadUsers(payload[0].account_id, 1);
  },

};