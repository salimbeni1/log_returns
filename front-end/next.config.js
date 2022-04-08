// next.config.js
module.exports = {
  async headers() {
    return [
      {
        // matching all routes
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },

          //{ key: "Content-Type", value: "application/x-www-form-urlencoded; application/json"}
          //{ key: 'Content-Security-Policy', value: 'upgrade-insecure-requests' },

        ]
      }
    ]
  }
};
