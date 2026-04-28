File paths ALWAYS lowercase: @/components/ui/card (NOT Card)
Components PascalCase: import { Card } from "@/components/ui/card"
Icons PascalCase from lucide-react: import { Search, Plus } from "lucide-react"
CRUD: import { getRows, insertRow, updateRow, deleteRow } from "@/lib/supabase/db"
Config: import config from "@/lib/config"
Client: import { createClient } from "@/lib/supabase/client"
Installed: accordion, alert, avatar, badge, breadcrumb, button, card, checkbox, collapsible, dialog, dropdown-menu, hover-card, input, label, popover, progress, radio-group, scroll-area, select, separator, sheet, skeleton, slider, switch, table, tabs, textarea, tooltip
NOT installed: Calendar, Form, Toast
Select uses onValueChange NOT onChange
No @radix-ui direct imports — use @/components/ui/
No src/utils/, src/helpers/, src/services/ — use src/lib/
