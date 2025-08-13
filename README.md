# Wasiat Online — On‑chain Crypto Inheritance Vault

_Disclaimer: This product automates the transfer of crypto asset inheritance and is not a legal document/service._

## About This Project

**Creating a new, secure, transparent, and automated standard for digital asset inheritance on the blockchain, ensuring no more crypto assets are lost forever due to tragedy.**

## Benefits

- **Secure**: Users retain full control of their private keys; assets are secured by smart contract logic.
- **Automatic**: Asset transfers occur automatically based on predefined rules, eliminating the need for expensive intermediaries and lengthy legal processes.
- **Efficient & Affordable**: Built on Solana, transaction costs for creating and managing wills are extremely low and the process is nearly instantaneous.

## Users

- **The Testator**: Asset owners who will use our app to create wills, set trigger rules ("heartbeats"), and deposit their assets into a secure vault.

- **The Beneficiary**: The party appointed by the Will, who will use our application to verify the will status and claim assets once the trigger conditions are met.

## Workflow

- **Creation**: The testator creates a "Will Contract" through our app, designates a Beneficiary, and specifies a "heartbeat timer" duration (e.g., 90 days).
- **Funding**: The testator transfers digital assets (SOL, tokens, or NFTs) into the on-chain vault associated with their will contract.
- **Activity ("Heartbeat")**: The testator periodically presses a button in the app to send a "heartbeat" transaction, which proves they are still active and resets the timer to 90 days.
- **Trigger**: If the testator does not send a "heartbeat" within 90 days, an automated service (called a "keeper") detects this and calls a function to change the contract status to "Triggered".
- **Asset Claim**: The beneficiary, after seeing that the will status has been "Triggered", can press the "Claim Asset" button. The smart contract will automatically verify their identity and transfer all assets from the vault to the Beneficiary's wallet.

## Key Components

- **Web Application (dApp)**: A simple and intuitive user interface for the Will and the Beneficiary.
- **On-Chain Program (Smart Contract)**: The brain of the service, written in Rust and deployed on Solana. This program will manage all logic, will status, and access rights.
- **Asset Vault (PDA Vault)**: A dedicated on-chain account (Program Derived Address) for each will, which serves as a vault for securely storing assets.
- **Keeper Service (Off-chain)**: An automated script running on the server to monitor all will contracts and invoke a trigger function when a heartbeat timer expires.

## Protocol POC Requirements

- The protocol must provide functionality for a user ("Testamenter") to create an on-chain Will Contract.
- The protocol must allow the Testator to designate another Solana address as a "Beneficiary."
- The protocol must allow the Testator to deposit various types of assets into the testamentary vault, including SOL, SPL Tokens, and NFTs.
- The protocol must allow the Testator to set a "heartbeat" time period (e.g., 90 days) as a trigger condition.
- The protocol must provide a "heartbeat" function that the Testator can call to verify activity and reset the trigger time period.
- The protocol must have a "Triggered" status that activates when the heartbeat period has elapsed.
- The protocol must allow the authorized Beneficiary to claim all assets from a "Triggered" will.
- The protocol must charge a small service fee (percentage to be determined later) upon successful asset claim.
- The protocol must have a separate vault to store accumulated service fees.
- The protocol must ensure that only the testator can change the will details or withdraw assets, as long as the will has not been "Triggered."

## Roadmap

- **MVP**: Single beneficiary, heartbeat + trigger + claim.
- **V2**: Permissionless trigger bounty, multi-beneficiary with percentage, notification reminder.
- **v3**: Guardian/multisig heartbeat, audit + program upgrade lock, configurable fee feature.

## Tech Stack

- **Smart Contract**: Anchor Framework (Rust)
- **Backend**: Go with SQLite
- **Frontend**: React Router v7
- **Deployment**: Cloudflare (Frontend), VPS 2GB (Backend)
- **Blockchain**: Solana

## Documentation

📚 **Detailed Documentation:**

- [🏗️ System Architecture](docs/ARCHITECTURE.md) - Diagrams and system architecture
- [🗄️ Database Schema](docs/DATABASE_SCHEMA.md) - On-chain and off-chain data structures
- [🛣️ Development Roadmap](docs/ROADMAP.md) - Planning and milestones

## Quick Start

### Prerequisites

- Node.js 18+
- Rust 1.70+
- Solana CLI
- Anchor CLI
- Go 1.21+

### Installation

```bash
# Clone repository
git clone <repository-url>
cd wasiat-online

# Install frontend dependencies
pnpm install

# Install Anchor dependencies
cd anchor && pnpm install

# Build Solana program
anchor build

# Run development
pnpm run dev
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**🚨 Important Notice**: This is experimental software for educational purposes. Always conduct thorough testing before using with real assets.
