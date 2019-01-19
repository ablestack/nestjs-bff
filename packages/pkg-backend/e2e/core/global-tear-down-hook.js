require('ts-node/register');

// If you want to reference other typescript modules, do it via require:
const tsTearDownModule = require('./global-tear-down');

module.exports = async function(globalConfig) {
  // Call your initialization methods here.
  await tsTearDownModule.globalTearDown(globalConfig);
  return null;
};
