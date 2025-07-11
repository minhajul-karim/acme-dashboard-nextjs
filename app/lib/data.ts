const connectionPool = require("../../db");
import {CustomersTableType, InvoicesTable,} from './definitions';
import {formatCurrency} from './utils';

const isBuildRunning = process.env.SKIP_DB_VALIDATION === "true";

export async function fetchRevenue() {
  if (isBuildRunning) {
    return [];
  }

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await connectionPool.query(`SELECT * FROM revenue`);

    console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  if (isBuildRunning) {
    return [];
  }

  try {
    const data = await connectionPool.query(`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`);

    return data.rows.map((invoice: InvoicesTable) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  if (isBuildRunning) {
    return {
      numberOfCustomers: 0,
      numberOfInvoices: 0,
      totalPaidInvoices: 0,
      totalPendingInvoices: 0,
    };
  }

  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = connectionPool.query(`SELECT COUNT(*) FROM invoices`);
    const customerCountPromise = connectionPool.query(`SELECT COUNT(*) FROM customers`);
    const invoiceStatusPromise = connectionPool.query(`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`);

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  if (isBuildRunning) {
    return [];
  }
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await connectionPool.query(`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE '${`%${query}%`}' OR
        customers.email ILIKE '${`%${query}%`}' OR
        invoices.amount::text ILIKE '${`%${query}%`}' OR
        invoices.date::text ILIKE '${`%${query}%`}' OR
        invoices.status ILIKE '${`%${query}%`}'
      ORDER BY invoices.date DESC
      LIMIT '${ITEMS_PER_PAGE}' OFFSET '${offset}'
    `);

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  if (isBuildRunning) {
    return 0;
  }

  try {
    const count = await connectionPool.query(`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE '${`%${query}%`}' OR
      customers.email ILIKE '${`%${query}%`}' OR
      invoices.amount::text ILIKE '${`%${query}%`}' OR
      invoices.date::text ILIKE '${`%${query}%`}' OR
      invoices.status ILIKE '${`%${query}%`}'
  `);

    return Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  if (isBuildRunning) {
    return [];
  }

  try {
    const data = await connectionPool.query(`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = '${id}';
    `);

    const invoice = data.rows.map((invoice: InvoicesTable) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  if (isBuildRunning) {
    return [];
  }

  try {
    const data = await connectionPool.query(`
      SELECT
        id,
        name,
        image_url
      FROM customers
      ORDER BY name ASC
    `);

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string, currentPage: number) {
  if (isBuildRunning) {
    return [];
  }

  try {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const data = await connectionPool.query(`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE '${`%${query}%`}' OR
        customers.email ILIKE '${`%${query}%`}'
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
    LIMIT '${ITEMS_PER_PAGE}' OFFSET '${offset}'
	  `);

    return data.rows.map((customer: CustomersTableType) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function fetchCustomersPages(query: string) {
  if (isBuildRunning) {
    return 0;
  }

  try {
    const count = await connectionPool.query(`SELECT COUNT(*)
    FROM customers
    WHERE
		  customers.name ILIKE '${`%${query}%`}' OR
        customers.email ILIKE '${`%${query}%`}'
  `);

    return Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of customers.');
  }
}
