export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
        <p className="text-center text-sm text-muted-foreground">
          Built with Next.js, tRPC, and Drizzle ORM
        </p>
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Blog Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
