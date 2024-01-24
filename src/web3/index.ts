// My Code

import { ethers, Contract } from 'ethers';
import {
  NetworkInfo,
  LoanResponse,
  Web3Connector,
  Web3Error,
  Web3Instance,
  Web3Result,
  UserContract,
} from './types';
import { Y28_CONTRACT_ABI } from './abi';
import {
  ACCESS_CARD_META_URL,
  CONTRACT_ADDRESS,
  SUPPORTED_NETWORKS as SUPPORTED_NETWORKS,
} from './const';
import firebase from 'firebase';
import { numArray } from 'src/util/array';
import { LoanState } from 'src/app/shared/loan/loan';
import { last } from 'rxjs';

// 1. give every item a unique static id
// 2. create a loan struct, that represents a list that holds an X amount of items of id Y
// 3. create a request loan function in the contract
// 4. create an onlyOwner funtion to request pending loans,
// 5. create an onlyOwner function to approve / deny loan,
// 6. create a public function to request your own loans with their respecitive status

export const Web3Handler: Web3Connector = {
  connectWallet,
  disconnectWallet,
  connected,
  changeNetwork,
  addToWallet,
  mintAccessKey,
};

function connected() {
  return Web3Handler.instance != undefined;
}

function onDisconnected(accounts: any[]) {
  if (accounts.length == 0) {
    firebase
      .auth()
      .signOut()
      .then(() => {
        Web3Handler.disconnectWallet().then((disconnectResult) => {
          if (disconnectResult.success) {
            console.warn('disconnected wallet');
            this.router.navigateByUrl('/login');
          }
        });
      });
  } else {
    console.log('testsre');
  }
}

async function connectWallet(): Promise<Web3Result<Web3Instance>> {
  // Check if metamask is installed
  if (window.ethereum != undefined) {
    try {
      // If already logged in, return current wallet
      if (Web3Handler.instance) {
        return {
          success: true,
          value: Web3Handler.instance,
        };
      } else {
        // Connect to the MetaMask EIP-1193 object. This is a standard
        // protocol that allows Ethers access to make all read-only
        // requests through MetaMask.

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const userContract = new Contract(
          CONTRACT_ADDRESS,
          Y28_CONTRACT_ABI.abi,
          signer
        );

        // Listen to wallet disconnect
        (window.ethereum as any).on('accountsChanged', onDisconnected);

        // Ensure that we are on a supported network
        try {
          await changeNetwork(SUPPORTED_NETWORKS[0]);
        } catch {}

        // Request the amount of access keys that are available to this wallet
        const keyPassCount = await userContract['balanceOf'](signer.address);
        var accountId: bigint = -1n;
        var isManager: boolean = false;

        if (keyPassCount > 0) {
          accountId = await userContract['tokenOfOwnerByIndex'](
            signer.address,
            0n
          );
          isManager = await userContract['checkAdmin'](signer.address);
        }

        // update the instance
        Web3Handler.instance = {
          provider,
          signer,
          network,
          id: accountId,
          isManager,
          userContract: {
            name: userContract['name'],
            symbol: userContract['symbol'],
            // pendingLoanCount: () =>  userContract['pendingLoanCount'](),
            getNextId: () => userContract['getNextId'](),
            safeMintAccessToken: (recipient) =>
              userContract['safeMintAccessToken'](recipient),
            safeMintAdminAccessToken: (recipient) =>
              userContract['safeMintAdminAccessToken'](recipient),
            balanceOf: (recipient) => userContract['balanceOf'](recipient),
            tokenOfOwnerByIndex: (owner, index) =>
              userContract['tokenOfOwnerByIndex'](owner, index),
            requestLoan: (tokenId, loanId, deadline, details) =>
              requestLoan(userContract, tokenId, loanId, deadline, details),
            getLoanIds: (tokenId) => userContract['getLoansIds'](tokenId),
            updateLoanState: (tokenId, deadline, state) =>
              userContract['updateLoanState'](tokenId, deadline, state),
            getLoanDetails: (tokenId, loanId) =>
              getLoanDetails(userContract, tokenId, loanId),
            getAllLoansByTokenId: (tokenId) =>
              getAllLoansByTokenId(userContract, tokenId),
            getPendingLoans: () => getPendingLoans(userContract),
            cancelLoan: (tokenId: bigint, loanId: bigint) =>
              cancelLoan(userContract, tokenId, loanId),
          },
        };

        return {
          success: true,
          value: Web3Handler.instance,
        };
      }
    } catch {
      return {
        success: false,
        error: Web3Error.ConnectionRefused,
      };
    }
  }

  return {
    success: false,
    error: Web3Error.NotInstalled,
  };
}

async function disconnectWallet(): Promise<Web3Result<null>> {
  if (connected()) {
    Web3Handler.instance = undefined;
    return {
      success: true,
      value: null,
    };
  }

  return {
    success: false,
    error: Web3Error.DisconnectionRefused,
  };
}

