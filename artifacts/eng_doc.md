# Engineering Design Doc — Field Service Quoting Reminder Tool

**Archetype**: workflow-automation
**Status**: Frozen fixture for E2E build canary (VOS-183 / VOS-208)

## Overview

A SaaS that connects to a user's inbox, detects sent quotes, and runs user-defined reminder flows against each quote. Core objects: `flows`, `triggers`, `runs`, `run_steps`, `quotes`. UI is workflow-automation archetype: flows list, flow editor, runs timeline, triggers config.

## Pages

### Route: `/dashboard/flows`
List of flows the user has created. Each row shows name, trigger type, last-run status, runs this week. Actions: edit, duplicate, disable, delete. Empty state links to "Create your first flow".

### Route: `/dashboard/flow-detail`
Read-write editor for a single flow. Left column lists the ordered steps (wait → send reminder → branch on reply). Right column inspects the selected step (template, delay, condition). Top bar: flow name, trigger, active toggle.

### Route: `/dashboard/runs`
All runs across all flows with status filter chips (in-progress, completed, paused, failed). Clicking a run opens the timeline view with per-step timestamps and email preview.

### Route: `/dashboard/triggers`
List of connected triggers (Gmail inbox, Outlook inbox, webhook). New-trigger wizard handles OAuth install. Each trigger shows its last event timestamp and event rate.

## Schema

```sql
CREATE TABLE IF NOT EXISTS PREFIX_flows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  trigger_type text NOT NULL CHECK (trigger_type IN ('gmail_inbox','outlook_inbox','webhook','manual')),
  is_active boolean NOT NULL DEFAULT true,
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS PREFIX_triggers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  trigger_type text NOT NULL,
  provider_account_email text,
  last_event_at timestamptz,
  is_healthy boolean NOT NULL DEFAULT true,
  oauth_tokens jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS PREFIX_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  flow_id uuid REFERENCES PREFIX_flows(id) ON DELETE CASCADE,
  quote_subject text,
  recipient_email text,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','running','paused','completed','failed')),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS PREFIX_run_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid REFERENCES PREFIX_runs(id) ON DELETE CASCADE,
  step_index int NOT NULL,
  kind text NOT NULL CHECK (kind IN ('wait','send_reminder','branch','pause_on_reply')),
  scheduled_at timestamptz,
  executed_at timestamptz,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','running','succeeded','failed','skipped')),
  result jsonb,
  created_at timestamptz DEFAULT now()
);
```

## API Routes

### Route: `/api/connect-trigger`
Kick off the Gmail/Outlook OAuth install. Body `{ provider: 'gmail'|'outlook' }`, response `{ install_url: string }`.

### Route: `/api/create-flow`
Create a new flow. Body `{ name: string, trigger_type: string, steps: Step[] }`, response `{ flowId: string }`.

### Route: `/api/trigger-flow`
Manually fire a flow against a specific quote. Body `{ flowId: string, quoteSubject: string, recipientEmail: string }`, response `{ runId: string, status: 'queued' }`.

### Route: `/api/pause-run`
Pause an in-progress run. Body `{ runId: string }`, response `{ paused: true }`.

### Route: `/api/retry-step`
Retry a failed step within a run. Body `{ runId: string, stepIndex: number }`, response `{ retried: true }`.

### Route: `/api/view-run`
Read a run + its steps. Query `?runId=...`, response `{ run, steps }`.

## Integrations

- **GitHub**: not required for v0.1 (no code analysis).
- **Gmail + Outlook OAuth**: required. Install wizard under `/dashboard/triggers`.
- **Slack**: Team plan — send a Slack message when a customer replies. Post-v0.1.
- **Stripe**: required for billing; shared checkout flow from venture-template.
- **Inngest**: required — every run-step with `kind='wait'` schedules an Inngest event.

## User-story verbs (for action extractor)

- connect-trigger
- create-flow
- trigger-flow
- pause-run
- retry-step
- view-run
- list-flows
- list-runs
