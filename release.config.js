module.exports = {
  plugins: [
    // additional config...
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/github",
      {
        assets: [{ path: "dist/WSRawScript.js", label: "WSRawScript.js" }],
      },
    ],
  ],
};
