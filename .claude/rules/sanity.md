---
paths:
  - "sanity/schemas/**/*"
  - "src/lib/sanity/**/*.ts"
---

# Sanity Rules

These rules load when editing Sanity schemas or Sanity client code.

## Schemas

Every schema field has a clear title and description.
Validation rules on every required field.
Slug fields use the slug type with a source field.

## Queries

GROQ queries live in src/lib/sanity. One file per content type.
Every query has a typed return type.
Never include dead reference projections. If a field has been removed from the schema, remove it from every query.

## Dead query prevention

If a query is added, it must be imported and called by a page or component within the same change.
If a query is no longer used, it must be removed in the next audit.
Do not leave orphaned queries.

## Client and image helpers

Sanity client is in src/lib/sanity/client.ts.
Image URL builder is in src/lib/sanity/image.ts.
Do not duplicate. Do not bypass.

## Environment variables

NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET. Both must be in .env.example.
Never hardcode project id or dataset.
