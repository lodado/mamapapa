import Script from "next/script";

function code() {
  var vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", vh + "px");

  window.addEventListener("resize", code);
}

const ScreenVhScript = ({ nonce }: { nonce: string }) => {
  return <script type="text/javascript" nonce={nonce} dangerouslySetInnerHTML={{ __html: `(${code})();` }} />;
};

export default ScreenVhScript;
