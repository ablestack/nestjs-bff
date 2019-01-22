require('ts-node/register');

// If you want to reference other typescript modules, do it via require:
const tsTearDownModule = require('./global-tear-down-base');

module.exports = async function(globalConfig) {
  // Call your initialization methods here.
  await tsTearDownModule.globalTearDownBase(globalConfig);
  return null;
};
