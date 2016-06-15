"use strict";

app.factory("authFactory", function (firebaseURL) {
  // let ref = new Firebase(firebaseURL);
  let currentUserData = null;

  return {
    
    // Determine if the client is authenticated
    isAuthenticated () {
      let authData = ref.getAuth();
      currentUserData = authData;
      if (authData) {
        return true;
      } else {
        return false;
      }
    },
    
    // Authenticate the client via Firebase
    authenticate (credentials) {
      return new Promise((resolve, reject) => {
        ref.authWithPassword({
          "email": credentials.email,
          "password": credentials.password
        }, function(error, authData) {
          if (error) {
            reject(error);
          } else {
            console.log("authWithPassword method completed successfully");
            resolve(authData);
          }
        });
      });
    },

    getUser () {
      return currentUserData;
    }

  };
});
