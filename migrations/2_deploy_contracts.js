var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var ProofOfExistence4 = artifacts.require("./ProofOfExistence4.sol");
var DocumentVerification = artifacts.require("./DocumentVerification.sol");
module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(ProofOfExistence4);
  deployer.deploy(DocumentVerification);
};
