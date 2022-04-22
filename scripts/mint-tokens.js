const abi = `[
{
    "inputs": [
        {"internalType": "uint256","name": "tokenId","type": "uint256"},
        {"internalType": "string","name": "seed","type": "string"},
        {"internalType": "string","name": "water","type": "string"},
        {"internalType": "string","name": "forest","type": "string"},
        {"internalType": "string", "name": "aridity", "type": "string"}
    ],
    "name": "generatePlanet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
        {"internalType": "address", "name": "owner", "type": "address"}
    ],
    "name": "balanceOf",
    "outputs": [
        {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
}
]`

const contractAddress = '0x4153119c8A07eBcE59a15002eEf73c41aD9c8EAd'; // Matic
const mmprovider = new ethers.providers.Web3Provider(window.ethereum);
const mmsigner = mmprovider.getSigner();
const mmcontract = new ethers.Contract(contractAddress, abi, mmsigner);
[...Array(422).keys()].forEach(async (i) => {
    let txn = await mmcontract.generatePlanet(i,md[i].seed, md[i].water, md[i].forest, md[i].aridity);
    txn.wait().then(console.log(i,"done"));
});
