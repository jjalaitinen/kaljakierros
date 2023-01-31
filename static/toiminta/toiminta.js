import * as kartta from "./kartta.js";
import * as pyynnot from "./pyynnot.js";
import * as kayttoliittyma from "./kayttoliittyma.js";

$(function () {
  pyynnot.hae_kaikki_baarit().then(() => {
    kartta.luo_kartta();
    kayttoliittyma.nayta_sivu("#baarikierros");
    kayttoliittyma.listaa_kaikki_baarit();
    kayttoliittyma.lisaa_kasittelijat(kartta);
    kartta.kartan_alustus();
  });
});
