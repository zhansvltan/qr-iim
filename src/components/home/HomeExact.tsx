import { HomeExactAdvantages } from "./HomeExactAdvantages";
import { HomeExactHero } from "./HomeExactHero";
import { HomeExactSteps } from "./HomeExactSteps";
import { HomeExactSupportButton } from "./HomeExactSupportButton";

export function HomeExact() {
  return (
    <>
      <main id="main" className="main">
        <HomeExactHero />
        <HomeExactSteps />
        <HomeExactAdvantages />
      </main>
      <HomeExactSupportButton />
    </>
  );
}
