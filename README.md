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
- setup vscode and deno, use deno extention
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
