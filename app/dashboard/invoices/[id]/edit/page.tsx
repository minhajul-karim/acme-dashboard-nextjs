import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import EditInvoiceForm from "@/app/ui/invoices/edit-form";
import { fetchInvoiceById, fetchCustomers } from "@/app/lib/data";

export default async function UpdateInvoiceForm(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const invoiceId = params.id;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(invoiceId),
    fetchCustomers(),
  ]);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Invoices", href: "/dashboard/invoices" },
          {
            label: "Edit Invoice",
            href: `/dashboard/invoices/${invoiceId}/edit`,
            active: true,
          },
        ]}
      />
      <EditInvoiceForm customers={customers} invoice={invoice} />
    </main>
  );
}
