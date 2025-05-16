const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CertificateModule", (m) => {
  const certificate = m.contract("SBT721Certificate", []);

  return { certificate };
});
