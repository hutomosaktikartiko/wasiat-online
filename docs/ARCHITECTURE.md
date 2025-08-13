# System Architecture

Complete documentation of the Online Wills system architecture describing the main components, workflows, and interactions between systems.

## System Architecture Diagram

```mermaid
graph TB
    subgraph "Frontend Layer"
    WebApp["🌐 Web dApp<br/>(React/Vite)"]
    end

    subgraph "Blockchain Layer - Solana"
        Program["📜 Smart Contract<br/>(Rust Program)"]
        Vault["🏦 PDA Vault<br/>(Asset Storage)"]
        FeeVault["💰 Fee Vault<br/>(Service Fees)"]
    end

    subgraph "Off-chain Services"
        Keeper["🔄 Keeper Service<br/>(Monitor & Trigger)"]
    end

    subgraph "Users"
        Testator["👤 Pewasiat<br/>(Asset Owner)"]
        Beneficiary["👥 Penerima Manfaat<br/>(Heir)"]
    end

    subgraph "Assets"
        SOL["💎 SOL"]
        SPL["🪙 SPL Tokens"]
        NFT["🖼️ NFTs"]
    end

    %% User interactions
    Testator --> WebApp
    Beneficiary --> WebApp

    %% Frontend to blockchain
    WebApp --> Program

    %% Program interactions
    Program --> Vault
    Program --> FeeVault

    %% Asset flows
    SOL --> Vault
    SPL --> Vault
    NFT --> Vault

    %% Keeper monitoring
    Keeper --> Program

    %% Labels for key functions
    Program -.->|"Create Will<br/>Heartbeat<br/>Trigger<br/>Claim"| Program
```

## Architecture Overview

The system consists of 3 main layers:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React dApp    │────│   Go Backend     │────│  Solana Program │
│  - UI/UX        │    │  - REST API      │    │  - Smart Logic  │
│  - Wallet       │    │  - Keeper Service│    │  - Asset Storage│
└─────────────────┘    │  - SQLite DB     │    └─────────────────┘
                       └──────────────────┘
```

- **Frontend**: Interface for testators and beneficiaries
- **Backend**: API layer + monitoring service for automatic triggers
- **Blockchain**: Core logic + decentralized asset storage

## Workflow Diagram

```mermaid
flowchart TD
    Start([👤 Start Will]) --> CreateWill[📝 Create Will Contract]
    CreateWill --> SetBeneficiary[👥 Specify Beneficiary]
    SetBeneficiary --> SetHeartbeat[⏰ Set Heartbeat Timer<br/>e.g., 90 days]
    SetHeartbeat --> DepositAssets[💰 Deposit Assets to Vault<br/>SOL/SPL/NFT]

    DepositAssets --> ActiveWill{📋 Active Will}
    ActiveWill --> Heartbeat[💓 Send Heartbeat]
    Heartbeat --> ResetTimer[🔄 Reset Timer to 90 days]
    ResetTimer --> ActiveWill

    ActiveWill --> TimerExpired{⏳ Timer Expired?<br/>90 days without heartbeat}
    TimerExpired -->|No| ActiveWill
    TimerExpired -->|Yes| KeeperTrigger[🤖 Keeper Detects<br/>& Triggers Wills]

    KeeperTrigger --> TriggeredState[🚨 Status: TRIGGERED]
    TriggeredState --> BeneficiaryNotified[📢 Beneficiaries<br/>Can Claim]

    BeneficiaryNotified --> ClaimAssets[🎯 Claim Assets]
    ClaimAssets --> VerifyIdentity[✅ Verify the Identity<br/>of the Beneficiary]
    VerifyIdentity --> DeductFee[💸 Deduct Service Fee]
    DeductFee --> TransferAssets[📤 ]
    TransferAssets --> Complete([✅ Completed])

    %% Withdrawal path
    ActiveWill --> Withdraw[💼 Will Withdraw Assets]
    Withdraw --> VerifyTestator[🔐 Verify Will]
    VerifyTestator --> ReturnAssets[📥 Return Assets]
    ReturnAssets --> WillCancelled([❌ Will Cancelled])

    style Start fill:#e1f5fe
    style Complete fill:#e8f5e8
    style WillCancelled fill:#ffebee
    style TriggeredState fill:#fff3e0
    style ActiveWill fill:#f3e5f5
