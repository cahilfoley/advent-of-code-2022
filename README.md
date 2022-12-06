# Advent of Code 2022

## Installing deps

Make sure you have Node.js installed and run this command in the root of the repo:

```sh
npm install
```

## Running the scripts

To run a script for a day use the following command:

```sh
npx ts-node --esm day-X/part-Y.ts
```

> NOTE: Replace `X` with the number of the day you want to run and `Y` with the number of the part you want to run
>
> **e.g.** `npx ts-node --esm day-5/part-2.ts`

Some scripts have some extended logging available to help understand the solution, keep an eye out for a `DEBUG_LOGGING` variable in each script file that you can set to `true` to enable extra logs.

## Rust implementations

Some of the challenges have additional solutions written in [rust](https://www.rust-lang.org/) that should be blazingly fast 🚀🔥 (emphasis on the **should**).

To run the rust version change into the `day-X` directory and run `cargo run`.
