# Component Patterns

Composable UI patterns built on top of shadcn/ui primitives. Each pattern is a higher-level component that solves a common page-type problem.

The page-builder agent reads `catalog.json` to pick the right pattern for a given page type.

## Patterns

| Pattern | Use For |
|---------|---------|
| `data-table-advanced` | Lists with sort/filter/bulk actions |
| `kanban-board` | Status-based drag-and-drop boards |
| `timeline` | Time-ordered activity feeds |
| `file-manager` | File/asset browsers with upload |
| `metric-dashboard` | KPI cards with sparklines |
| `comparison-view` | Side-by-side plan/feature matrix |
| `wizard` | Multi-step forms |

## Usage

```tsx
import { DataTableAdvanced } from "@/components/patterns/data-table-advanced";
import { KanbanBoard } from "@/components/patterns/kanban-board";
import { Timeline } from "@/components/patterns/timeline";
import { FileManager } from "@/components/patterns/file-manager";
import { MetricDashboard } from "@/components/patterns/metric-dashboard";
import { ComparisonView } from "@/components/patterns/comparison-view";
import { Wizard } from "@/components/patterns/wizard";
```

All patterns are client components (`"use client"`) and use Tailwind + shadcn primitives from `@/components/ui/*`.
