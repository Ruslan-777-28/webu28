# Firestore Security Rules Governance

## Single Source of Truth
This repository (**LECTOR Website**) is the **Master Source of Truth** for the Firestore security rules of the shared project backend.

### Project Context
- **Firebase Project**: `studio-4179220113-a674c`
- **Shared Backend**: LECTOR (Website) and ConnectU (App) share the same underlying Firestore database.

---

## Access Tier Model

We maintain a strict access tier model to ensure both public discovery and private product safety:

| Tier | Purpose | Requirement | Typical Collections |
| :--- | :--- | :--- | :--- |
| **Public CMS** | Discoverability & Trust | **Always Readable (Guest)** | `siteSettings`, `sitePages`, `faqItems`, `blogSettings` |
| **Public Content** | SEO & Blog | **Always Readable (Guest)** | `posts`, `categories`, `authors` |
| **User Profiles** | Expert Directory | **Public Get / Auth List** | `users` |
| **Private Product** | Communication/Runtime | **Auth Participant Only** | `calls`, `sessions`, `messages`, `communicationRequests` |
| **Financial** | Ledger & Security | **Auth Owner Only** | `walletLedger`, `walletHolds` |

---

## Cross-Repo Anti-Drift Workflow

To prevent "rules drift" where one repository overwrites the other's required permissions:

### 1. Mandatory Deployment Path
- **Rules MUST be deployed exclusively from this LECTOR repository.**
- Rules deployment should be **DISABLED** in the App (ConnectU) repository's CI/CD pipeline.

### 2. Standard Deployment Sequence
1. **Develop**: Create a new rule block in `firestore.rules`.
2. **Review**: Ensure the new rule does not conflict with existing tiers (especially public access).
3. **Deploy**: Run `firebase deploy --only firestore:rules` from this repository.
4. **Sync**: Copy the updated `firestore.rules` to the App repository as a **reference-only** file.

### 3. Change Requests
If a feature in the App repo requires a rule change:
- Open a Pull Request in the **Website (LECTOR)** repository.
- Reference the specific APP feature or Jira/Task ID.
- Once merged and deployed, pull the changes into the APP repo's reference file.

---

## Critical Warnings

> [!CAUTION]
> **NEVER deploy Firestore rules from the APP repository.** 
> Recent history shows that App-repo deployments often overlook the specific public read rules required for the Website's CMS (e.g., Hero Media, FAQ). This causes immediate site-wide rendering failures for guests.

> [!IMPORTANT]
> Always verify guest access to `/`, `/pro`, and `/user` immediately after any rules deployment. Use the browser's incognito mode or the local browser tool to check for `Insufficient Permissions` errors in the console.

---

## Collection Manifest (Master List)

| Collection | Owner | Visibility | Notes |
| :--- | :--- | :--- | :--- |
| `siteSettings` | Website | Public | Metadata for Hero, Footer, etc. |
| `sitePages` | Website | Public | CMS content for landing pages. |
| `faqItems` | Website | Public | Global FAQ database. |
| `calls` | App | Private | Real-time call metadata. |
| `walletLedger`| App | Private | Protected financial data. |
