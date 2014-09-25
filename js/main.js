(function() {
  var am_pm;
  var time_hr;
  var time_min;

  var am_pm_handler = function() {
    if (am_pm.text() == "PM") {
      am_pm.text("AM");
    } else {
      am_pm.text("PM");
    }
  };

  $(document).ready(function() {
    am_pm = $("#am-pm");
    am_pm.click(am_pm_handler);

    var map = L.map('map').setView([42.360183,-71.090469], 17);

    // add an OpenStreetMap tile layer
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  });
})();
