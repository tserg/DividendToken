var MintableToken = artifacts.require("ERC20Mintable");

module.exports = function(deployer) {
  deployer.deploy(MintableToken);

};
