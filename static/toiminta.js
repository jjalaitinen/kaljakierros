function listaa_baarit() {
  let baarit = localStorage.getItem("baaritiedot");
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
