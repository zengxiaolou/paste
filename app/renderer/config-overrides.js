const { override, addBabelPlugin } = require('customize-cra');
const path = require('path');

module.exports = override(addBabelPlugin('babel-plugin-styled-components'));
module.exports = function override(config, env) {
  config.resolve.alias['@'] = path.resolve(__dirname, 'src');
  return config;
};
