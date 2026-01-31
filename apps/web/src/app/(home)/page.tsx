import Header from "@/components/shared/header/header";
import SiteLogo from "@/components/shared/site.logo";
import CtaButtons from "./_components/cta/cta.buttons";
import { Card } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import VehiclesCounts from "./_components/stats-section/vehicles-counts";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      {/* Hero Section */}
      <section id="compare-section" className="py-20 px-4">
        <div className="container mx-auto text-center">
          {/* Logo */}
          <SiteLogo />

          {/* Main heading */}
          <div className="max-w-4xl mx-auto mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-balance mb-6">
              The complete platform to{" "}
              <span className="text-primary">compare vehicles</span>
            </h1>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Your team&apos;s toolkit to stop searching and start comparing.
              Securely find, analyze, and track the best automotive deals with
              CARMA.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <CtaButtons />
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Paste any vehicle listing URL to get started
            </p>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-16 px-4 border-t border-border/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="text-center p-6">
              {/* Vehicles counts */}
              <VehiclesCounts />
              <div className="text-sm text-muted-foreground mb-1">
                vehicles tracked
              </div>
              <div className="text-xs text-muted-foreground">daily updates</div>
            </Card>
            <Card className="text-center p-6">
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <div className="text-sm text-muted-foreground mb-1">
                accuracy rate
              </div>
              <div className="text-xs text-muted-foreground">
                price predictions
              </div>
            </Card>
            <Card className="text-center p-6">
              <div className="text-3xl font-bold text-primary mb-2">$2.5M</div>
              <div className="text-sm text-muted-foreground mb-1">
                saved by users
              </div>
              <div className="text-xs text-muted-foreground">
                in negotiations
              </div>
            </Card>
            <Card className="text-center p-6">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground mb-1">
                monitoring
              </div>
              <div className="text-xs text-muted-foreground">price changes</div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
