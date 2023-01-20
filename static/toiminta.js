function listaa_baarit() {
  let baarit;
}

function lisaa_kasittelijat() {}

function hae_kaikki_baarit() {
  localStorage.clear();
  $.ajax({
    data: {},
    type: "GET",
    url: "/kaikki-baarit",
    success: function (data) {
      localStorage.setItem("baaritiedot", data);
    },
  });
}

$(document).ready(function () {
  hae_kaikki_baarit();
  listaa_baarit();
  lisaa_kasittelijat();

  $("#testi_painike").click(function () {});
});
