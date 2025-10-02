const HTML_SPECIAL_CHARACTERS_REGEX = /[<>&\u2028\u2029]/g;
const ESCAPE_LOOKUP: Record<string, string> = {
  "<": "\\u003c",
  ">": "\\u003e",
  "&": "\\u0026",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029",
};

const SCRIPT_TAG_PATTERN = /<\/?script/gi;

const escapeCharacter = (character: string) => {
  return ESCAPE_LOOKUP[character] ?? character;
};

export const serializeJsonForHtml = (value: unknown) => {
  const json = JSON.stringify(value);

  if (typeof json !== "string") {
    return "";
  }

  return json.replace(HTML_SPECIAL_CHARACTERS_REGEX, escapeCharacter);
};

export const assertNoScriptTag = (value: string, context: string) => {
  if (SCRIPT_TAG_PATTERN.test(value)) {
    throw new Error(`Unsafe <script> tag detected while serializing ${context}`);
  }
};

export const serializeJsonWithGuard = (value: unknown, context: string) => {
  const json = serializeJsonForHtml(value);

  assertNoScriptTag(json, context);

  return json;
};
