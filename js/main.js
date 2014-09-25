(function() {
  var am_pm;
  var time_hr;
  var time_min;
  var go_to_time_button;
  var animate_button;
  var data_accessor = null;

  var am_pm_handler = function() {
    if (am_pm.text() == "PM") {
      am_pm.text("AM");
    } else {
      am_pm.text("PM");
    }
  };

  var go_to_time_handler = function() {
    var hr = Number(time_hr.text());
    var min = Number(time_min.text());
    var am_pm_string = am_pm.text();
    if (data_accessor !== null) {
      var data = data_accessor.data_for_time(hr, min, am_pm_string);
      console.log(data);
    }
  };

  $(document).ready(function() {
    am_pm = $("#am-pm");
    time_hr = $("#time-hr");
    time_min = $("#time-min");
    go_to_time_button = $("#go-to-time");
    animate_button = $("#animate");

    am_pm.click(am_pm_handler);
    go_to_time_button.click(go_to_time_handler);

    $.get("util/output.csv", function(data) {
      data_accessor = Global.DataAccessor(data);
    });

    var map = L.map('map').setView([42.360183,-71.090469], 17);

    // add an OpenStreetMap tile layer
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  });
})();
