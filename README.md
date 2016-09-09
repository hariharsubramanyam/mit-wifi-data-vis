# Introduction
This visualization demonstrates Wi-Fi usage at MIT throughout the given day. Each blue circle in the visualization represents a Wi-Fi access point on campus. The radius of the circle is proportional to the number of users connected to the access point at a given time.

The data must be a CSV of (timestamp, num_connected, id, longitude, and latitude) tuples.

If you have any questions about the project or if you would like to use it, please contact me through GitHub issues and I will provide you more information. As this is an old project designed for a specific event, it has not been written as a general purpose tool for mapping arbitrary data over time. If that is something that you would find useful, let me know and I will modify the project accordingly.

# Demo

Go to [wifi.firebaseapp.com](http://wifi.firebaseapp.com).
# Usage

1. Install dependencies with `bower install`. To do this, you need to have [bower](http://bower.io/).
2. Launch an HTTP Server to serve static files in this directory: `python -m SimpleHTTPServer`
3. Navigate your browser to `http://localhost:8000/`

![Screenshot](https://raw.githubusercontent.com/hariharsubramanyam/mit-wifi-data-vis/master/images/screenshot.png)
