import { ScrollWheel } from "@/components/shared/scroll-wheel";
import { logos } from "./data";

export default function LogoScrolling() {
  return (
    <div className="container mx-auto">
      <ScrollWheel items={logos} />
    </div>
  );
}
