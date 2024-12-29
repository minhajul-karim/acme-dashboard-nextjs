"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const connectionPool = require("../../db");

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer"
  }),
  amount: z.coerce.number().gt(0, {message: "Please enter an amount greater than $0"}),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status."
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(prevState: State, formData: FormData) {
  const rawFormData = {
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  };

  const validatedFields = CreateInvoice.safeParse(rawFormData);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields. Failed to create invoice"
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  try {
    await connectionPool.query(`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES ('${customerId}', '${amountInCents}', '${status}', '${date}')  
    `);
    revalidatePath("/dashboard/invoices");
  } catch (error) {
    console.error(error);
    return { message: "Database Error: Failed to create invoice" };
  }

  redirect("/dashboard/invoices");
}

export async function updateInvoice(prevState: State, formData: FormData, invoiceId: string) {
  const rawFormData = {
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  };

  const validatedFields = CreateInvoice.safeParse(rawFormData);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields. Failed to update invoice"
    }
  }
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await connectionPool.query(`
      UPDATE invoices
      SET customer_id='${customerId}',
          amount='${amountInCents}',
          status='${status}'
      WHERE id='${invoiceId}'
    `);
    revalidatePath("/dashboard/invoices");
  } catch (error) {
    console.error(error);
    return { message: "Database Error: Failed to update invoice" };
  }

  redirect("/dashboard/invoices");
}

export async function deleteInvoice(invoiceId: string) {
  try {
    await connectionPool.query(`
      DELETE from invoices
      WHERE id = '${invoiceId}'
    `);
    revalidatePath("/dashboard/invoices");
  } catch (error) {
    console.error(error);
    return { message: "Database Error: Failed to delete inoices" };
  }

}
