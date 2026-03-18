"use client";

import dynamic from "next/dynamic";

const SignInPage = dynamic(
  () => import("@/components/ui/sign-in-flow").then((mod) => mod.SignInPage),
  { ssr: false }
);

export default function LoginPage() {
  return <SignInPage />;
}
