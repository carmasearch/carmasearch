import HeaderMenu from "./header.menu";

export default function Header() {
  return (
    <header className="border-b border-border/20 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Hamburger menu button - visible on all screen sizes */}
          <HeaderMenu />
        </div>
      </div>
    </header>
  );
}
