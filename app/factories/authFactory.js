"use strict";

app.factory("authFactory", [
  
  function() {

    let currentUser = null;

    return {
      getUser() {
        return currentUser;
      },
      setUser(user) {
        currentUser = user;
      }
    }
  }

]);
