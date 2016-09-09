(function() {
  /**
   * DataAccessor is an object constructor that parses CSV data containing 
   * (timestamp, num_connected, id, longitude, latitude) tuples. The timestamps should
   * all fall within the same day.
   * 
   * It reads the tuples and puts them into an array. It exposes two
   * methods:
   * 1. Access tuple given index into array
   * 2. Access the index given a the hour of the day, minutes within the hour, 
   * and whether the time is AM/PM.
   * 
   * In this project, we use this to access the WiFi access data.
   * 
   * The object constructor accepts a string containing CSV data as described above.
   */
  var DataAccessor = function(csv_data) {
    // Break the string into lines.
    var lines = csv_data.split("\n");

    // This is a map from timestamp to:
    // {
    //   "timestamp": <timestamp>,
    //   "accesses": <object keyed by [lat, lon] and mapped to num_connected>
    // }    
    var accesses_for_timestamp = lines.map(function(line) {
      // Split the line into an array of the form:
      // (timestamp, num_connected, id, longitude, latitude)
      var tuple = line.split(",");
      var timestamp = parseInt(tuple[0], 10);

      // Convert to milliseconds, create a Date, and then figure out the number of minutes
      // in the day. 
      timestamp *= 1000;
      timestamp = new Date(timestamp);
      timestamp = timestamp.getHours() * 60 + timestamp.getMinutes();

      return {
        "timestamp": timestamp,
        "num_connected": parseInt(tuple[1], 10),
        "id": parseInt(tuple[2], 10),
        "lon": parseFloat(tuple[3], 10),
        "lat": parseFloat(tuple[4], 10)
      };
    }).filter(function(record) {
      // Remove records without a timestamp.
      return !isNaN(record.timestamp);
    }).reduce(function(old_map, record) {
      // Create entry in map if it doesn't already exist.
      if (old_map[record.timestamp] === undefined) {
        old_map[record.timestamp] = {
          "timestamp": record.timestamp,
          "accesses": {}
        };
      }
      // Update entry.
      old_map[record.timestamp].accesses[[record.lat, record.lon]] = record.num_connected;

      return old_map;
    }, {});
    console.log(accesses_for_timestamp);

    // Create an array sorted by timestamp that contains objects of the form:
    // { 
    //   "timestamp": <timestamp>.
    //   "accesses": {
    //     "[lat, lon]": num_connected,
    //     ...
    //   }
    // }
    var access_data = Object.keys(accesses_for_timestamp).filter(function(key) {
      // Filter down to keys that are not JavaScript defaults.
      return accesses_for_timestamp.hasOwnProperty(key);
    }).map(function(key) {
      // Get the object for the key.
      return accesses_for_timestamp[key];
    }).sort(function(record1, record2) {
      // Sort by timestamp.
      if (record1.timestamp < record2.timestamp) {
        return -1;
      }
      if (record1.timestamp > record2.timestamp) {
        return 1;
      }
      return 0;
    });
    console.log(access_data);

    // Now prepare an object that we will return.
    var that = Object.create(DataAccessor.prototype);

    /**
     * Given an index into the array, return an object of the form:
     * {
     *   "data": {
     *      "timestamp": timestamp,
     *      "accesses": {
     *        "[lat, lon]": num_connected,
     *         ...
     *       }      
     *    },
     *    "new_index": index + 1 or the last index of the array (whichever is smaller).
     * }
     */
    that.data_for_index = function(index) {
      return {
        "data": access_data[index],
        "new_index": Math.min(index + 1,access_data.length - 1)
      };
    };

    /**
     * Given an hour of the day (1 to 12), minute (0 to 59) and an am_pm ("AM" or "PM"),
     * return the smallest index of the array that is >= the timestamp.
     */
    that.index_for_time = function(hr, min, am_pm) {
      // Parse the inputs.
      hr = parseInt(hr, 10);
      min = parseInt(min, 10);
      if (hr == 12) {
        hr = 0;
      }
      if (am_pm == 'PM') {
        hr += 12;
      }
      var timestamp = hr * 60 + min;

      // Figure out the index.
      for (var i = 0; i < access_data.length; i++) {
        if (access_data[i].timestamp >= timestamp) {
          return i;
        }
      }
    };

    // Freeze object to prevent mutation and return it.
    Object.freeze(that);
    return that;
  };

  // Make the DataAccessor accessible globally.
  Global.DataAccessor = DataAccessor;
})();
