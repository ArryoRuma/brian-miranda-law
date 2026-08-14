/* Quiet Authority: editorial estate-planning landing page with asymmetric reading rhythm, paper-toned panels, brass rules, and restrained motion. */
import { HomeFooter } from "./home/HomeFooter";
import { HomeHeader } from "./home/HomeHeader";
import { HomeSections } from "./home/HomeSections";

export default function Home() {
  return (
    <div className="site-shell">
      <HomeHeader />
      <HomeSections />
      <HomeFooter />
    </div>
  );
}
