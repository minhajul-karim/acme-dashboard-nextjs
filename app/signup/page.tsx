import SignupForm from "../ui/signup-form";
import AcmeLogo from "../ui/acme-logo";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function Signup() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <SignupForm />
        <p className="text-center font-bold">
          Already have an accout?
          <Link className="text-blue-500 underline" href="/login"> Log in</Link>
        </p>
      </div>
    </main>
  );
}
