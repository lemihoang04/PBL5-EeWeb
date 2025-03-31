module.exports = {
    // Other existing config...
    resolve: {
        fallback: {
            "http": false,
            "https": false,
            "zlib": false,
            "stream": false,
            "crypto": false
        }
    }
};