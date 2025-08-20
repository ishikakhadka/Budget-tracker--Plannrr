import EditTransactionForm from "@/components/EditTransactionForm";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <EditTransactionForm />
    </Suspense>
  );
}
