"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../button";
import { createCustomer, CreateCustomerState } from "@/app/lib/actions";
import ErrorMessage from "../invoices/error-message";

export default function Form({ avatars }: { avatars: string[] }) {
  const initialState: CreateCustomerState = { message: null, fieldErrors: {} };
  const [avatar, setAvatar] = useState("");
  const [errors, setErrors] = useState(initialState);

  const formErrorExists = Object.keys(errors?.fieldErrors ?? {}).length > 0;
  const formErrorMessageUI = formErrorExists && (
    <div id="customer-id-error" aria-live="polite" aria-atomic="true">
      <p className="mt-2 text-sm text-red-500">{errors.message}</p>
    </div>
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = await createCustomer(formData);
    const newErrors = { ...errors };

    if (data?.message) {
      newErrors.message = data.message;
    }

    if (data?.fieldErrors) {
      newErrors.fieldErrors = data.fieldErrors;
    }

    setErrors(newErrors);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Customer name */}
      <div className="mb-4">
        <label
          htmlFor="customerName"
          className="mb-4 block text-sm font-medium"
        >
          Customer Name
        </label>
        <input
          required
          type="text"
          id="customerName"
          name="customerName"
          placeholder="Enter customer name"
          aria-describedby="customer-name-error"
          className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
        />
        <ErrorMessage errors={errors.fieldErrors?.customerName} />
      </div>
      {/* Customer email */}
      <div className="mb-4">
        <label
          htmlFor="customerEmail"
          className="mb-4 block text-sm font-medium"
        >
          Customer Email
        </label>
        <input
          required
          type="text"
          id="customerEmail"
          name="customerEmail"
          placeholder="Enter customer email"
          aria-describedby="customer-email-error"
          className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
        />
        <ErrorMessage errors={errors.fieldErrors?.customerEmail} />
      </div>
      {/* Customer avatar */}
      <div className="mb-4">
        <label htmlFor="avatar" className="mb-4 block text-sm font-medium">
          Customer Avatar
        </label>
        <div className="flex justify-start items-center gap-4">
          <select
            required
            id="avatar"
            name="avatar"
            value={avatar}
            aria-describedby="customer-avatar-error"
            onChange={(e) => setAvatar(e.target.value)}
            className="rounded-md border border-gray-200 py-2 text-sm outline-2"
          >
            <option value="" disabled>
              Select an avatar
            </option>
            {avatars.map((avatar, i) => (
              <option key={avatar} value={avatar}>
                {`Avatar ${i + 1}`}
              </option>
            ))}
          </select>
          {avatar && (
            <Image
              className="rounded-full"
              src={avatar}
              width={50}
              height={50}
              alt="Avatar"
            />
          )}
        </div>
        <ErrorMessage errors={errors.fieldErrors?.avatar} />
      </div>
      {formErrorMessageUI}
      {/* Submission */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="h-10 flex items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Customer</Button>
      </div>
    </form>
  );
}
