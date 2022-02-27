# backend logging SDK

fastest way to make apps prod ready with self hosted logging. works by overriding the default console module and exposing extra functions in node.

- makes no difference in local development (console logging works as expected)
- console.logs are automatically blocked when in production
- gives an incident ID for every stream of logs which can be given to customers and used to correlate logs
- one line config support for discord and slack webhooks.

the SDK is still in development, check back later :)

## usage

### import

```js
const logger = require("@raiddotfarm/logger");

const errors = new logger({
  loggerServiceUrl: "http://logs.example.com",
});
```

### create a new ray

```js
async function yourFunction() {
  try {
    // override the default console
    const console = new errors.ray("yourFunction");

    ... // do stuff

    // log as normal
    console.log("hello", "world");
    console.warn("warning");
    console.error("error");
    console.debug("debug");
    console.info("info");

    ... // do more stuff

  } catch (err) {
    console.error(err);
    await console.send();
  }
}
```

## get logs

```js
console.getLogs();
```

---

## Config Options

| Parameter        | Description                                                                             | Example             | Required | Default               |
| ---------------- | --------------------------------------------------------------------------------------- | ------------------- | -------- | --------------------- |
| loggerServiceUrl | url of your logger instance                                                             | https://example.com | yes      | http://localhost:3000 |
| printLogs        | whether to print logs or not (always false when `process.env.NODE_ENV` is `production`) | true                | no       | true                  |
|                  |                                                                                         |                     |          |
