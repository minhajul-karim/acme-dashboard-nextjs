import React from "react";

export default async function Invoices() {
  const postsPromise = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts = await postsPromise.json();
  console.log(posts)
  return <p>Invoices Page</p>;
}
