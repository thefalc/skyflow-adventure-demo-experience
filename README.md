# Skyflow Adventure Demo Experience

## Overview

This application demonstrates Skyflow's support for secure data collection, data sharing,
and data governance.

The application is interactive and uses a Skyflow vault while teaching the user about Skyflow vaults.

## Requirements

- node - v10.17
- npm > 6.x.x

You can find the documentation and steps to install node and npm [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

## Configuration

### Vault setup

Before you can run the application, you need to create a vault and import the data.

#### Create the vault
1. Login to Skyflow Studio.
1. Click Create Vault and select Upload Vault Schema.
1. Drag the data/vault_schema.json file into the modal and then click Upload.

#### Set environment variables
The import data script and demo application need environment variables for your VAULT_ID, VAULT_URL,
and SERVICE_ACCOUNT_KEY.

1. From the vault details modal, copy the Vault ID.
1. In your terminal, execute `export VAULT_ID=$VAULT_ID` replacing `$VAULT_ID` with the vault ID you
copied.
1. From the vault details modal, copy the Vault URL.
1. In your terminal, execute `export VAULT_URL=$VAULT_URL` replacing `$VAULT_URL` with the vault URL
you copied.
1. Create a role with a policy for inserting and reading records for the persons table in the vault
you created.
1. Create a service account assigning the role.
1. Open the downloaded credentials.json file and copy the contents.
1. In your terminal, execute `export VAULT_URL=$SERVICE_ACCOUNT_KEY_DATA`, replacing
`$SERVICE_ACCOUNT_KEY_DATA` with the contents of the credentials.json file you downloaded.

#### Import seed data

1. In your terminal, navigate to the data folder.
1. Execute the following commands.

```
npm install
node import_data.js
```

## Running the demo

In your terminal, navigate to the demo root directory and execute:

```
npm install
```

Next, either run the demo in development mode or in production mode.

**Development mode**
```
npm run dev
```

Go to [http://localhost:3000](http://localhost:3000) to view the user experience.

**Production mode**
```
npm build
npm start
```

Go to [http://localhost:3000](http://localhost:3000) to view the user experience.