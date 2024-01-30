# Project Information
This project represents an ambitious fusion of Web3 technology with a traditional loan management system, conceptualised as part of a school project to enhance its security and transparency. At its core, the system leverages blockchain technology, with a particular focus on the Ethereum network and the use of MetaMask as a wallet and authentication tool.

Users interact with the system via a user-friendly interface that allows them to request new loans, monitor their status, and cancel any pending loans. This cancellation feature, while not affecting the blockchain record, enhances user flexibility within the system's UI. The integration of MetaMask facilitates not only user authentication but also the seamless processing of loan payments, leveraging the inherent security and transparency of blockchain transactions.

On the administrative side, the system assigns roles based on NFTs, with the first NFT minted during the smart contract's deployment signifying the administrator. This NFT-based role assignment ensures a robust and tamper-proof method for admin identification and authorisation. Admins possess the authority to approve or reject user loan requests, adding a layer of oversight to the process.

Each user is uniquely identified by an associated NFT and its ID, alongside their MetaMask wallet address. This dual-identification system enhances security and aids in preventing fraudulent activities. The use of NFTs as access cards for different user roles is a novel approach, showcasing the versatility of NFTs beyond mere digital collectibles.

One of the most significant advantages of this system is the immutable record-keeping provided by the blockchain. While traditional loan systems rely on centralised databases susceptible to breaches and tampering, this blockchain-based solution ensures that every transaction and administrative action is permanently recorded and publicly verifiable, thereby increasing trust and transparency.

However, integrating blockchain into a loan system also presents unique challenges. The immutable nature of blockchain transactions means that once a loan is recorded, it cannot be altered or deleted. To address this, the system incorporates a feature that 'hides' a loan from the user interface without affecting the blockchain record, maintaining the integrity of the ledger while providing user flexibility.

Furthermore, the reliance on Ethereum and smart contracts necessitates careful consideration of gas fees and network congestion, aspects critical to the system's efficiency and user experience. Recognising these challenges, the project initially utilises the Goerli testnet, an Ethereum test network, for development and testing purposes. This approach allows for experimenting with smart contract functionalities and user interactions without the financial implications of the Ethereum mainnet, thus enabling a more agile and cost-effective development process.

Using the Goerli testnet also provides valuable insights into handling real-world issues such as network congestion and gas fees in a controlled environment. This experience is vital for preparing the system for eventual deployment on the Ethereum mainnet, where such factors play a significant role in the overall user experience.

The project's future developments could further explore layer 2 solutions or alternative blockchains to mitigate these issues. Layer 2 solutions, such as rollups or state channels, offer scalability benefits and reduced transaction costs, which could significantly enhance the system's performance. Alternatively, considering other blockchains that offer lower transaction fees and faster processing times could be a viable strategy, especially in a scenario where Ethereum's gas fees and congestion become prohibitive.



# PRE-SETUP

Step 1: Install Metamask (https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)

Step 2: Make 2 accounts with Metamask (src\assets\readme\addAccountMM.png)

Step 3: Get GoerliETH on 'https://goerli-faucet.pk910.de/' (add money to both accounts)

Step 4: Add 'Sign in Anonymously' to Firebase's Authentication

# RUNNING THE FILE - ADMIN

Step 5: Run 'npm i' or manually install the necessary packages

Step 6: Add this line to your package.json, below "start" under "scripts": ```"compile": "npx ts-node --project tsconfig.json src/scripts/compile.ts && copyfiles --flat src/contracts/abi/*.json src/web3/abi",```

Step 7: Run Ionic Serve

Step 8: Deploy the Smart Contract using the 'Deploy' button (Open up the 'Inspect Element' - 'Console')

Step 9: Copy the contract address you see in the console (Looks like 'Deployed to 0x78...2D385)

Step 10: Paste that contract address inside const.ts, inside the variable 'CONTRACT_ADDRESS' (src\web3\const.ts)

Step 11: Click the 'Connect Wallet' to login using the Admin Account - You should be logged in after this

Step 12: Disconnect via Metamask to fully logout (```https://www.youtube.com/watch?v=RL7LV5Tlc5c```, you can also click the 'Globe' icon to remove the connection to the current site - ```src\assets\readme\disconnectWallet.png```)

# RUNNING THE FILE - USER

Step 13: Login using the User account (Admin must be registered first before this)

Step 14: Click 'Get Access' when a pop up is shown

Step 15: You should be logged in now


# VIEWING THE NFT INSIDE THE WALLET
If you want to view the NFT (Access Card) that you have minted, simply open up your Metamask, and under 'NFTs', scroll down and click 'Import NFT' ```(src\assets\readme\importNFT.png)```. 

To add your NFT, simply key in the Contract Address that is inside the const.ts, with the ID of 1 (Admin account), and 2 (User account) - ```(src\assets\readme\nftImported.png)```.

### DISCLAIMER 1: User account's NFTs are ids 2 and above if you have created more than 1 User account. Each deployment of smart contract results in 1 Admin account, which is representative of the first NFT (Access Card) that is created.

### DISCLAIMER 2: IF FOR SOME REASON THE CODE PREVENTS YOU FROM LOGGING IN, SIMPLY REFRESH THE PAGE AS THIS IS DUE TO SOME TECHNICAL DIFFICULTIES WHEN CHANGING ACCOUNTS AND/OR DISCONNECTING ACCOUNTS

## Contact
Email: gabrieljohn.liew@gmail.com

Github: https://github.com/gabriel0139/Web3-Loan-System.git