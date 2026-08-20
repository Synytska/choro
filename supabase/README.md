# Supabase migrations

Database changes live in `supabase/migrations` and are applied with the Supabase CLI.

Mobile app users should never run these SQL files. The database must already be migrated before an App Store or TestFlight build is used.

## Required secrets for CI

If you add a GitHub Actions workflow for migrations, store these as repository secrets:

- `SUPABASE_ACCESS_TOKEN`: create it in Supabase account settings.
- `SUPABASE_PROJECT_REF`: the project ref, for example `rxpgmewyuyzbtyxodlnc`.

For production, use a protected GitHub Environment so `supabase db push` requires approval before changing the live database.

## Local command

```sh
npx supabase link --project-ref rxpgmewyuyzbtyxodlnc
npx supabase db push --linked
```
