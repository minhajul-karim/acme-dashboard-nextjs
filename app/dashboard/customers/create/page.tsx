import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { Metadata } from "next";
import Form from "@/app/ui/customers/create-form";
import { fetchCustomers } from "@/app/lib/data";
import { CustomerField } from "@/app/lib/definitions";

export const metadata: Metadata = {
  title: "Create Customers"
}

export default async function Page() {
  const customers: CustomerField[] = await fetchCustomers();
  const avatars = customers.map((customer) => customer.image_url);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customers', href: '/dashboard/customers' },
          {
            label: 'Create Customer',
            href: '/dashboard/customers/create',
            active: true,
          },
        ]}
      />
      <Form avatars={avatars} />
    </main>
  );
}