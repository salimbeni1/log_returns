// next.config.js
module.exports = {

  async headers() {
    return [
      {
        // matching all routes
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },

          //{ key: 'Content-Security-Policy', value: 'upgrade-insecure-requests' },

        ]
      }
    ]
  }
};
