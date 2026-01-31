import { Card } from "@/components/ui/card";
import { Shield, Zap, Target } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-balance mb-6">
              Faster comparison. More savings.
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              The platform for smart car shopping. Let your research focus on
              finding deals instead of managing spreadsheets with automated
              price tracking, built-in analytics, and integrated comparison
              tools.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <span className="text-foreground">Verified dealer network</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <span className="text-foreground">Real-time price updates</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <span className="text-foreground">
                  Smart matching algorithm
                </span>
              </div>
            </div>
          </div>
          <div className="relative">
            <Card className="p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Search Results
                  </span>
                  <span className="text-xs text-primary">Live</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div>
                      <div className="font-medium">2023 Tesla Model 3</div>
                      <div className="text-sm text-muted-foreground">
                        Long Range AWD
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">$42,990</div>
                      <div className="text-xs text-gain">-$3,000</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div>
                      <div className="font-medium">2023 BMW 330i</div>
                      <div className="text-sm text-muted-foreground">
                        Sport Package
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">$45,200</div>
                      <div className="text-xs text-loss">+$1,200</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div>
                      <div className="font-medium">2023 Audi A4</div>
                      <div className="text-sm text-muted-foreground">
                        Premium Plus
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">$43,800</div>
                      <div className="text-xs text-neutral">No change</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
