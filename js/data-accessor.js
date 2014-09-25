(function() {
  var DataAccessor = function(csv_data) {
    var lines = csv_data.split("\n");
    var access_data = [];
    var ind = -1;

    var tuple;
    var timestamp;
    var num_connected;
    var id;
    var lon;
    var lat;
    for (var i = 0; i < lines.length; i++) {
      tuple = lines[i].split(",");
      timestamp = parseInt(tuple[0], 10);
      num_connected = parseInt(tuple[1], 10);
      id = parseInt(tuple[2], 10);
      lon = parseFloat(tuple[3], 10);
      lat = parseFloat(tuple[4], 10);

      timestamp *= 1000;
      timestamp = new Date(timestamp);
      timestamp = timestamp.getHours() * 60 + timestamp.getMinutes();

      if (isNaN(timestamp)) {
        continue;
      }

      if (ind < 0 || access_data[ind] === undefined || access_data[ind].timestamp !== timestamp) {
        ind++;
        access_data[ind] = {
          "timestamp": timestamp,
          "accesses": {}
        };
      }
      access_data[ind].accesses[[lat, lon]] = num_connected;
    }


    var data_for_index = function(index) {
      return {
        "data": access_data[index],
        "new_index": Math.min(index + 1,access_data.length - 1)
      };
    };

    var index_for_time = function(hr, min, am_pm) {
      hr = parseInt(hr, 10);
      min = parseInt(min, 10);
      if (hr == 12) {
        hr = 0;
      }
      if (am_pm == 'PM') {
        hr += 12;
      }
      var timestamp = hr * 60 + min;
      for (var i = 0; i < access_data.length; i++) {
        if (access_data[i].timestamp >= timestamp) {
          return i;
        }
      }
    };

    var that = {};
    that.index_for_time = index_for_time;
    that.data_for_index = data_for_index;
    return that;
  };

  Global.DataAccessor = DataAccessor;
})();
