# Firestore Rules — Community Architect Assignments

> **Context:** This collection is part of the Community Architect System v1.
> Rules should be added to the shared Firebase project's `firestore.rules` file.
> Do NOT deploy from the website repo — manage at the Firebase project level.

---

## Collection

```
communityArchitectAssignments/{assignmentId}
```

## Required Rules

Add the following block inside your existing `service cloud.firestore { match /databases/{database}/documents { ... } }`:

```security-rules
// --- Community Architect Assignments ---
match /communityArchitectAssignments/{assignmentId} {
  // Read: only admins
  // Public reads go through server-side API route (/api/community-architects)
  // which uses Admin SDK and strips sensitive fields (notesInternal, etc.)
  allow read: if request.auth != null 
                && request.auth.token.admin == true;
  
  // Write: only admins
  allow create, update, delete: if request.auth != null 
                                   && request.auth.token.admin == true;
}
```

> **Why admin-only reads?** All public-facing data flows through the server-side API at
> `/api/community-architects` which uses Firebase Admin SDK. This ensures `notesInternal`,
> `blockReason`, `blockedAt`, `blockedBy`, and `assignedBy` never reach the client browser.
> Direct Firestore client reads are only used in the admin management pages.

## Composite Indexes

The server-side API uses Admin SDK queries that may require composite indexes.
Firestore will auto-prompt when first run.

**Index 1 — Public directory:**
- **Collection:** `communityArchitectAssignments`
- **Fields:** `isActive` (asc) + `isBlocked` (asc)
- **Scope:** Collection

**Index 2 — Profile integration (userId filter):**
- **Collection:** `communityArchitectAssignments`
- **Fields:** `userId` (asc) + `isActive` (asc) + `isBlocked` (asc)
- **Scope:** Collection

## Security Architecture

```
Public page / Profile page
  → fetch('/api/community-architects')
    → Server-side Admin SDK query
      → sanitizeAssignment() strips: notesInternal, assignedBy, blockedAt, blockedBy, blockReason, isBlocked
        → Returns only PUBLIC_SAFE_FIELDS to client

Admin pages
  → Direct Firestore client SDK
    → Protected by Firestore rules (admin claim required)
    → Full document access including notesInternal
```

## Cross-Repo Impact

- This collection is **website-only** in v1
- No app repo currently reads from `communityArchitectAssignments`
- The shared `users/{uid}` documents are NOT modified — user data is read-only
- If future app integration is needed, these rules extend cleanly
