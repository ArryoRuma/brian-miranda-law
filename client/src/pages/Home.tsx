/* Quiet Authority: editorial estate-planning landing page with asymmetric reading rhythm, paper-toned panels, brass rules, and restrained motion. */
import { HomeFooter } from "./home/HomeFooter";
import { HomeHeader } from "./home/HomeHeader";
import { HomeSections } from "./home/HomeSections";
import { PageMeta } from "@/components/site/PageMeta";

export default function Home() {
  return (
    <div className="site-shell">
      <PageMeta
        title="Estate Planning in North Jersey"
        description="Miranda Law provides clear guidance for wills, trusts, powers of attorney, and health care directives in English, Spanish, and Portuguese."
        path="/"
      />
      <HomeHeader /> 
      <HomeSections />
      <HomeFooter />
    </div>
  );
}
