# Digital Tenancy Verification Network (DTVN)
### National Agricultural Digital Public Infrastructure (AgriStack / DCS Layer)

DTVN transforms informal agricultural land tenancy into legally robust, tamper-proof, and bankable digital records anchored on the Polygon blockchain ledger.

---

## 🏛️ Key Features

- **State-Agnostic Title Binding:** Cross-references cadastral land records (**7/12, RoR, Khasra, Patta, Jamabandi**).
- **Identity-to-Title Gate:** Multi-factor Aadhaar-seeded identity checks protect landowners from fraudulent claims.
- **Statutory Non-Alienation Notice:** Explicit legal safeguards ensuring tenancy registration does not confer adverse possession or land purchase rights.
- **PostGIS Geospatial Validation:** Point-in-polygon verification (`ST_Within`) ensuring field GPS pins fall within official cadastral parcel boundaries.
- **Zero-PII Cryptographic Anchoring:** Salted SHA-256 hash anchoring on Polygon Amoy testnet.
- **Digital Cultivation Credential (DCC):** Bank-grade verifiable instrument for crop insurance (PMFBY), Kisan Credit Card (KCC), and subsidy distribution.

---

## 🚀 Quick Start Guide

### 1. Clone Repository & Install Dependencies
```bash
git clone <your-repo-url>
cd "SIH PROTOTYPE"
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your connection details in `.env.local`:
```env
# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dtvn?retryWrites=true&w=majority

# JWT secret for authentication sessions
JWT_SECRET=dtvn-prototype-jwt-secret-change-me

# Polygon Amoy Testnet RPC & Private Key
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology/
POLYGON_PRIVATE_KEY=your-funded-wallet-private-key-here
NEXT_PUBLIC_POLYGON_RPC_URL=https://rpc-amoy.polygon.technology/
```
*(Note: If `POLYGON_PRIVATE_KEY` is omitted, the platform automatically utilizes deterministic simulation hashes for instant evaluation).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Evaluator Run Sequence (SIH Demo)

1. **Initialize Registry:** Click **"🌱 Initialize Demonstration Records"** at the bottom of the landing page.
2. **Cultivator Flow (Ramesh Kumar):**
   - Login as Tenant (`9988776655`, OTP: `123456`).
   - Initiate Verification for **Gat 142/A**, Owner Phone: `9876543210`.
   - Drop GPS geotag pin on the map and submit. Note the generated **DTVN-ID**.
3. **Landowner Flow (Suresh Patil):**
   - Login as Landowner (`9876543210`, OTP: `123456`).
   - Open Review Desk → Identity-to-title check passes.
   - Click **"✓ Grant e-Consent"**.
4. **Revenue Officer Adjudication (Officer Vijay Kadam):**
   - Login as Official (`9000000001`, OTP: `123456`).
   - Open **Verification Queue** → Open Spatial Workbench.
   - Observe PostGIS `ST_Within` green indicator.
   - Click **"🛡️ Verify Deed & Anchor to Blockchain Ledger"**.
5. **Public Audit:**
   - Go to `/verify`, paste the DTVN ID or Transaction Hash, and inspect the verified **Digital Cultivation Credential (DCC)**.
