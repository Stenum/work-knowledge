# Component requirements: Review page

## Purpose
Displays beliefs retrieved from the backend and lets the user accept or reject them for validation.

## Inputs/Outputs
- Fetches beliefs from `/api/review` (optionally filtered by topic).
- Posts validation actions to `/api/validate`.

## External dependencies
- Review and validation APIs.
- Tailwind + shadcn components.

## EARS coverage
- REQ-G-001, REQ-G-004, REQ-F-001, REQ-F-002, REQ-F-010, REQ-F-011.

## Traceability
- Implementation: `page.tsx` consuming `BeliefReviewList`.
- Dependencies: `@/components/review/belief-review-list`.
- Assumptions: Corrections are limited to accept/reject in the UI; free-text correction can be added later.
