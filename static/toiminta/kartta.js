var map;
var markerGroup;

function lisaa_baari(sijainti, nimi) {
  L.marker(sijainti).addTo(markerGroup).bindPopup(nimi);
}

function poista_baarit() {
  markerGroup.clearLayers();
}

function poista_baari(baarin_nimi) {
  markerGroup.eachLayer((l) => {
    if (baarin_nimi === l._popup._content) {
      markerGroup.removeLayer(l);
      return;
    }
  });
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

  var bounds = [
    [62.239172, 25.734671],
    [62.246546, 25.750505],
    [62.243717, 25.759753],
    [62.23542, 25.742759],
  ];

  map.fitBounds(bounds);
  map.setMaxBounds(bounds);
  map.options.minZoom = 14;
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
