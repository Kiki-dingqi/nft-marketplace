
/* eslint-disable @next/next/no-img-element */
"use client";
import type { NextPage } from 'next'
import { BaseLayout, NFTList } from '@/components'
import  nfts  from '@/content/meta.json'
import { NftMeta } from '@/types/nft'
import { useWeb3 } from '@/components/providers/web3'
const Home: NextPage = () => {
  const { ethereum, provider, contract, isLoading} = useWeb3();
  console.log("contract=", contract);
  const getNftInfo = async () => {
    // const name = await contract!.name();
    // // const name = await contract!.Contract.interface!.fragments.name();
    // const symbol = await contract!.symbol();
    // console.log("nfts=", name, symbol);
  };

  if (contract) {
    getNftInfo();
  }
  // const getAccount = async () => {
  //   const accounts = await provider!.listAccounts();
  //   console.log("accounts==",accounts);
  // }

  const getAccount = async () => {
    try {
      // 主动请求用户授权
      const accounts = await provider!.send("eth_requestAccounts", []); 
      console.log("授权的账户：", accounts);
    } catch (error) {
      console.log("用户拒绝授权或发生错误：", error);
    }
  };

  if(provider){
    getAccount();
  }

  
  return (
    <BaseLayout>
      <div className="relative bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="absolute inset-0">
          <div className="bg-white h-1/3 sm:h-2/3" />
        </div>
        <div className="relative">
          <div className="text-center">
            <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">Amazing Creatures NFTs</h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Mint a NFT to get unlimited ownership forever!
            </p>
          </div>
          <NFTList nfts={nfts as NftMeta[]} />
        </div>
      </div>
    </BaseLayout>
  )
}

export default Home