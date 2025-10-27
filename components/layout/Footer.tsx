//Footer
export function Footer() {
  return (
    <footer className="border-t py-4">
      <div className="container max-w-6xl mx-auto px-4">
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Blog Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
