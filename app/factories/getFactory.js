
app.factory("getFactory", function($q, $http, apiURL, authFactory) {

  function getFromAPI() {

    // Return a promise
    return $q(function(resolve, reject) {
      
      var currentUser = authFactory.getUser(); // get currently logged in user

      // get only current user's items from API
      // Example URL: http://localhost:5000/api/mediaitem?userid=12
      $http.get(`${apiURL}/mediaitem?userid=${currentUser.IdAppUser}`)
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


