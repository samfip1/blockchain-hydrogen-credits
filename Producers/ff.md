# Green Hydrogen Subsidy Disbursement Platform

## Problem
Government subsidies for green hydrogen face issues:  
- Delays in payout  
- Fraud/duplicate claims  
- Lack of transparency  

---

## Our Idea
A blockchain-based system with smart contracts + backend API to make subsidy disbursement:  
- **Fast**: Automated payouts after verification  
- **Fair**: Only eligible projects funded  
- **Transparent**: On-chain audit trail  

---

## How It Works
1. Govt sets subsidy rules (per kg of hydrogen).  
2. Producers register plants and submit claims.  
3. Auditor validates data (stored on IPFS).  
4. Smart contract calculates subsidy.  
5. Govt triggers payout.  
6. Every step is recorded on blockchain.  

---

## Features
- Automatic subsidy calculation & transfer  
- Auditor validation to prevent fraud  
- Government pause/emergency controls  
- Complete on-chain audit trail  
- Batch disbursement support  

---

## Backend API (Producers)
Built with **Node.js, Express, TypeScript, Prisma, PostgreSQL**.  
Handles authentication, plant registration, and claims.

### Endpoints (all prefixed with `/p`)
- **POST /signup** – Create company, plant & bank account  
- **POST /signin** – Authenticate (JWT in HTTP-only cookie)  
- **POST /logout** – Clear session  
- **GET /profile** – Company details (auth required)  
- **POST /plants** – Add new plant (auth required)  

---

## Tech Stack
- **Backend**: Node.js, Express, TypeScript, Prisma  
- **Database**: PostgreSQL  
- **Auth**: JWT, bcryptjs  
- **Smart Contracts**: Solidity (Remix IDE for prototype)  
- **Storage**: IPFS for auditor reports  

---

## Demo Flow
Producer submits claim → Auditor verifies → Smart contract checks rules → Govt disburses subsidy → Producer receives payout  

---

## Next Steps
- Connect with UPI/DBT/PFMS for real payouts  
- Add simple web interface for producers & auditors  
- Extendable to other subsidies (Solar, EV, Wind)  

---

Built at **HackOut’25 – DA-IICT**
