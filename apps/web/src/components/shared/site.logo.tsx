export default function SiteLogo() {
  return (
    <div className="mb-12 flex justify-center">
      <div className="relative">
        <img
          src="/carma-logo.png"
          alt="CARMA Logo"
          className="w-40 h-40 animate-spin-slow"
          loading="eager"
          decoding="sync"
        />
      </div>
    </div>
  );
}
