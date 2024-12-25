"use client";

import { useEffect } from "react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-col items-center justify-center h-full">
      <h2 className="text-center">Something went wrong!</h2>
      <button
        onClick={reset}
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        Try Again
      </button>
    </main>
  );
}
