import { useLocalizedStringFormatter } from "react-aria/useLocalizedStringFormatter";

import deIntlMessages from "../../intl/de-DE.json" with { type: "json" };
import enIntlMessages from "../../intl/en-US.json" with { type: "json" };
import esIntlMessages from "../../intl/es-ES.json" with { type: "json" };
import frIntlMessages from "../../intl/fr-FR.json" with { type: "json" };
import jaIntlMessages from "../../intl/ja-JP.json" with { type: "json" };

const intlMessages = {
  "de-DE": deIntlMessages,
  "en-US": enIntlMessages,
  "es-ES": esIntlMessages,
  "fr-FR": frIntlMessages,
  "ja-JP": jaIntlMessages,
};

const useLocalizedUiStringFormatter = () => {
  return useLocalizedStringFormatter(intlMessages, "@exifi/ui");
};

export { useLocalizedUiStringFormatter };
