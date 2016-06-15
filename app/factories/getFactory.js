
app.factory("getFactory", function($q, $http, apiURL, authFactory) {

  function getFromAPI() {

    // Return a promise
    return $q(function(resolve, reject) {
      
      var currentUser = authFactory.getUser(); // get currently logged in user

      // get only current user's items from firebase
      $http.get(`${apiURL}/items/.json?orderBy="fbuid"&equalTo="${currentUser.uid}"`)
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

  return getFromAPI;

});


