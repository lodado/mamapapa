import LayoutEffectVhContainer from "./LayoutEffectVhContainer";
import { createSafeInlineScript, vhCode, viewportCode } from "./utils";

const VH_SCRIPT = createSafeInlineScript(vhCode, "vhCode");
const VIEWPORT_SCRIPT = createSafeInlineScript(viewportCode, "viewportCode");

const ScreenVhScript = ({ nonce }: { nonce: string }) => {
  return (
    <>
      <script type="text/javascript" nonce={nonce} dangerouslySetInnerHTML={{ __html: VH_SCRIPT }} />
      <script type="text/javascript" nonce={nonce} dangerouslySetInnerHTML={{ __html: VIEWPORT_SCRIPT }} />
      <LayoutEffectVhContainer />
    </>
  );
};

export default ScreenVhScript;
