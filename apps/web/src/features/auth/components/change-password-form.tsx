"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordRequestSchema } from "@document-flow/shared";
import type { ChangePasswordRequest } from "@document-flow/shared";
import { useAuth } from "../auth.provider";
import { Button } from "@/shared/ui/button";
import { Card, CardDescription, CardTitle } from "@/shared/ui/card";
import { FormField } from "@/shared/ui/form-field";
import { Input } from "@/shared/ui/input";

type ChangePasswordFormProps = {
  title?: string;
  description?: string;
};

export function ChangePasswordForm({
  title = "Смена пароля",
  description = "Введите текущий и новый пароль.",
}: ChangePasswordFormProps) {
  const auth = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<ChangePasswordRequest>({
    resolver: zodResolver(changePasswordRequestSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const submit = form.handleSubmit(async (values) => {
    setFormError(null);
    try {
      await auth.changePassword(values);
      form.reset();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Не удалось сменить пароль");
    }
  });

  return (
    <Card className="space-y-6">
      <div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <p className="mt-1 text-sm text-zinc-600">Поля со * обязательны.</p>
      </div>

      {formError ? (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</div>
      ) : null}

      <form className="space-y-4" onSubmit={submit}>
        <FormField
          label="Текущий пароль"
          required
          helperText="Подтвердите текущую учётную запись."
          error={form.formState.errors.currentPassword?.message}
        >
          <Input type="password" autoComplete="current-password" aria-required="true" {...form.register("currentPassword")} />
        </FormField>

        <FormField
          label="Новый пароль"
          required
          helperText="Минимум 8 символов."
          error={form.formState.errors.newPassword?.message}
        >
          <Input type="password" autoComplete="new-password" aria-required="true" {...form.register("newPassword")} />
        </FormField>

        <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Сохраняем пароль..." : "Сменить пароль"}
        </Button>
      </form>
    </Card>
  );
}
