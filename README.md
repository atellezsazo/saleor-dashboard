# Saleor Dashboard

![Saleor Dashboard](https://user-images.githubusercontent.com/249912/82305745-5c52fd00-99be-11ea-9ac6-cc04a6f28c91.png)

A GraphQL-powered, single-page dashboard application for [Saleor](https://github.com/saleor/saleor/).

## Demo

See the [public demo](https://demo.saleor.io/dashboard/) of Saleor Dashboard!

Or launch the demo on a free Heroku instance.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js v14+
- A running instance of [Saleor](https://github.com/saleor/saleor/).

### Installing

Clone the repository:

```
$ git clone https://github.com/saleor/saleor-dashboard.git
```

Enter the project directory:

```
$ cd saleor-dashboard
```

#### Using stable release

To use the official stable release, checkout to a release tag:

```
$ git checkout 2.11.1
```

See the list of all releases here: https://github.com/saleor/saleor-dashboard/releases/

#### Using development version

If you want to use the latest development version, checkout to the `main` branch:

```
$ git checkout main
```

Install NPM dependencies:

```
$ npm i
```

### Configuration

There following environment variables are available for configuration:

- `API_URI` (required) - URI of a running instance of Saleor GraphQL API.
  If you are running Saleor locally with the default settings, set `API_URI` to: `http://localhost:8000/graphql/`.

- `APP_MOUNT_URI` - URI at which the Dashboard app will be mounted.
  E.g. if you set `APP_MOUNT_URI` to `/dashboard/`, your app will be mounted at `http://localhost:9000/dashboard/`.

- `STATIC_URL` - URL where the static files are located.
  E.g. if you use S3 bucket, you should set it to the bucket's URL. By default Saleor assumes you serve static files from the root of your site at `http://localhost:9000/`.

### Development

To start the development server run:

```
$ npm start
```

### Production

To build the application bundle run:

```
$ npm run build
```

### Error Tracking

Saleor Dashboard is using a generic error tracking wrapper function that takes care of the most popular use cases:

- initializing the tracker
- capturing exceptions and (optionally) displaying the event id
- setting basic user data (this is opt-in and disabled by default)

By default it ships with a Sentry adapter but any kind of error tracking software can be used by creating a custom adapter (using Sentry and TS types as an example).

Example:

```javascript
// src/services/errorTracking/index.ts

import { CustomAdapter } from "./adapters/";

const errorTracker = ErrorTrackerFactory(CustomAdapter(config));
```

##### Usage with Sentry adapter:

Sentry is used as the default tracker so no changes in code are necessary and the configuration is done via environment variables.

The following environment variables are available:

```
# Required
SENTRY_DSN=

# Optional
# https://docs.sentry.io/product/cli/configuration/
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_URL_PREFIX=
ENVIRONMENT=
```

#### Crafted with ❤️ by [Saleor Commerce](https://saleor.io)
