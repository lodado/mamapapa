import Script from "next/script";

function code() {
  // Safe area insets
  const safeAreaTop = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--safe-area-top")) || 0;
  const safeAreaBottom =
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--safe-area-bottom")) || 0;

  // Calculate vh minus safe areas
  const adjustedVh = (window.innerHeight - safeAreaTop - safeAreaBottom) * 0.01;

  document.documentElement.style.setProperty("--vh", adjustedVh + "px");

  window.addEventListener("resize", code);
}

const ScreenVhScript = ({ nonce }: { nonce: string }) => {
  return <script type="text/javascript" nonce={nonce} dangerouslySetInnerHTML={{ __html: `(${code})();` }} />;
};

export default ScreenVhScript;
