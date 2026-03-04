import { readFileSync } from "node:fs";
import { join } from "node:path";

const htmlPath = join(process.cwd(), "src/content/qyzmet-home.html");
const cssPath = join(process.cwd(), "src/content/qyzmet-home.css");

const html = readFileSync(htmlPath, "utf-8");
const css = readFileSync(cssPath, "utf-8");

export function HomeExact() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div
        className="qyzmet-exact-root"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
