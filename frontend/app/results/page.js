import React, { Suspense } from "react";
import ResultsPage from "./results";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading results...</div>}>
      <ResultsPage />
    </Suspense>
  );
}
