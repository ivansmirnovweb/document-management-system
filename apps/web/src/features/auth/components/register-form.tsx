"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerRequestSchema } from "@document-flow/shared";
import type { RegisterRequest } from "@document-flow/shared";
import { useAuth } from "../auth.provider";
import { Button } from "@/shared/ui/button";
import { Card, CardDescription, CardTitle } from "@/shared/ui/card";
import { FormField } from "@/shared/ui/form-field";
import { Input } from "@/shared/ui/input";

export function RegisterForm() {
  const router = useRouter();
  const auth = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (auth.user) {
      router.replace("/dashboard");
    }
  }, [auth.user, router]);

  const form = useForm<RegisterRequest>({
    resolver: zodResolver(registerRequestSchema),
    defaultValues: {
      username: "",
      displayName: "",
      unit: "",
      password: "",
    },
  });

  const submit = form.handleSubmit(async (values) => {
    setFormError(null);
    try {
      await auth.register(values);
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Не удалось зарегистрироваться");
    }
  });

  return (
    <Card className="mx-auto w-full max-w-md space-y-6">
      <div>
        <CardTitle>Регистрация</CardTitle>
        <CardDescription>Создайте новую учётную запись для доступа к рабочей области.</CardDescription>
        <p className="mt-1 text-sm text-zinc-600">Поля со * обязательны.</p>
      </div>

      {formError ? (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</div>
      ) : null}

      <form className="space-y-4" onSubmit={submit}>
        <FormField
          label="Отображаемое имя"
          required
          helperText="Как будет отображаться ваше имя в системе."
          error={form.formState.errors.displayName?.message}
        >
          <Input autoComplete="name" aria-required="true" {...form.register("displayName")} />
        </FormField>

        <FormField
          label="Логин"
          required
          helperText="Используйте латиницу, цифры, точку, подчёркивание или дефис."
          error={form.formState.errors.username?.message}
        >
          <Input autoComplete="username" aria-required="true" {...form.register("username")} />
        </FormField>

        <FormField
          label="Подразделение"
          required
          helperText="Например, отдел, филиал или команда."
          error={form.formState.errors.unit?.message}
        >
          <Input aria-required="true" {...form.register("unit")} />
        </FormField>

        <FormField
          label="Пароль"
          required
          helperText="Минимум 8 символов."
          error={form.formState.errors.password?.message}
        >
          <Input type="password" autoComplete="new-password" aria-required="true" {...form.register("password")} />
        </FormField>

        <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Создаём аккаунт..." : "Создать аккаунт"}
        </Button>
      </form>

      <p className="text-center text-sm text-zinc-600">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="font-medium text-zinc-900 underline underline-offset-2">
          Войти
        </Link>
      </p>
    </Card>
  );
}
