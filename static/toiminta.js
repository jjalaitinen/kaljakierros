// Funktio tekee sille tuodusta oliosta elementin html-puuhun
function luo_baari_elementti(baari) {
  let li = $("<li></li>");

  let div = $("<div></div>");

  let p = $("<p></p>").text(baari.nimi);

  let kokonaisuus = li.append(div).append(p);
  $("#kaikki_baarit").append(kokonaisuus);
}

// Funktion tarkoitus on listata baarit html-sivulle.
// Haetaan tiedot localStoragesta
function listaa_baarit() {
  let baarit = localStorage.getItem("baaritiedot");
  let baarit_objekti = JSON.parse(baarit);
  for (let i = 0; i < baarit_objekti.length; i++) {
    let baari = baarit_objekti[i];
    luo_baari_elementti(baari);
  }
}

function lisaa_kasittelijat() {}

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

  $("#testi_painike").click(function () {
    let baarit = localStorage.getItem("baaritiedot");
    console.log(baarit);
  });
});
