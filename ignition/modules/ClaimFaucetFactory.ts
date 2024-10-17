import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// 0x4f88e5E517a5661fc17A1278E86C6fF5fF3C8070

//https://sepolia.basescan.org/address/0x4f88e5E517a5661fc17A1278E86C6fF5fF3C8070#code

const ClaimFaucetFactoryModule = buildModule("ClaimFaucetFactoryModule", (m) => {
  const claimFaucetFactory = m.contract("ClaimFaucetFactory");

  return { claimFaucetFactory };
});

export default ClaimFaucetFactoryModule;