# Auth

A simple auth API  
It has a GraphQL architecture, and leverages the following tools/technologies

- Node/Express
- MongoDB/Mongoose
- Apollo GraphQL(https://www.apollographql.com/docs/apollo-server/)
- Mailgun(Free plan connects to only one email without adding card details)
- Mocha/Chai(with Sinon)

The API is dpeloyed at https://fidia-be.herokuapp.com/graphql

## Getting started

### Prerequisites

- Node v14.x
- yarn(or npm) >= 6.14
- Git installed

### Running Locally

- Clone the repository. Run the following in your terminal

```bash
  $ git clone https://github.com/jobafash/fidia-be.git
  $ cd fidia-be
  $ yarn
```

In the root directory of the project create a _.env_ file and copy the values from _.env.sample_ and set the values of the veriables correctly.

- To run locally you'll need

  - URI to a MongoDB server running locally or in the cloud
  - Mailgun API credentials

- To run in development mode
  bash

  ```
  $ yarn run dev
  ```

- To run in production mode
  - set NODE*ENV in your *.env\_ to production
  - Run in your terminal
    bash
    ```
    $ yarn run build
    $ yarn start
    ```
- To run unit tests(all 4 tests are passing)
  - set NODE*ENV in your *.env\_ to test
  - Run in your terminal
    bash
    ```
    $ yarn test
    ```
