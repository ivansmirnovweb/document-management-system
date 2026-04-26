"use client";

import type { ReactNode } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createDocumentInputSchema,
  updateDocumentInputSchema,
  type DocumentDetails,
  type UserRole,
} from "@document-flow/shared";
import { cn } from "@/lib/cn";
import { Button } from "@/shared/ui/button";
import { Card, CardDescription, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { formatDate } from "../document-utils";

type EmployerOption = {
  id: number;
  fullName: string;
};

type DocumentFormValues = {
  registrationNumber: string;
  registrationDate: string;
  title: string;
  description?: string | null;
  incomingNumber?: string | null;
  outgoingNumber?: string | null;
  employerId?: number | null;
  ownerId: number;
  executorId: number;
  dueDate: string;
  isControl?: boolean;
};

type DocumentFormPanelProps = {
  mode: "create" | "edit";
  document: DocumentDetails | null;
  currentUser: { id: number; role: UserRole };
  employers: EmployerOption[];
  isSaving?: boolean;
  onCancel: () => void;
  onSubmit: (input: DocumentFormValues) => Promise<void>;
};

function toFormDefaults(document: DocumentDetails | null, currentUser: { id: number }) {
  if (!document) {
    return {
      registrationNumber: "",
      registrationDate: new Date().toISOString().slice(0, 10),
      title: "",
      description: "",
      incomingNumber: "",
      outgoingNumber: "",
      employerId: undefined,
      ownerId: currentUser.id,
      executorId: currentUser.id,
      dueDate: new Date().toISOString().slice(0, 10),
      isControl: false,
    };
  }

  return {
    registrationNumber: document.registrationNumber,
    registrationDate: document.registrationDate.slice(0, 10),
    title: document.title,
    description: document.description ?? "",
    incomingNumber: document.incomingNumber ?? "",
    outgoingNumber: document.outgoingNumber ?? "",
    employerId: document.employerId ?? undefined,
    ownerId: document.ownerId,
    executorId: document.executorId,
    dueDate: document.dueDate.slice(0, 10),
    isControl: document.isControl,
  };
}

export function DocumentFormPanel({
  mode,
  document,
  currentUser,
  employers,
  isSaving = false,
  onCancel,
  onSubmit,
}: DocumentFormPanelProps) {
  const schema = mode === "create" ? createDocumentInputSchema : updateDocumentInputSchema;
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<DocumentFormValues>,
    defaultValues: toFormDefaults(document, currentUser),
  });

  const submit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Card className="space-y-6">
      <div>
        <CardTitle>{mode === "create" ? "Create document" : "Edit document"}</CardTitle>
        <CardDescription>
          {mode === "create"
            ? "Register a new workflow item."
            : document
              ? `Editing ${document.title} (${formatDate(document.registrationDate)})`
              : "Editing document."}
        </CardDescription>
      </div>

      <form key={`${mode}-${document?.id ?? "new"}`} className="space-y-4" onSubmit={submit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Registration number">
            <Input {...form.register("registrationNumber")} />
          </Field>
          <Field label="Registration date">
            <Input type="date" {...form.register("registrationDate")} />
          </Field>
          <Field label="Title" className="sm:col-span-2">
            <Input {...form.register("title")} />
          </Field>
          <Field label="Due date">
            <Input type="date" {...form.register("dueDate")} />
          </Field>
          <Field label="Executor ID">
            <Input type="number" min={1} {...form.register("executorId", { valueAsNumber: true })} />
          </Field>
          {currentUser.role === "ROOT" ? (
            <Field label="Owner ID">
              <Input type="number" min={1} {...form.register("ownerId", { valueAsNumber: true })} />
            </Field>
          ) : (
            <input type="hidden" {...form.register("ownerId", { valueAsNumber: true })} />
          )}
          <Field label="Employer">
            <Select
              {...form.register("employerId", {
                setValueAs: (value) => (value === "" ? null : Number(value)),
              })}
            >
              <option value="">No employer</option>
              {employers.map((employer) => (
                <option key={employer.id} value={employer.id}>
                  {employer.fullName}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Control mark">
            <label className="flex h-11 items-center gap-3 rounded-xl border border-zinc-300 bg-white px-4 text-sm text-zinc-700">
              <input type="checkbox" {...form.register("isControl")} />
              Control document
            </label>
          </Field>
        </div>

        <Field label="Description">
          <Textarea
            {...form.register("description", {
              setValueAs: (value) => (String(value).trim() === "" ? null : String(value)),
            })}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Incoming number">
            <Input
              {...form.register("incomingNumber", {
                setValueAs: (value) => (String(value).trim() === "" ? null : String(value)),
              })}
            />
          </Field>
          <Field label="Outgoing number">
            <Input
              {...form.register("outgoingNumber", {
                setValueAs: (value) => (String(value).trim() === "" ? null : String(value)),
              })}
            />
          </Field>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={form.formState.isSubmitting || isSaving}>
            {form.formState.isSubmitting || isSaving ? "Saving..." : mode === "create" ? "Create document" : "Save changes"}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={cn("block space-y-2 text-sm font-medium text-zinc-800", className)}>
      <span>{label}</span>
      {children}
    </label>
  );
}
