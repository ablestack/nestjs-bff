require('ts-node/register');

// If you want to reference other typescript modules, do it via require:
const tsSetupModule = require('./global-setup');

module.exports = async function(globalConfig) {
  // Call your initialization methods here.
  await tsSetupModule.globalSetup(globalConfig);
  return null;
};
