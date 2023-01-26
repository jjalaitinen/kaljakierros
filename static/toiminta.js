var map;

// Piilottaa ylimääräiset tiedot pois tieltä
function piilota_tiedot() {
  let piilotettavat = document.getElementsByClassName("lisatieto");
  for (let i = 0; i < piilotettavat.length; i++) {
    piilotettavat[i].style.display = "none";
  }
}

// Funktio listaa klikatun spanin tiedot nimen alle
function nayta_tiedot(e) {
  e.preventDefault();
  let target = e.target;
  let parent = target.parentElement;
  let naytettavat_tiedot = parent.parentNode.childNodes;

  if (naytettavat_tiedot[1].style.display == "none") {
    piilota_tiedot();
    naytettavat_tiedot[1].style.display = "";
  } else {
    piilota_tiedot();
    naytettavat_tiedot[1].style.display = "none";
  }
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
  let nimi_elementti = div_nimi.append(span_nimi);

  let div_kuvaus = $("<div></div>");
  let span_kuvaus = $("<span></span>").text(kuvaus);
  let kuvaus_elementti = div_kuvaus.append(span_kuvaus);

  let div_aukiolo = $("<div></div>");
  let span_aukiolo = $("<span></span>").text(aukiolo);
  let aukiolo_elementti = div_aukiolo.append(span_aukiolo);

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

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var bounds = [[62.239256, 25.735281],[62.246522, 25.749637],[62.243883, 25.758670],[62.235876, 25.742826]];
    map.setMaxBounds(bounds);
    map.options.minZoom = 15; 

  });

  var spans = $("span");
  for (let i = 0; i < spans.length; i++) {
    spans[i].addEventListener("click", nayta_tiedot);
  }
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
    map = L.map('map').setView([62.2426, 25.7473], 18);
    listaa_kaikki_baarit();
    lisaa_kasittelijat();
    $("#karttasivu").css({ display: "none" });
    $("#baari_info").css({ display: "none" });
  });
});
