import React from "react";
import Search from "@/app/ui/search";
import { Metadata } from "next";
import { montserrat } from "@/app/ui/fonts";
import { CreateCustomer } from "@/app/ui/invoices/buttons";

export const metadata: Metadata = {
  title: "Customers"
}

export default function Customers() {
  return (
    <div>
      <h1 className={`${montserrat.className} text-2xl`}>Customers</h1>
      <div className="mt-4 md:mt-8 flex justify-between items-center gap-2">
        <Search placeholder="Search customers..." />
        <CreateCustomer />
      </div>
    </div>
  );
}
