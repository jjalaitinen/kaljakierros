$(document).ready(function () {
  $("#testi_painike").click(function () {
    $.ajax({
      data: {},
      type: "GET",
      url:"/baarit",
      success: function (data) {
        baarilista = document.getElementById("baarilista");
        baarilista.innerHTML = ""; // parempia tapoja?
        //const baarit = JSON.parse(data)
        data.forEach(baari => {
          li = document.createElement("li");
          li.textContent = baari["nimi"];
          baarilista.appendChild(li);
        });
      },
    });
  });
});