```

## State Machine

```mermaid
stateDiagram-v2
    [*] --> Created: Create a Will<br/>create_will()

    Created --> Active: Deposit Assets<br/>deposit_assets()

    Active --> Active: Heartbeat<br/>send_heartbeat()

    Active --> Triggered: Timer Expires<br/>keeper_trigger()

    Active --> Withdrawn: Testator Withdraws<br/>withdraw_assets()

    Triggered --> Claimed: Beneficiary Claims<br/>claim_assets()

    Withdrawn --> [*]: Will Expires
    Claimed --> [*]: Will Expires

    note right of Created
        Will has been created
        No assets yet
    end note

    note right of Active
        Assets are stored in the vault
        Heartbeat timer is active
        Testator receives a heartbeat
    end note

    note right of Triggered
        Heartbeat timer expires
        Beneficiary can claim
        Assets are locked for the testator
    end note

    note right of Claimed
        Assets have been Claimed
        Service fee deducted
        Will completed
    end note

    note right of Withdrawn
        Testator withdraws assets
        Will revoked
    end note
```

## Sequence Diagram

```mermaid
sequenceDiagram
    participant T as 👤 Testator
    participant W as 🌐 Web dApp
    participant P as 📜 Smart Contract
    participant V as 🏦 Vault
    participant K as 🤖 Keeper
    participant B as 👥 Beneficiary
    participant F as 💰 Fee Vault

    Note over T,F: 1. Creating a Will
    T->>W: Open the application
    T->>W: Enter will data (beneficiary, heartbeat period)
    W->>P: create_will()
    P->>V: Create PDA Vault
    P->>W: Will ID & Vault Address
    W->>T: Confirm will creation

    Note over T,F: 2. Asset Funding
    T->>W: Deposit assets (SOL/SPL/NFT)
    W->>P: deposit_assets()
    P->>V: Transfer assets to vault
    P-->>W: Confirm deposit
    W-->>T: Deposited assets

    Note over T,F: 3. Heartbeat Activity
    Loop Every < 90 days
    T->>W: Click the heartbeat button
    W->>P: send_heartbeat()
    P->>P: Reset timer
    P-->>W: Timer reset
    W-->>T: Heartbeat successful
    end

    Note over T,F: 4. Automatic Trigger
    K->>P: Check all wills
    K->>P: heartbeat_expired?
    P-->>K: Yes, timer expired
    K->>P: trigger_will()
    P->>P: Set status = TRIGGERED
    P-->>K: Status changed

    Note over T,F: 5. Claim Assets
    B->>W: Check will status
    W->>P: get_will_status()
    P-->>W: Status: TRIGGERED
    W-->>B: Claim assets
    B->>W: Click claim assets
    W->>P: claim_assets()
    P->>V: Retrieve all assets
    P->>F: Transfer service fee
    V->>B: Transfer assets to beneficiary
    P-->>W: Claim successful
    W-->>B: Assets received
```

## Component Details

### Frontend Layer

- **React dApp**: User interface built with React Router v7
- **Wallet Integration**: Supports major Solana wallets (Phantom, Solflare, etc.)
- **Responsive Design**: Works on desktop and mobile devices

### Backend Layer

- **Go REST API**: High-performance API server
- **Keeper Service**: Automated monitoring and triggering
- **SQLite Database**: Lightweight database for off-chain data

### Blockchain Layer

- **Anchor Program**: Smart contract written in Rust
- **PDA Vaults**: Program Derived Addresses for secure asset storage
- **Fee Collection**: Automated service fee deduction

## Security Considerations

1. **Private Key Control**: Users maintain full control of their private keys
2. **Smart Contract Logic**: All critical logic executed on-chain
3. **PDA Security**: Assets secured by program-controlled accounts
4. **Keeper Redundancy**: Multiple keeper instances for reliability
5. **Emergency Pause**: Admin ability to pause system in emergencies

## Scalability

- **Solana Performance**: High throughput, low latency blockchain
- **Efficient Storage**: Optimized account structures (~200 bytes per will)
- **Keeper Optimization**: Efficient batch processing of triggers
- **Database Indexing**: Optimized queries for fast response times
