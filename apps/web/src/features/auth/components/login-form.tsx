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
import { FormField } from "@/shared/ui/form-field";
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
        <p className="mt-1 text-sm text-zinc-600">Поля со * обязательны.</p>
      </div>

      {formError ? (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={submit}>
        <FormField
          label="Логин"
          required
          helperText="Введите имя пользователя для входа."
          error={form.formState.errors.username?.message}
        >
          <Input autoComplete="username" aria-required="true" {...form.register("username")} />
        </FormField>

        <FormField
          label="Пароль"
          required
          helperText="Введите пароль от учётной записи."
          error={form.formState.errors.password?.message}
        >
          <Input type="password" autoComplete="current-password" aria-required="true" {...form.register("password")} />
        </FormField>

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
