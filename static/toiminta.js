// Funktio tekee sille tuodusta oliosta elementin html-puuhun
function luo_baari_elementti(baari) {
  let li = $("<li></li>");

  let div = $("<div></div>");

  let p = $("<p></p>").text(baari.nimi);

  let baarilista_elementti = li.append(div).append(p);
  return baarilista_elementti;
}

// Funktion tarkoitus on listata baarit html-sivulle.
// Haetaan tiedot localStoragesta
function listaa_baarit() {
  let baarit = localStorage.getItem("baaritiedot");
  let baarit_objekti = JSON.parse(baarit);
  for (let i = 0; i < baarit_objekti.length; i++) {
    let baari = baarit_objekti[i];
    let baarilista_elementti = luo_baari_elementti(baari);
    $("#kaikki_baarit").append(baarilista_elementti);
  }
}

function lisaa_kasittelijat() {
  $("#lisaa_baari").click(function () {
    let kaikki_baarit = JSON.parse(localStorage.getItem("baaritiedot"));
    let satunnainen_indeksi = Math.floor(Math.random() * kaikki_baarit.length);
    let satunnainen_baari = kaikki_baarit[satunnainen_indeksi];
    let baarilista_elementti = luo_baari_elementti(satunnainen_baari);
    $("#baarikierroslista").append(baarilista_elementti);
  });

  $("#poista_baarit").click(function () {
    $("#baarikierroslista").empty();
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
  hae_kaikki_baarit().then(listaa_baarit);

  lisaa_kasittelijat();
});
