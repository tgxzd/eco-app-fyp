"use client";

import Background from '@/components/Background';
import Hero from '@/components/ui/Hero';
import Navbar from '@/components/ui/Navbar';
import WhySection from '@/components/ui/WhySection';

export default function Home() {
  return (
    <>
      <Background variant="web3-emerald" />
      <Navbar variant="dark" />
      <Hero variant="dark" />
      <WhySection variant="dark" />
    </>
  );
}
