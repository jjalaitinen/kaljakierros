$(document).ready(function () {
  $("#testi_painike").click(function () {
    console.log("testi");
    $.ajax({
      data: {},
      type: "GET",
      url: "/testi",
      success: function (data) {
        console.log(data);
      },
    });
  });
});
