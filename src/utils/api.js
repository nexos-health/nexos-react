/*global google*/

const service = new google.maps.places.AutocompleteService();

export const fetchPlaces = (searchTerm) => {
  let options = {
    "input": searchTerm,
    "types": ["(cities)"],
    "componentRestrictions": {country: ["au"]},
  };

  let placesPredictions = new Promise((resolve) => {
    const displaySuggestions = (predictions, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        resolve();
      }
      resolve(predictions && predictions.map((prediction) => {
        return {
          "value": prediction.place_id,
          "label": prediction.description
        }
      }));
    };

    service.getPlacePredictions(options, displaySuggestions);
  });

  return placesPredictions
};