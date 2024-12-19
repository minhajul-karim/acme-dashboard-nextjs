"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const connectionPool = require("../../db");

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const rawFormData = {
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  };
  const { customerId, amount, status } = CreateInvoice.parse(rawFormData);
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  try {
    await connectionPool.query(`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES ('${customerId}', '${amountInCents}', '${status}', '${date}')  
    `);
    revalidatePath("/dashboard/invoices");
  } catch (error) {
    return { message: "Database Error: Failed to create invoice" };
  }

  redirect("/dashboard/invoices");
}

export async function updateInvoice(invoiceId: string, formData: FormData) {
  const rawFormData = {
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  };
  const { customerId, amount, status } = CreateInvoice.parse(rawFormData);
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
    return { message: "Database Error: Failed to delete inoices" };
  }

}
