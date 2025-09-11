import { CrypotoHookFactory } from "@_types/hooks";
import useSWR from "swr";

export const hookFactory:CrypotoHookFactory = (deps) => (params) => {
    const swrRes = useSWR("web3/useAccount", ()=>{
        console.log("deps",deps);
        console.log("params",params);
        return "Test User";
    })

    return swrRes;
}

export const useAccount = hookFactory({ethereum:undefined, provider:undefined});