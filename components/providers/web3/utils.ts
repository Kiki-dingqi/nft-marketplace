import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, BrowserProvider } from "ethers";

declare global {
    interface Window {
        ethereum: MetaMaskInpageProvider;
    }
}
export type Web3Params = {
    ethereum: MetaMaskInpageProvider | null;
    provider: BrowserProvider | null;
    contract: Contract | null;
}

export type Web3State = {
    isLoading: boolean;
} & Web3Params

export const createDefaultState = (): Web3State => {
    return {
        ethereum: null,
        provider: null,
        contract: null,
        isLoading: true,
    }
}

// export const loadContract = async (name:string, provider: BrowserProvider): Promise<Contract> => {
//     const res = await fetch(`@/blockchain/out/${name}.sol/${name}.json`);
//     const Artifact = await res.json();
//     const contract = new Contract(Artifact.address, Artifact.abi, provider);
//     return contract;

// }

// Foundry 通常将合约地址存储在环境变量或单独的部署文件中
// 这里假设我们通过环境变量获取地址，或者从部署记录文件中读取
const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID;

// 可以从部署记录文件中加载地址的辅助函数
const loadContractAddress = async (name: string, networkId: string): Promise<string> => {
  // Foundry 部署记录通常在 broadcast 目录下
  // 例如: broadcast/${contractName}/${networkId}/run-latest.json
  try {
    const res = await fetch(`/api/get-file?file=/broadcast/Deploy${name}.s.sol/${networkId}/run-latest.json`);
    const deploymentData = await res.json();
    // Foundry 部署记录的结构
    const contractAddress = deploymentData.transactions[0].contractAddress;
    if (contractAddress) {
      return contractAddress;
    }
  } catch (error) {
    console.error(`Failed to load deployment data for ${name}:`, error);
  }
  
  // 如果找不到部署记录，尝试从环境变量获取
  const envVarAddress = process.env[`NEXT_PUBLIC_${name.toUpperCase()}_ADDRESS`];
  if (envVarAddress) {
    return envVarAddress;
  }
  
  throw new Error(`Contract address for ${name} not found`);
};

export const loadContract = async (
  name: string,  // 合约名称，如 "NftMarket"
  provider: BrowserProvider
): Promise<Contract> => {
  if (!NETWORK_ID) {
    return Promise.reject("Network ID is not defined!");
  }

  // 加载 Foundry 编译的合约 ABI
  // Foundry 编译的合约通常在 out 目录下，结构为 out/${ContractName}.sol/${ContractName}.json
  const res = await fetch(`/api/get-file?file=/out/${name}.sol/${name}.json`);
  const artifact = await res.json();

  // 获取 ABI
  const abi = artifact.abi;
  if (!abi || abi.length === 0) {
    return Promise.reject(`ABI for contract [${name}] not found!`);
  }

  // 获取合约地址（Foundry 方式）
  const address = await loadContractAddress(name, NETWORK_ID);
  if (!address) {
    return Promise.reject(`Address for contract [${name}] not found!`);
  }

  // 创建合约实例
  const contract = new Contract(
    address,
    abi,
    provider
  );
  return contract;
};