async function addToWallet(id: bigint): Promise<Web3Result<null>> {
  try {
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC721',
        options: {
          address: CONTRACT_ADDRESS, // The address that the token is at.
          id,
        },
      },
    });

    if (wasAdded) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        error: Web3Error.TokenAlreadyAdded,
      };
    }
  } catch (error) {
    throw error;
  }
}

async function changeNetwork(network: NetworkInfo): Promise<Web3Result<null>> {
  if (window.ethereum) {
    try {
      // check if the chain to connect to is installed
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: network.chainId }], // chainId must be in hexadecimal numbers
      });

      return {
        success: true,
      };
    } catch (error) {
      try {
        // If no supported network is available, add the default project chain to the metamask wallet
        await addNetwork(network);

        // check if the chain to connect to is installed
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: network.chainId }], // chainId must be in hexadecimal numbers
        });

        return {
          success: true,
        };
      } catch (error) {
        // If the network could not be added, return error
        return {
          success: false,
          error: Web3Error.NetworkAddRefused,
        };
      }
    }
  }

  return {
    success: false,
    error: Web3Error.NotInstalled,
  };
}

async function addNetwork(
  network: NetworkInfo
): Promise<Web3Result<NetworkInfo>> {
  try {
    // Connect to the new network
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{ ...network }],
    });

    return {
      success: true,
      value: network,
    };
  } catch (addError) {
    // console.error(addError)
    return {
      success: false,
      error: Web3Error.NetworkAddRefused,
    };
  }
}

async function mintAccessKey(): Promise<Web3Result<[string, bigint]>> {
  if (Web3Handler.connected()) {
    try {
      const tokenId = await Web3Handler.instance.userContract.getNextId();
      console.log(tokenId);
      const tx = await Web3Handler.instance.userContract.safeMintAccessToken(
        Web3Handler.instance.signer.address
      );
      const _ = await tx.wait();

      Web3Handler.instance.id = tokenId;
      // Web3Handler.instance.isManager = isManager

      return {
        success: true,
        value: [CONTRACT_ADDRESS, tokenId],
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: Web3Error.MintFailed,
      };
    }
  }

  return {
    success: false,
    error: Web3Error.MintFailed,
  };
}

async function getAccount() {
  try {
    const keyPassCount = await Web3Handler.instance.userContract.balanceOf(
      Web3Handler.instance.signer.address
    );

    const address = Web3Handler.instance.signer.address;
    const keypassQueries = numArray(0n, keyPassCount).map((x) =>
      Web3Handler.instance.userContract.tokenOfOwnerByIndex(address, x)
    );
    const keypassIds = await Promise.all(keypassQueries);

    return keypassIds[0];
  } catch {
    return -1n;
  }
}

async function requestLoan(
  contract: Contract,
  tokenId: bigint,
  loanId: bigint,
  deadline: bigint,
  details: bigint[][]
): Promise<LoanResponse | undefined> {
  let tx = await contract['requestLoan'](tokenId, loanId, deadline, details);
  await tx.wait();

  let loanIds: { [key: number]: bigint } =
    await Web3Handler.instance.userContract.getLoanIds(tokenId);
  return await Web3Handler.instance.userContract.getLoanDetails(
    tokenId,
    loanIds[Object.keys(loanIds).length - 1]
  );
}

async function getAllLoansByTokenId(
  contract: Contract,
  tokenId: bigint
): Promise<LoanResponse[]> {
  let result: any[] = await contract['getAllLoansByTokenId'](tokenId);
  return result
    .map((x) => {
      return {
        id: x[0],
        state: Number(x[1]) as LoanState,
        deadline: x[2],
        details: Object.values(x[3]).map((x) => {
          return { id: x[0], quantity: x[1] };
        }),
      };
    })
    .filter((x) => x.id != 0n);
}

async function getPendingLoans(contract: Contract): Promise<LoanResponse[]> {
  let ids: bigint = await contract['getNextId']();
  let result: LoanResponse[] = [];

  for (var tokenId of numArray(1n, ids)) {
    let loanIds: bigint[] = await contract['getLoansIds'](tokenId);

    if (loanIds.length > 0) {
      for (var loanId of loanIds) {
        result.push(
          await getLoanDetails(contract, tokenId, loanId).then((x) => {
            return { ...x, tokenId };
          })
        );
      }
    }
  }

  return result.filter((x) => x.id != 0n && x.state == LoanState.Pending);
}

async function getLoanDetails(
  contract: Contract,
  tokenId: bigint,
  loanId: bigint
): Promise<LoanResponse> {
  let result: any[] = await contract['getLoanDetails'](tokenId, loanId);
  return {
    id: result[0],
    state: Number(result[1]) as LoanState,
    deadline: result[2],
    details: Object.values(result[3]).map((x) => {
      return { id: x[0], quantity: x[1] };
    }),
  };
}

async function cancelLoan(
  contract: Contract,
  tokenId: bigint,
  loanId: bigint
): Promise<boolean> {
  let tx = await contract['cancelLoan'](tokenId, loanId);
  let result = await tx.wait();

  return result.hash != undefined;
}
