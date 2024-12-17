import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import Form from "@/app/ui/invoices/create-form";

export default function UpdateInvoiceForm({params}: any) {
  const invoiceId = params.id;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${invoiceId}/edit`,
            active: true,
          },
        ]}
      />
      <Form customers={[]} />
    </main>
  );
}