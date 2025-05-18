"use server";

import * as PinataSdk from "@pinata/sdk";

// Create an async function to initialize Pinata
export async function getPinataClient() {
  return new PinataSdk({
    pinataJWTKey: `${process.env.PINATA_JWT}`
  });
} 