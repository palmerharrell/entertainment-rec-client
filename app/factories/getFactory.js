
app.factory("getFactory", function($q, $http, firebaseURL, authFactory) {

  function getFromFirebase() {

    // Return a promise
    return $q(function(resolve, reject) {
      
      var currentUser = authFactory.getUser(); // get currently logged in user

      // get only current user's items from firebase
      $http.get(`${firebaseURL}/items/.json?orderBy="fbuid"&equalTo="${currentUser.uid}"`)
      .success(
        function(JSONobjFromGet) {
          resolve(JSONobjFromGet);
        },
        function(error) {
          reject(error);
        }
      );

    });
  }

  return getFromFirebase;

});


