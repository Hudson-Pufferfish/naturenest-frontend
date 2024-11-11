"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-4xl mx-auto p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <Button onClick={() => reset()} className="bg-blue-500 hover:bg-blue-600">
        Try again
      </Button>
    </div>
  );
}
