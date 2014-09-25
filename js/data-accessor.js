(function() {
  var DataAccessor = function(csv_data) {
    var lines = csv_data.split("\n");
    var data_for_timestamp = {};

    var tuple;
    var timestamp;
    var lat;
    var lon;
    var num_connected;
    for (var i = 0; i < lines.length; i++) {
      tuple = lines[i].split(",");
      timestamp = parseInt(tuple[0], 10);
      lat = parseInt(tuple[1], 10);
      lon = parseInt(tuple[2], 10);
      num_connected = parseInt(tuple[3], 10);

      if (!data_for_timestamp.hasOwnProperty(timestamp)) {
        data_for_timestamp[timestamp] = [];
      }

      if (isNaN(num_connected)) {
        continue;
      }

      data_for_timestamp[timestamp].push({
        "lat": lat,
        "lon": lon,
        "num_connected": num_connected
      });
    }

    var data_for_time = function(hr, min, am_pm) {
      hr = parseInt(hr, 10);
      min = parseInt(min, 10);
      if (hr == 12) {
        hr = 0;
      }
      if (am_pm == 'PM') {
        hr += 12;
      }
      min = Math.floor(min / 5) * 5;
      var timestamp = hr * 60 + min;
      return data_for_timestamp[timestamp];
    };

    var that = {};
    that.data_for_time = data_for_time;
    return that;
  };

  Global.DataAccessor = DataAccessor;
})();
