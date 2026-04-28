"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordRequestSchema } from "@document-flow/shared";
import type { ChangePasswordRequest } from "@document-flow/shared";
import { useAuth } from "../auth.provider";
import { Button } from "@/shared/ui/button";
import { Card, CardDescription, CardTitle } from "@/shared/ui/card";
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
      </div>

      {formError ? (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</div>
      ) : null}

      <form className="space-y-4" onSubmit={submit}>
        <label className="block space-y-2 text-sm font-medium text-zinc-800">
          <span>Текущий пароль</span>
          <Input type="password" autoComplete="current-password" {...form.register("currentPassword")} />
          {form.formState.errors.currentPassword ? (
            <span className="text-xs text-red-600">{form.formState.errors.currentPassword.message}</span>
          ) : null}
        </label>

        <label className="block space-y-2 text-sm font-medium text-zinc-800">
          <span>Новый пароль</span>
          <Input type="password" autoComplete="new-password" {...form.register("newPassword")} />
          {form.formState.errors.newPassword ? (
            <span className="text-xs text-red-600">{form.formState.errors.newPassword.message}</span>
          ) : null}
        </label>

        <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Сохраняем пароль..." : "Сменить пароль"}
        </Button>
      </form>
    </Card>
  );
}
