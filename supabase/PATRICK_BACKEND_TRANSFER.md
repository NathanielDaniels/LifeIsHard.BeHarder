# Patrick backend transfer

This package recreates the smallest Supabase backend used by the Patrick
Wingert public website before the application cleanup is deployed.

## Transfer

- `whoop_tokens`: schema only. Patrick will reauthorize WHOOP after cutover.
- `whoop_oauth_state`: schema only. OAuth state is short-lived and must not be
  copied between projects.
- `api_connections`: non-biometric connection-health metadata used by Admin.

Apply `patrick-minimal-schema.sql` to the replacement Supabase project.

## Do not transfer

- WHOOP history and workouts
- Coach responses, briefings, zones, and workout prescriptions
- Strava tokens, OAuth state, activities, sync state, or race results
- API connection health rows
- Cached biometric rows. Website requests fetch directly from WHOOP.
- Supabase subscriber rows

The public email signup already creates its authoritative contact in Resend.
Keep the legacy `subscribers` table until its 16 addresses have been compared
with or exported from the Resend audience.

## Cutover checklist

1. Apply the schema to the replacement project.
2. Verify that exactly the three expected public tables exist and are empty.
3. Configure the replacement project URL and server secret in Vercel.
4. Deploy the application cleanup before removing the legacy project values.
5. Reauthorize Patrick through the WHOOP OAuth flow.
6. Verify `/api/whoop/stats` reports `mode: "live"`.
7. Only then retire the legacy Supabase project.
