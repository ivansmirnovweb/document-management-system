"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginRequestSchema } from "@document-flow/shared";
import type { LoginRequest } from "@document-flow/shared";
import { useAuth } from "../auth.provider";
import { Button } from "@/shared/ui/button";
import { Card, CardDescription, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";

export function LoginForm() {
  const router = useRouter();
  const auth = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (auth.user) {
      router.replace("/dashboard");
    }
  }, [auth.user, router]);

  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const submit = form.handleSubmit(async (values) => {
    setFormError(null);
    try {
      await auth.login(values);
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Не удалось войти");
    }
  });

  return (
    <Card className="mx-auto w-full max-w-md space-y-6">
      <div>
        <CardTitle>Вход</CardTitle>
        <CardDescription>Используйте свои данные для входа в систему документооборота.</CardDescription>
      </div>

      {formError ? (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={submit}>
        <label className="block space-y-2 text-sm font-medium text-zinc-800">
          <span>Логин</span>
          <Input autoComplete="username" {...form.register("username")} />
          {form.formState.errors.username ? (
            <span className="text-xs text-red-600">{form.formState.errors.username.message}</span>
          ) : null}
        </label>

        <label className="block space-y-2 text-sm font-medium text-zinc-800">
          <span>Пароль</span>
          <Input type="password" autoComplete="current-password" {...form.register("password")} />
          {form.formState.errors.password ? (
            <span className="text-xs text-red-600">{form.formState.errors.password.message}</span>
          ) : null}
        </label>

        <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Входим..." : "Войти"}
        </Button>
      </form>

      <p className="text-center text-sm text-zinc-600">
        Нет аккаунта?{" "}
        <Link href="/register" className="font-medium text-zinc-900 underline underline-offset-2">
          Зарегистрироваться
        </Link>
      </p>
    </Card>
  );
}
