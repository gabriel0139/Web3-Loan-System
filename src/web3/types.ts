// My Code

import {
  AddressLike,
  BigNumberish,
  BrowserProvider,
  ContractTransactionResponse,
  JsonRpcSigner,
  Network,
  TransactionReceipt,
} from 'ethers';
import { LoanState } from 'src/app/shared/loan/loan';

export interface Web3Connector {
  connectWallet: () => Promise<Web3Result<Web3Instance>>;
  disconnectWallet: () => Promise<Web3Result<null>>;
  connected: () => boolean;
  changeNetwork: (network: NetworkInfo) => Promise<Web3Result<null>>;
  addToWallet: (id: bigint) => Promise<Web3Result<null>>;
  mintAccessKey: () => Promise<Web3Result<[string, bigint]>>;
  instance?: Web3Instance;
}

export interface UserContract {
  name: () => Promise<string>;
  getNextId: () => Promise<bigint>;
  symbol: () => Promise<string>;
  safeMintAccessToken: (to: AddressLike) => Promise<any>;
  safeMintAdminAccessToken: (to: AddressLike) => Promise<any>;
  balanceOf: (to: AddressLike) => Promise<bigint>;
  requestLoan: (
    tokenId: bigint,
    loanId: bigint,
    deadline: bigint,
    details: bigint[][]
  ) => Promise<LoanResponse>;
  getLoanIds: (tokenId: bigint) => Promise<bigint[]>;
  updateLoanState: (
    tokenId: bigint,
    loanId: bigint,
    state: LoanState
  ) => Promise<void>;
  getLoanDetails: (tokenId: bigint, loanId: bigint) => Promise<LoanResponse>;
  cancelLoan: (tokenId: bigint, loanId: bigint) => Promise<boolean>;
  tokenOfOwnerByIndex: (owner: AddressLike, index: bigint) => Promise<bigint>;
  getAllLoansByTokenId: (tokenId: bigint) => Promise<LoanResponse[]>;
  getPendingLoans: () => Promise<LoanResponse[]>;
  // pendingLoanCount: () => Promise<bigint>
}

export interface Web3Instance {
  provider?: BrowserProvider;
  signer?: JsonRpcSigner;
  network?: Network;
  userContract: UserContract;
  id: bigint;
  isManager: boolean;
}

export enum Web3Error {
  // Connection
  WrongChainId = 101,
  NotInstalled = 102,
  ConnectionRefused = 103,
  DisconnectionRefused = 104,

  // Token / NFT / BALANCE
  TokenAlreadyAdded = 201,
  MintFailed = 202,
  InsufficientBalance = 2032,

  // Network
  NetworkAddRefused = 301,
  NetworkChangeRefused = 302,
}

export interface Web3Result<T> {
  success: boolean;
  value?: T;
  error?: Web3Error;
}

export interface NetworkInfo {
  chainId: BigNumberish;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[]; // ["https://rpc-mumbai.maticvigil.com"],
  blockExplorerUrls: string[]; // ["https://mumbai.polygonscan.com/"],
}

export interface LoanResponse {
  id: bigint;
  state: LoanState;
  deadline: bigint;
  details: { id: bigint; quantity: bigint }[];
  tokenId?: bigint;
}
