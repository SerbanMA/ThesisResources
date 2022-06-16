/* eslint-disable no-undef */
const CorgiToken = artifacts.require("CorgiToken");

module.exports = async function (deployer) {
  await deployer.deploy(CorgiToken, "Corgi Token", "CRGI");
};
