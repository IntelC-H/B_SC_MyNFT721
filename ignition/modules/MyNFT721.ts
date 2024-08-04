import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const JAN_1ST_2030 = 1893456000;
const ONE_GWEI: bigint = 1_000_000_000n;

const MyNFT721Module = buildModule("MyNFT721Module", (m) => {
  const unlockTime = m.getParameter("unlockTime", JAN_1ST_2030);
  const lockedAmount = m.getParameter("lockedAmount", ONE_GWEI);

  const lock = m.contract("MyNFT721", [unlockTime], {
    value: lockedAmount,
  });

  return { lock };
});

export default MyNFT721Module;
