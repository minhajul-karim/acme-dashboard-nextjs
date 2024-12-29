interface Prop {
  errors: string[] | undefined;
}

export default function ErrorMessage({ errors }: Prop) {
  return (
    <div id="customer-id-error" aria-live="polite" aria-atomic="true">
      {Array.isArray(errors) && errors.map((errorMessage: string) => {
        return (
          <p key={errorMessage} className="mt-2 text-sm text-red-500">
            {errorMessage}
          </p>
        );
      })}
    </div>
  );
}
