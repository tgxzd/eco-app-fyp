"use server";

import PinataSDK from "@pinata/sdk";

// Create an async function to initialize Pinata
export async function getPinataClient() {
  return new PinataSDK({
    pinataJWTKey: process.env.PINATA_JWT!,
  });
} 