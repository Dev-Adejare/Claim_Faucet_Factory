import hre from "hardhat"

async function main() {
    const DEPLOYED_FACTORY_CONTRACT =
    "0x4f88e5E517a5661fc17A1278E86C6fF5fF3C8070";

    const myAccount = "0x595702603B6c73d663b5AD0f03793Fb03897dcA2";

    const signer = await hre.ethers.getSigner(myAccount);

    const factoryContractInstance = await hre.ethers.getContractAt(
        "ClaimFaucetFactory",
        DEPLOYED_FACTORY_CONTRACT
    );
}

main().catch((error) =>{
    console.error(error);
process.exitCode = 1;
})