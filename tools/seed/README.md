# Seed

Will populate the database with some initial data.

## Usage

To seed the database, nothing has to be done. It is done automatically by the
`dev` script.

To update the data that is used to seed the database, run the following command:

```bash
npm run seed:update
```

This will update the seeded data to be whatever the current data in your
database is, replacing the current seeding data. This data is committed to the
repository, so ensure there is no sensitive information in the database.
