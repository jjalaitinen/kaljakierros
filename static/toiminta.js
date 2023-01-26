// Funktio tekee sille tuodusta oliosta <li> -elementin html-puuhun
function luo_baari_elementti(baari) {
  let li = $("<li></li>");
  let div = $("<div></div>").text(baari.nimi);

  let baarilista_elementti = li.append(div);
  return baarilista_elementti;
}

// Funktion tarkoitus on listata kaikki baarit html-sivulle.
// Haetaan tiedot localStoragesta
function listaa_kaikki_baarit() {
  let baarit = localStorage.getItem("baaritiedot");
  let baarit_objekti = JSON.parse(baarit);
  baarit_objekti.sort((a, b) => {
    return a["nimi"].localeCompare(b["nimi"], "sv", { sensitivity: "accent" });
  });
  for (let i = 0; i < baarit_objekti.length; i++) {
    let baari = baarit_objekti[i];
    let baarilista_elementti = luo_baari_elementti(baari);
    $("#kaikki_baarit").append(baarilista_elementti);
  }
}

function lisaa_kasittelijat() {
  var kaikki_baarit = JSON.parse(localStorage.getItem("baaritiedot"));
  $("#lisaa_baari").click(function () {
    if (kaikki_baarit.length == 0) return;
    let satunnainen_indeksi = Math.floor(Math.random() * kaikki_baarit.length);
    let satunnainen_baari = kaikki_baarit[satunnainen_indeksi];
    let baarilista_elementti = luo_baari_elementti(satunnainen_baari);
    // Poistetaan
    kaikki_baarit.splice(satunnainen_indeksi, 1);
    $("#baarikierroslista").append(baarilista_elementti);
  });

  $("#poista_baarit").click(function () {
    $("#baarikierroslista").empty();
  });

  $("#nayta_baarikierros").click(function () {
    $("#baarikierros").css({ display: "" });
    $("#baari_info").css({ display: "none" });
    $("#karttasivu").css({ display: "none" });
  });

  $("#nayta_kaikki_baarit").click(function () {
    $("#baari_info").css({ display: "" });
    $("#baarikierros").css({ display: "none" });
    $("#karttasivu").css({ display: "none" });
  });

  $("#nayta_kartta").click(function () {
    $("#baari_info").css({ display: "none" });
    $("#baarikierros").css({ display: "none" });
    $("#karttasivu").css({ display: "" });
  });
}

async function hae_kaikki_baarit() {
  localStorage.clear();
  await $.ajax({
    data: {},
    type: "GET",
    url: "/kaikki-baarit",
    complete: function (data) {
      localStorage.setItem("baaritiedot", JSON.stringify(data.responseJSON));
    },
  });
}

$(document).ready(function () {
  hae_kaikki_baarit().then(() => {
    listaa_kaikki_baarit();
    lisaa_kasittelijat();
    $("#karttasivu").css({ display: "none" });
    $("#baari_info").css({ display: "none" });

    var map = L.map('map').setView([62.2426, 25.7473], 18);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var bounds = [[62.239, 25.735],[62.243, 25.757]];
    

    L.rectangle(bounds, {color: "#ff7800", weight: 1}).addTo(map);
    
    map.fitBounds(latlngs); 
    map.setMaxBounds(latlngs);
    map.options.minZoom = map.getZoom(); 
  });
});
