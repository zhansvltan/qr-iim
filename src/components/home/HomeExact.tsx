import { HomeExactAdvantages } from "./HomeExactAdvantages";
import { HomeExactHero } from "./HomeExactHero";
import { HomeExactNavbar } from "./HomeExactNav";
import { HomeExactSteps } from "./HomeExactSteps";
import { HomeExactSupportButton } from "./HomeExactSupportButton";

export function HomeExact() {
  return (
    <>
      <main id="main" className="main">
        <HomeExactNavbar/>
        <HomeExactHero />
        <HomeExactSteps />
        <HomeExactAdvantages />
      </main>
      <HomeExactSupportButton />
    </>
  );
}
