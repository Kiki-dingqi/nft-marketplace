import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract } from "ethers";
import { BrowserProvider } from "ethers";
import { SWRResponse } from "swr";

export type Web3Dependencies = {
    ethereum: MetaMaskInpageProvider
    provider: BrowserProvider
    contract: Contract
}

export type CrypotoSWRResponse = SWRResponse

export type CrypotoHandlerHook = (params: any) => CrypotoSWRResponse

export type CrypotoHookFactory = {
    (d:Partial<Web3Dependencies>): CrypotoHandlerHook;
}