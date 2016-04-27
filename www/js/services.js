angular.module('photoApp.services', [])

// the .factory() method is called internally by Angular JS when the
// PhotoLibraryService is used somewhere in the application for the first time.
// When this service is used again, the same service object is returned.
// more info on angular services here: https://docs.angularjs.org/guide/services
.factory('PhotoLibraryService', function($http) {
  // a 'promise' object that resolves to an array of photos
  // more info on promises here: https://docs.angularjs.org/api/ng/service/$q
  var photosPromise;

  // this defines the PhotoLibraryService object
  return {
    // initializes the photosPromise if necessary and returns it
    getPhotos: function() {
      if (!photosPromise) {
        // Angular's $http.get() returns a promise object, which resolves to
        // an HTTP response upon success. Since we only need the data from the
        // response, we add an extra .then() step. The result is still a promise,
        // but such that resolves to an array of photos.
        photosPromise = $http.get('data/photos.json')
          .then(function onFulfilled(response) {
            // this code executes asynchronously after .getPhotos() returns
            // it defines how the promise returned by .getPhotos() will be resolved
            return response.data;
          });
      }
      // Note that no errors handling is defined here. It's the responsibility of
      // the caller to provide an onRejected() error handler
      return photosPromise;
    },

    // returns a promise object that resolves to a single photo (or to undefined)
    getPhoto: function(photoId) {
      // notice that the return value is a result of .then(), i.e. it is also a promise
      // more information on the .then() method:
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
      return photosPromise.then(function onFulfilled(photos) {
        // This code executes asynchronously after .getPhoto() returns.
        // It defines how the promise returned by .getPhoto() will be resolved.
        // Note: inside this function 'photos' is the actual array of photos
        return photos.filter(
          // Array.filter() returns another array with only the matching elements.
          // We assume here that photo IDs are unique and so the array of matches will
          // always have only one element.
          function isMatching(photo) {
            return photo.id === photoId;
          })[0];
      });
    },

    // Updates the internal photos promise to resolve to different array of photos
    // (the new array will contain one more photo).
    // This method does not return anything.
    addPhoto: function(newPhoto) {
      // notice that the return value is a result of .then(), i.e. it is also a promise
      photosPromise = photosPromise.then(function onFulfilled(photos) {
        // This code executes asynchronously after .addPhoto() returns.
        // It defines how the promise returned by .addPhoto() will be resolved.
        // Note: inside this function 'photos' is the actual array of photos
        photos.push(newPhoto);
        return photos;
      });
    },

    // Updates the internal photos promise to resolve to different array of photos
    // (the new array will contain one less photo).
    // This method does not return anything.
    deletePhoto: function(photoId) {
      // notice that the return value is a result of .then(), i.e. it is also a promise
      return photosPromise.then(function onFulfilled(photos) {
        // This code executes asynchronously after .addPhoto() returns.
        // It defines how the promise returned by .addPhoto() will be resolved.
        // Note: inside this function 'photos' is the actual array of photos
        return photos.filter(
          // Array.filter() returns another array with only the matching elements.
          function isMatching(photo) {
            return photo.id !== photoId;
          }
        );
      });
    }
  };
});
