$(document).ready(function () {
  $('#testi_painike').click(function () {
    $.ajax({
      data: {},
      type: 'GET',
      url: '/baarit',
      success: function (data) {
        baarilista = $('#baarilista');
        baarilista.empty();
        data.forEach((baari) => {
          li = document.createElement('li');
          li.textContent = baari['nimi'];
          baarilista.append(li);
        });
      },
    });
  });
});
