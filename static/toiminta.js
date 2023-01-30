var map;
var markerGroup;

function mapin_alustus() {
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  L.control
    .attribution({
      position: "topright",
    })
    .addTo(map);

  var bounds = [
    [62.239172, 25.734671],
    [62.246546, 25.750505],
    [62.243717, 25.759753],
    [62.23542, 25.742759],
  ];

  markerGroup = L.layerGroup().addTo(map);

  map.fitBounds(bounds);
  map.setMaxBounds(bounds);
  map.options.minZoom = 14;
}

// Annettua id:tä vastaava (alabarin) nappi aktivoidaan ja muut deaktivoidaan
function vaihda_aktiivinen_nappi(nappi_id) {
  $("#alapalkki").children().removeClass("valittuna");
  $(nappi_id).addClass("valittuna");
  return;
}

// Funktio listaa klikatun spanin tiedot nimen alle
function nayta_tiedot(e) {
  e.preventDefault();
  //let id = e.target.parentNode.parentNode.id;
  let target = $(e.target);
  let lisatieto = target.parent().parent().children(".lisatieto").first();
  var oliJoPiilossa = lisatieto.css("display") == "none";
  $(".lisatieto").css({ display: "none" });
  $(".lisatieto").parent().css({ filter: "blur(1px) brightness(80%)" });
  if (oliJoPiilossa) {
    lisatieto.parent().css({ filter: "" });
    lisatieto.css({ display: "" });
  } else {
    $(".lisatieto").parent().css({ filter: "" });
  }
}

function luo_aukiolot(aukiolo_obj) {
  let ul = $("<ul></ul>").addClass("aukiololista");

  for (let i = 0; i < aukiolo_obj.length; i++) {
    let viikonpaiva = aukiolo_obj[i].viikonpaiva;
    let auki = aukiolo_obj[i].auki;
    let kiinni = aukiolo_obj[i].kiinni;

    let li = $("<li></li>").addClass("aukioloalkio");
    let viikonpaiva_span = $("<span></span>").text(viikonpaiva);
    let ajat_span = $("<span></span>").text(auki + " - " + kiinni);
    li.append(viikonpaiva_span).append(ajat_span);
    ul.append(li);
  }

  return ul;
}

// Funktio tekee sille tuodusta oliosta <li> -elementin html-puuhun
function luo_baari_elementti(baari) {
  let kuvaus = baari.kuvaus;
  let osoite = baari.osoite;
  let aukiolo = baari.aukiolo;
  let nimi = baari.nimi;

  let li = $("<li></li>");

  let div_nimi = $("<div></div>");
  let span_nimi = $("<span></span>").text(nimi);
  span_nimi.addClass("baarin_nimi");
  let nimi_elementti = div_nimi.append(span_nimi);

  let div_kuvaus = $("<div></div>");
  let span_kuvaus = $("<span></span>").text(kuvaus);
  let kuvaus_elementti = div_kuvaus.append(span_kuvaus);

  let div_aukiolo = $("<div></div>");
  let aukiolo_elem = "";
  if (typeof aukiolo === "undefined") {
    aukiolo_elem = $("<ul></ul>");
  } else {
    aukiolo_elem = luo_aukiolot(aukiolo);
  }
  let aukiolo_elementti = div_aukiolo.append(aukiolo_elem);

  let div_osoite = $("<div></div>");
  let span_osoite = $("<span></span>").text(osoite);
  let osoite_elementti = div_osoite.append(span_osoite);

  let lisatieto_elementti = $("<div></div>")
    .append(kuvaus_elementti)
    .append(aukiolo_elementti)
    .append(osoite_elementti);
  lisatieto_elementti.addClass("lisatieto").css("display", "none");

  let baarilista_elementti = li
    .append(nimi_elementti)
    .append(lisatieto_elementti);
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
    baarilista_elementti.attr("id", baari["nimi"]);
    $("#kaikki_baarit").append(baarilista_elementti);
  }
}

function nayta_sivu(sivun_id) {
  $("#baarikierros").css({ display: "none" });
  $("#baari_info").css({ display: "none" });
  $("#karttasivu").css({ display: "none" });
  $(sivun_id).css({ display: "" });
}

function lisaa_kasittelijat() {
  var kaikki_baarit = JSON.parse(localStorage.getItem("baaritiedot"));
  $("#lisaa_baari").click(function () {
    if (kaikki_baarit.length == 0) return;
    let satunnainen_indeksi = Math.floor(Math.random() * kaikki_baarit.length);
    let satunnainen_baari = kaikki_baarit[satunnainen_indeksi];
    L.marker(satunnainen_baari["sijainti"]).addTo(markerGroup);
    //L.marker(satunnainen_baari["sijainti"]).addTo(map);
    let baarilista_elementti = luo_baari_elementti(satunnainen_baari);
    // Poistetaan
    kaikki_baarit.splice(satunnainen_indeksi, 1);
    $("#baarikierroslista").append(baarilista_elementti);
  });

  $("#poista_baarit").click(function () {
    $("#baarikierroslista").empty();
    markerGroup.clearLayers();
  });

  $("#nayta_baarikierros").click(function () {
    vaihda_aktiivinen_nappi("#nayta_baarikierros");
    nayta_sivu("#baarikierros");
  });

  $("#nayta_kaikki_baarit").click(function () {
    vaihda_aktiivinen_nappi("#nayta_kaikki_baarit");
    nayta_sivu("#baari_info");
  });

  $("#nayta_kartta").click(function () {
    vaihda_aktiivinen_nappi("#nayta_kartta");
    nayta_sivu("#karttasivu");
  });

  $(".baarin_nimi").click(nayta_tiedot);
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
    map = L.map("map").setView([62.2426, 25.7473], 16);
    nayta_sivu("#baarikierros");
    piilota_muut_kuin_etusivu();
    listaa_kaikki_baarit();
    lisaa_kasittelijat();
    mapin_alustus();
  });
});
