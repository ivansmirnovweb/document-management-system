"use client";

import { useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { Card, CardDescription, CardTitle } from "@/shared/ui/card";

export default function Error({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
      <Card className="space-y-4 max-w-lg">
        <CardTitle>Что-то пошло не так</CardTitle>
        <CardDescription>{error.message}</CardDescription>
        <Button onClick={reset}>Повторить</Button>
      </Card>
    </div>
  );
}
