# DSL4SC Toolchain Example: DvP (Delivery versus Payment)

Simplified version of DSL4SC DvP examples.

## Prereq

Tested on **Docker Engine 19.03.1** and **Node.js 11.6.0**.

## Setup

### DSL4SC toolchain

Build DSL4SC docker images by:

```bash
git clone https://github.com/ldltools/ldlsat.git --branch develop
(cd ldlsat && docker build --target builder -t ldltools/ldlsat-dev .)
git clone https://github.com/ldltools/dsl4sc.git --branch develop
(cd dsl4sc && make ldltools/dsl4sc-dev) # takes long time...
```

To see if the build was successful, run:

```bash
$ docker image ls | grep ldltools
ldltools/dsl4sc-dev   latest   fba9c90a4d54   23 seconds ago      1.63GB
ldltools/ldlsat-dev   latest   dd8b92fe88c1   About an hour ago   1.15GB
```

### DvP example

Clone this project and install Node.js packages needed for TX simulator.
If you're using `anyenv`, version of Node.js will be automatically adjusted.

```bash
git clone https://github.com/ldltools/dsl4sc-examples.git --branch dvp
cd dsl4sc-examples/dvp
npm install
```

## Demo Scenario

See [demo.md](demo.md).
