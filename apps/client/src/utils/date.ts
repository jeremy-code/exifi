import dayjs, { extend } from "dayjs";
import dayjsCustomParseFormat from "dayjs/plugin/customParseFormat";
import dayjsDevHelper from "dayjs/plugin/devHelper";

extend(dayjsCustomParseFormat);
extend(dayjsDevHelper);

export { dayjs };
