import { MetaMaskInpageProvider } from "@metamask/providers";
import {Contract, BrowserProvider } from "ethers";

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