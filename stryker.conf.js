module.exports = function(config) {
  config.set({
    mutator: "typescript",
    packageManager: "yarn",
    reporters: ["clear-text", "progress"],
    testRunner: "command",
    commandRunner: { command: 'yarn features' },
    transpilers: [],
    coverageAnalysis: "off",
    tsconfigFile: "tsconfig.json",
    mutate: [
      "src/events/*.ts",
      "src/users/*.ts",
    ]
  });
};
