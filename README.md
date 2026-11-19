# PR #482 — Live rig dashboard

Adds a live dashboard for the selected well:

- Well selector with search
- Live gauges for the main WITS channels (depth, ROP, WOB, hook load, SPP)
- Live ROP chart
- Threshold alarms
- KPI summary for the session
- Drilling notes (list, search, add)
- Metric / imperial and dark mode toggles, persisted per user

## Notes for reviewers

- `src/api/mockServer.ts` and `src/api/fakeSocket.ts` simulate the platform REST API and the WITS socket for this sandbox. They are **not part of the review**.
- Everything else is new code in this PR.
- Thresholds in settings are configured in imperial units.

## Run

```
npm install
npm run dev
```
