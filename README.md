# HiBob SDK

[![npm version](https://badge.fury.io/js/hibob-sdk.svg)](https://badge.fury.io/js/hibob-sdk)

The package provides a TypeScript SDK for the HiBob API, allowing developers to easily interact with the HiBob platform.

## Useful Links

- [HiBob API Reference](https://apidocs.hibob.com/reference/getting-started-with-bob-api)

## Installation

You can install it using yarn or any other package manager:

```bash
yarn add hibob-sdk
```

Don't forget to setup peer dependencies:

```bash
yarn add @hey-api/client-fetch
```

## Usage

You can find simple examples in the `sandbox` directory. Here is a basic example of how to use the SDK:

```typescript
import { client, postPeopleSearch } from 'hibob-sdk'

// Set up the client with your HiBob credentials
client.setConfig({
  auth: () => `${process.env.HIBOB__USERNAME}:${process.env.HIBOB__PASSWORD}`,
})

// Perform a basic request to the HiBob API
const response = await postPeopleSearch({
  body: { fields: ['/root/id'] },
})
console.log(response.data)
```

## Contributing

I welcome contributions! Follow these steps to contribute:

1. Setup environment
   1. Fork the repository.
   2. Clone your forked repository.
   3. Install dependencies by running `yarn install`.
   4. Generate the local client artifacts by running `yarn generate:client`.
2. Making Changes
   1. Create a new branch for your changes.
   2. Make your changes and commit them.
   3. Push your changes to your forked repository.
3. Submitting a Pull Request
   1. Go to the original repository on GitHub and click the "New pull request" button.
   2. Select your branch and submit the pull request.
   3. Wait for the review and address any feedback.

You are the star of this project! 🌟
