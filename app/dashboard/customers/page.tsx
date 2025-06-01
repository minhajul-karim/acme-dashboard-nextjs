import React, { Suspense } from "react";
import Search from "@/app/ui/search";
import { Metadata } from "next";
import { montserrat } from "@/app/ui/fonts";
import { CreateCustomer } from "@/app/ui/invoices/buttons";
import CustomersTable from "@/app/ui/customers/table";
import { CustomersTableSkeleton } from "@/app/ui/skeletons";
import { fetchCustomersPages } from "@/app/lib/data";
import Pagination from "@/app/ui/invoices/pagination";

export const metadata: Metadata = {
  title: "Customers",
};

export default async function Customers(props: {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPagesResult = await fetchCustomersPages(query);
  const totalPages = typeof totalPagesResult === "number" ? totalPagesResult : 0;

  return (
    <div>
      <h1 className={`${montserrat.className} text-2xl`}>Customers</h1>
      <div className="mt-4 md:mt-8 flex justify-between items-center gap-2">
        <Search placeholder="Search customers..." />
        <CreateCustomer />
      </div>
      <Suspense fallback={<CustomersTableSkeleton />}>
        <CustomersTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
