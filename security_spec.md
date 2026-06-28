# Security Specification

## Data Invariants
- A link cannot exist without a valid user ID that belongs to the current authenticated user.
- All stored fields (title, url, order, color, category) must adhere to strict type and length bounds.

## The "Dirty Dozen" Payloads (Unauthorized or Invalid Write Scenarios)
1. Creating a link with another user's `userId`.
2. Updating an existing link's `userId` to a different user ID.
3. Creating a link without an authenticated session.
4. Reading a link belonging to another user.
5. Updating a link belonging to another user.
6. Deleting a link belonging to another user.
7. Creating a link with an excessively long title (> 100 chars).
8. Creating a link with an excessively long url (> 1024 chars).
9. Creating a link with a non-integer `order`.
10. Creating a link with unexpected properties ("Ghost Field" exploit).
11. Attempting blanket read query on all links without a userId filter.
12. Attempting a read/write when email is not verified (if strict verification is enforced, but for demo Google Login we check base auth).

## The Test Runner
A test runner config can be simulated using local unit tests or standard Firestore emulator setup.
