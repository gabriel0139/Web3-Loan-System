// My Code

import { ContractFactory, BytesLike, Interface, formatEther } from 'ethers';
import { Web3Instance } from '../types';

async function DeployContract(
  instance: Web3Instance,
  abi: Interface,
  byteCode: BytesLike | { object: string },
  ...args: any[]
) {
  const factory = new ContractFactory(abi, byteCode, instance.signer);
  const deployTransaction = await factory.getDeployTransaction(...args);

  const feeData = await instance.provider.getFeeData();
  const estimatedGas =
    (await instance.provider.estimateGas(deployTransaction)) * 2n;
  console.log(
    `Balance required: ${formatEther(feeData.gasPrice! * estimatedGas)} ETH`
  );

  const balance = await instance.provider.getBalance(
    instance.signer.address,
    'latest'
  );
  console.log(`Current balance: ${formatEther(balance)} ETH`);

  if (balance > estimatedGas) {
    console.log(`\nDeploying contract...`);
    const deployment = await factory.deploy(...args, {
      gasPrice: feeData.gasPrice,
      gasLimit: estimatedGas,
    });

    console.log(`Waiting for deployment...`);
    await deployment.waitForDeployment();

    const address = await deployment.getAddress();
    console.log(`\nDeployed succesfully to ${address}`);
  } else {
    console.warn(`\nInsufficient balance for deployment...`);
    console.warn(`cancelling deployment...`);
  }
}

export { DeployContract };
