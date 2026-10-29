# Blue Ember Property Recovery — Website + Admin Demo

This repository is a fictional, self-contained portfolio demonstration. Blue Ember Property Recovery is not an operating business.

## What the owner can see

### Public website
- Navy / orange fictional Blue Ember concept
- 24/7 emergency-response positioning
- Restoration service cards
- Strong emergency and contact calls-to-action
- Customer request form
- Service / urgency / address / contact information capture
- Direct link to the Admin Access demo

### Admin access
- Dedicated admin login screen
- Dashboard metrics
- Customer request list
- Search
- Status filtering
- Urgency filtering
- Customer contact details
- Service requested
- Customer message
- Follow-up status
- Internal notes
- Sample leads preloaded for presentation

## Demo login

**Email:** `admin@blueember.example`
**Password:** `BlueEmber-Demo-2026`

## Best way to present it

1. Open the public website.
2. Scroll to **Request Contact**.
3. Submit yourself as a sample customer.
4. Click **Open Admin Access**.
5. Sign in with the demo credentials.
6. Show the customer request.
7. Change its status from **New** to **Contacted** or **Scheduled**.
8. Add an internal note and save.

That demonstrates:

**Website → Customer Request → Admin Dashboard → Follow-up → Internal Operations**

## Important demo note

This is a static demonstration. It uses browser storage instead of a production backend.

Do **not** enter real customer data.

A production version should use:
- secure backend/database;
- server-side authentication;
- password hashing or SSO;
- role-based permissions;
- audit logs;
- backups;
- privacy and consent controls;
- secure file uploads;
- existing-system integrations.

## Repository structure

```text
blue-ember-recovery-demo/
├── index.html
├── admin.html
├── README.md
├── PRICING.md
├── PRODUCTION-ROADMAP.md
└── assets/
    ├── styles.css
    ├── admin.css
    ├── app.js
    ├── admin.js
    └── blue-ember-hero.png
```

## GitHub Pages

Upload the entire repository to GitHub.

Then:

**Settings → Pages → Deploy from branch → main → /(root)**

You can then send the GitHub Pages URL directly to the owner.


## Expanded admin operations demo

The admin area now includes three sections:

### Dashboard
- Customer Requests on the left
- Confirmed-visit calendar on the right
- Upcoming visits list
- Assign employee
- Set visit date/time
- Scheduled requests automatically appear on the calendar

### Employees
- Employee roster
- Role and contact information
- Each employee's confirmed scheduled visits

### Management
- Manually add customer details
- Useful for phone calls, referrals, walk-ins or internal job creation
- New manually entered customers appear in the Requests list

When a request is assigned to an employee and given a visit date/time, saving the request automatically marks it as **Scheduled** and places it on the central calendar.


## Login reliability fix

`admin.html` now embeds the admin JavaScript directly in the page. This prevents the Sign In button from becoming inactive when a browser or hosting setup fails to load `assets/admin.js`.

The external `assets/admin.js` file remains in the repository as the editable source copy.
