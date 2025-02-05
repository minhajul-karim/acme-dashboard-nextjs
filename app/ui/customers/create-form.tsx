export default function Form({ avatars }: { avatars: string[] }) {
  return (
    <form>
      {/* Customer name */}
      <div className="mb-4">
        <label
          htmlFor="customerName"
          className="mb-4 block text-sm font-medium"
        >
          Customer Name
        </label>
        <input
          type="text"
          id="customerName"
          name="customerName"
          placeholder="Enter customer name"
          aria-describedby="customer-name-error"
          className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
        />
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
          type="email"
          id="customerEmail"
          name="customerName"
          placeholder="Enter customer email"
          aria-describedby="customer-email-error"
          className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
        />
      </div>
      {/* Customer avatar */}
      <div className="mb-4">
        <label htmlFor="avatar" className="mb-4 block text-sm font-medium">
          Customer Avatar
        </label>
        <select
          id="avatar"
          name="avatar"
          defaultValue=""
          aria-describedby="customer-avatar-error"
        >
          <option value="" disabled>
            Select an avatar
          </option>
          {avatars.map((avatar) => (
            <option key={avatar} value={avatar}>
              {avatar}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}
