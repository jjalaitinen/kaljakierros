// Annettua id:tä vastaava (alabarin) nappi aktivoidaan ja muut deaktivoidaan
function vaihda_aktiivinen_nappi(nappi_id) {
  $("#alapalkin_painikkeet").children().removeClass("valittuna");
  $(nappi_id).addClass("valittuna");
  return;
}

// Funktio listaa klikatun spanin tiedot nimen alle
function nayta_tiedot(e) {
  e.preventDefault();
  let target = $(e.target);
  if (e.target !== this) {
    target = target.parent();
  }
  let lisatieto = target.parent().children(".lisatieto").first();

  let onAuki = false;
  $(".lisatieto").each(function (index) {
    if ($(this).css("display") === "block") {
      onAuki = true;
    }
  });

  piilota_lisatiedot();

  if (!onAuki) {
    target.find(".nuoli").addClass("kaannettu_nuoli");
    $("#kaikki_baarit").children().css({ filter: "blur(1px) brightness(80%)" });
    lisatieto.parent().css({ filter: "" });
    lisatieto.css({ display: "" });
  }
}

/* Laitetaan piiloon kaikkien baarien lisatiedot */
function piilota_lisatiedot() {
  $(".lisatieto").css({ display: "none" });
  $(".nuoli").removeClass("kaannettu_nuoli");
  $(".lisatieto").parent().css({ filter: "" });
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
  div_nimi.addClass("nimi_ja_nuoli");
  let span_nimi = $("<span></span>").text(nimi);
  span_nimi.addClass("baarin_nimi");
  let nimi_elementti = div_nimi.append(span_nimi);

  let img_nuoli = $("<img></img>");
  img_nuoli.attr("alt", "nuoli_oikealle");
  img_nuoli.attr("src", "./static/kuvat/nuoli.svg");
  img_nuoli.addClass("nuoli");

  div_nimi.append(img_nuoli);

  let div_kuvaus = $("<div></div>").addClass("kuvaus");
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

  let div_osoite = $("<div></div>").addClass("osoite");
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
    baarilista_elementti.append($("<hr></hr>"));
    $("#kaikki_baarit").append(baarilista_elementti);
  }
}

function nayta_sivu(sivun_id, painikkeen_id) {
  vaihda_aktiivinen_nappi(painikkeen_id);
  $("#baari_info").css({ display: "none" });
  $("#karttasivu").css({ display: "none" });
  $("#info_sivu").css({ display: "none" });
  $(sivun_id).css({ display: "" });
}

// Värjätään baarikierrokselle generoitu baari erottuvaksi "Kaikki baarit" -listaan
function varjaa(baari, fontti) {
  let baaritlista = $("#kaikki_baarit").children();

  for (let i = 0; i < baaritlista.length; i++) {
    if (baari.nimi == baaritlista[i].id) {
      baaritlista[i].firstChild.firstChild.style.fontFamily = fontti;
    }
  }
}

function varjaa_valittu(baari) {
  varjaa(baari, "roboto_monobold");
}

function poista_valinta(baari) {
  let baaritlista = $("#kaikki_baarit").children();
  for (let i = 0; i < baaritlista.length; i++) {
    if (baaritlista[i].id === baari["nimi"]) {
      baaritlista[i].firstChild.firstChild.style.fontFamily = "";
    }
  }
}

function lisaa_kasittelijat(kartta) {
  var arvottavat_baarit = JSON.parse(localStorage.getItem("baaritiedot"));
  var arvotut_baarit = [];
  $("#lisaa_baari").on("click", function () {
    if (arvottavat_baarit.length == 0) return;
    let satunnainen_indeksi = Math.floor(
      Math.random() * arvottavat_baarit.length
    );
    let satunnainen_baari = arvottavat_baarit[satunnainen_indeksi];
    kartta.lisaa_baari(
      satunnainen_baari["sijainti"],
      satunnainen_baari["nimi"]
    );

    varjaa_valittu(satunnainen_baari);

    // Poistetaan arvottavista baareista
    arvottavat_baarit.splice(satunnainen_indeksi, 1);

    // Lisätään arvottuihin baareista
    arvotut_baarit.push(satunnainen_baari);
  });

  $("#kumoa_baari").on("click", function () {
    if (arvotut_baarit.length === 0) return;
    let kumottava_baari = arvotut_baarit.pop();
    arvottavat_baarit.push(kumottava_baari);
    poista_valinta(kumottava_baari);
    kartta.poista_baari(kumottava_baari["nimi"]);
  });

  // Alabarin painikkeiden id:t ja painikkeen jälkeen näytettävän sivun id
  var alabar_painikkeet = [
    ["#nayta_kaikki_baarit", "#baari_info"],
    ["#nayta_kartta", "#karttasivu"],
    ["#nayta_info", "#info_sivu"],
  ];

  vaihda_aktiivinen_nappi("#nayta_kartta");

  alabar_painikkeet.forEach((painike_ja_sivu) => {
    $(painike_ja_sivu[0]).on("click", function () {
      if (painike_ja_sivu[1] === "#baari_info") piilota_lisatiedot();
      if (painike_ja_sivu[1] === "#karttasivu") kartta.tarkista_koko();
      nayta_sivu(painike_ja_sivu[1], painike_ja_sivu[0]);
    });
  });

  $(".nimi_ja_nuoli").on("click", nayta_tiedot);
}

export { nayta_sivu, listaa_kaikki_baarit, lisaa_kasittelijat };
