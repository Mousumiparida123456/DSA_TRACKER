# DSA Tracker - PRD

## Original Problem Statement
BUILD ME A DSA TRACKER WHERE I CAN ADD TOPICS, MARK PROGRESS, AND GET REVISION REMINDERS.
User uploaded DSA SHEET.docx with 241 LeetCode problems across 16 DSA patterns.

## Architecture
- **Backend**: FastAPI + MongoDB (Motor async driver)
- **Frontend**: React + Shadcn UI + Tailwind CSS + Recharts
- **Database**: MongoDB (collection: topics)
- **Design**: Swiss/High-Contrast (Cabinet Grotesk + IBM Plex Mono)

## User Personas
- DSA learners preparing for coding interviews
- Students tracking their LeetCode progress
- Developers doing structured DSA revision

## Core Requirements
- Add/Edit/Delete DSA topics with name, category, difficulty, notes, problem links
- Mark progress (Not Started → In Progress → Completed)
- Spaced repetition revision reminders (1d, 3d, 7d, 30d)
- Filter by category, difficulty, status, search
- Progress analytics (pie charts + bar charts)
- Pre-seeded with 241 LeetCode problems across 16 patterns

## What's Been Implemented (April 14, 2026)
- Full CRUD API for topics
- 16 DSA pattern categories with 241 seeded LeetCode problems
- Dashboard with overall progress bar, stats cards, pie charts
- **Pattern Progress section** with per-category progress bars (clickable to filter)
- **Table view** (default) with compact rows, checkboxes, inline status change
- **Grid view** toggle with card layout
- **Bulk status update** — select all / individual checkboxes + bulk mark completed/in-progress/not-started
- **Sorting** by Name, Difficulty, Category, Status, Date Added (asc/desc)
- Filter bar with search, category, difficulty, status filters
- Add/Edit/Delete topic dialogs
- Status tracking with spaced repetition revision reminders
- Mark as reviewed functionality
- Responsive Swiss/high-contrast design (Cabinet Grotesk + IBM Plex Mono)

## Prioritized Backlog
### P0 (Critical)
- All core features implemented ✓

### P1 (Important)
- Bulk status update (mark multiple problems at once)
- Export/import progress data
- Custom tags/labels for topics
- Sort topics by name/difficulty/date

### P2 (Nice to Have)
- Email notifications for revision reminders
- Dark mode toggle
- Mobile-optimized view
- LeetCode integration (auto-fetch problem data)
- Study streaks and gamification

## Next Tasks
- Add sorting options for topic grid
- Add bulk select and status update
- Add progress percentage per category
- Add export to CSV functionality
