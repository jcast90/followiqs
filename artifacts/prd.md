# Product Requirements Document — Field Service Quoting Reminder Tool

**Archetype**: workflow-automation
**Status**: Frozen fixture for E2E build canary (VOS-183 / VOS-208)

## Problem

Small field service companies (HVAC, plumbing, electrical, solar — 5 to 50 employees) send 15–40 quotes per week via email or PDF and then lose track of them. Ops managers manually chase follow-ups from a spreadsheet 2–3 times per week. 40–60 percent of open quotes never receive a follow-up and close rates suffer by an estimated 15–25 percent of potential revenue.

## Target User

Operations Manager or Office Admin at a 5–50 person field service company. They own quote follow-up workflow, report to the owner weekly on pipeline health, and currently use Google Sheets + manual email chasing. Willing to pay 50–200 USD/mo for a tool that automates the follow-up and gives a clean pipeline view.

## Core User Stories

1. **Connect email inbox**: User authenticates their Gmail or Outlook account so the product can detect sent quotes automatically. No more manual upload.
2. **Create follow-up flow**: User builds a 3-step reminder sequence (Day 2 polite nudge, Day 7 check-in, Day 14 last call) via a step-by-step flow editor.
3. **Trigger flow on quote sent**: When a new quote-shaped email is detected in the inbox, the flow fires automatically. The user can also manually trigger a flow for a specific quote.
4. **View run history**: For every triggered flow run, the user sees a timeline of which reminders went out, when, who opened them, who replied.
5. **Pause or retry a run**: If a customer replies manually, the user pauses the run with one click. If a step failed (email bounce, rate limit), the user can retry that step without restarting the flow.
6. **Dashboard**: Top-level view shows open quotes, follow-ups in-flight, replies needing attention, close rate trend over the last 30 days.

## Out of Scope (v0.1)

- Quote generation / invoicing (assume quotes are already created by the user in their existing tool)
- Payment collection
- Team inbox / multi-user assignment
- Mobile app

## Success Metrics

- 70 percent of waitlist converts to trial
- Average user connects inbox within 10 minutes of signup
- Within 30 days of first run, users show 2x lift in quote follow-up frequency
- Churn under 6 percent monthly after month 2

## Integrations Required

- **Gmail OAuth** (primary) and **Microsoft Graph / Outlook OAuth** (fan-out)
- **Supabase** — store flows, runs, steps, reminder templates, reply events
- **Inngest** — schedule Day-2 / Day-7 / Day-14 reminders per run
- **Resend** — send the branded reminder emails (sender = user's own verified domain via delegated auth in v0.2; v0.1 ships with shared sender)

## Pricing

- Starter 49 USD/mo — 1 user, 100 runs/mo, 3 active flows
- Team 149 USD/mo — 3 users, 1000 runs/mo, unlimited flows, Slack notifications
- Scale 349 USD/mo — 10 users, unlimited runs, priority support, custom reminder templates
