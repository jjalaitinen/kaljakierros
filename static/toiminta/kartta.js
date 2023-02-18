var map;
var markerGroup;

function lisaa_baari(sijainti, nimi) {
  map.closePopup();
  L.marker(sijainti).addTo(markerGroup).bindPopup(nimi).openPopup();
}

function poista_baarit() {
  markerGroup.clearLayers();
}

function poista_baari(baarin_nimi) {
  let layers = markerGroup.getLayers();
  layers.forEach((l) => {
    if (baarin_nimi === l._popup._content) {
      markerGroup.removeLayer(l);
      layers.pop();
      return;
    }
  });
  if (layers.length > 0) layers[layers.length - 1].openPopup();
}

function luo_kartta() {
  map = L.map("map").setView([62.2426, 25.7473], 16);
  markerGroup = L.layerGroup().addTo(map);
}

function kartan_alustus() {
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  var default_bounds = [
    [62.239172, 25.734671],
    [62.246546, 25.750505],
    [62.243717, 25.759753],
    [62.23542, 25.742759],
  ];

  var max_bounds = [
    [62.243725, 25.643903],
    [62.286203, 25.749468],
    [62.245303, 25.909074],
    [62.18056, 25.745323],
  ];

  map.fitBounds(default_bounds);
  map.setMaxBounds(max_bounds);
  map.options.minZoom = 12;
  map.options.maxZoom = 17;
}

function tarkista_koko() {
  setTimeout(function () {
    map.invalidateSize();
  }, 10);
}

export {
  kartan_alustus,
  luo_kartta,
  poista_baarit,
  lisaa_baari,
  tarkista_koko,
  poista_baari,
};
