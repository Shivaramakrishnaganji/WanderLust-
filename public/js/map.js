if (typeof mapToken === 'undefined' || typeof coordinates === 'undefined') {
  throw new Error('Mapbox token or listing coordinates are missing.');
}

mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: coordinates,
  zoom: 8,
});

new mapboxgl.Marker({ color: 'red' })
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h6>${listingLocation}</h6><p>Exact location is provided after booking</p>`
    )
  )
  .addTo(map);
