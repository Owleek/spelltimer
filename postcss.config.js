module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: [
        "last 10 versions",
        ">1%",
        "not dead",
        "since 2017-01-01"
      ],
    })
  ]
}