# ETHGlobal Trifecta 2025

#### Run Tests
```bash
forge test --fork-url https://base-rpc.publicnode.com -vv
```

#### Deploy Locally
```bash
anvil --fork-url https://base-rpc.publicnode.com --code-size-limit 100000
forge create src/AppAttestCertManager.sol:AppAttestCertManager --private-key <anvil 0 private key> --broadcast
```
