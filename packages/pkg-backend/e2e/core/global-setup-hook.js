require('ts-node/register');

// If you want to reference other typescript modules, do it via require:
const tsSetupModule = require('./global-setup-base');

module.exports = async function(globalConfig) {
  // Call your initialization methods here.
  await tsSetupModule.globalSetupBase(globalConfig);
  return null;
};
