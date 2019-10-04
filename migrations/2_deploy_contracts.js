var MintableToken = artifacts.require("DividendToken");

module.exports = function(deployer) {
  deployer.deploy(MintableToken);

};
