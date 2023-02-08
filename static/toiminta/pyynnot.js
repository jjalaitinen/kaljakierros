async function hae_kaikki_baarit() {
  let tietojen_hakuaika = localStorage.getItem("tietojen_hakuaika");
  if (tietojen_hakuaika) {
    let millisekunnit = parseInt(tietojen_hakuaika,0);
    let erotus = (Date.now() - millisekunnit)/1000;
    // Jos on kulunut alle 10 sekuntia viimeisestä baari.json hausta, ei haeta uudelleen
    if (erotus < 10) {
      return;
    }
  }
  
  localStorage.clear();
  await $.ajax({
    data: {},
    type: "GET",
    url: "/kaikki-baarit",
    complete: function (data) {
      localStorage.setItem("tietojen_hakuaika", Date.now());
      localStorage.setItem("baaritiedot", JSON.stringify(data.responseJSON));
    },
  });
}

export {hae_kaikki_baarit}