# Component requirements: Review page

## Purpose
Surface the belief review UI where users can filter by topic, accept/reject beliefs, and submit corrections.

## Inputs/Outputs
- Renders `BeliefReviewList` that calls `/api/review` and `/api/validate`.
- Displays validation results and errors from backend calls.

## External dependencies
- `/api/review` for retrieval.
- `/api/validate` for status updates.
- shadcn/ui components.

## EARS coverage
- REQ-G-001, REQ-G-004, REQ-F-001, REQ-F-002, REQ-F-010, REQ-F-011, REQ-F-012.

## Traceability
- Implementation: `page.tsx` referencing `@/components/review/belief-review-list`.
- Assumptions: Corrections are optional free text applied directly to the belief content.
