export default function Landing({
  onFile,
  error,
}: {
  onFile: (file: File) => void;
  error: string | null;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center border-b border-black px-10 py-8">
        <span className="text-xl font-semibold">Fin-</span>
      </header>
      <main className="flex flex-1 items-center px-10">
        <div>
          <h1 className="text-4xl font-semibold">Upload your spending</h1>
          <p className="mt-2">Choose a Chase card activity CSV. It is parsed in your browser and never uploaded.</p>
          <input
            type="file"
            accept=".csv"
            className="mt-8 block w-full max-w-md cursor-pointer border border-black p-3 text-sm file:mr-4 file:border-0 file:bg-black file:px-4 file:py-2 file:text-white"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = ""; // lets the same file be re-selected after an error
              if (file) onFile(file);
            }}
          />
          {error && (
            <p role="alert" className="mt-4 max-w-md border border-black p-3 text-sm">
              {error}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
