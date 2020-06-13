
export const kmToLatLng = (kilometers, latitude) => {
  let kmToLatRatio =  Math.PI / (180 * 110.574); // radians
  let kmToLngRatio = Math.PI / (180 * 111.320 * Math.cos(latitude)); // radians

  return [
    kilometers * kmToLatRatio * 180 / Math.PI, // latDelta
    kilometers * kmToLngRatio * 180 / Math.PI, // lngDelta
  ];
};