# Summary
A Deno project to create LP modules to access LP rest API natively using deno or node

# To run
- install deno
```
curl -fsSL https://deno.land/install.sh | sh
```

# Project Structure
```
my-deno-project/
├── src/
│   ├── mod.ts
│   └── other-module.ts
│   └── services/
│       ├── MsgHistService.ts
│   └── types/
│       ├── api.d.ts
├── test/
│   └── MsgHistService_test.ts
├── README.md
├── LICENSE
└── tsconfig.json
```
## src/services
- Each LP API should be a service and in a class

## src/types
- all the type defs should be in api.d.ts
- note: do not define enum in api.d.ts, they don't get transpile to js

# Run
- use `deno run -A hello.ts` to execute in deno

# Test
- setup vscode and deno, use deno extension
- create test classes in test folder
- should see the click to run test for each Deno.test method

# .env
- define env param in the .env file
- use this to load config
```
import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";

const env = await load();
const password = env["PASSWORD"];
```

# To create a new service convention
- reference LP's dev page for APIs
- check overview for the api service name
- for example https://developers.liveperson.com/agent-activity-api-overview.html has agentActivityDomain service name
- create AgentActivityService.ts class in /src/services folder and add all the corresponding logic
- copy from 1 of the service as template
- change `const serviceName` to the matching one from the domain call

# jsr publish
* update deno.json for version number
* use `deno publish --dry-run --allow-dirty` to a a dry run, verify files that will be published
* use `deno publish` to publish