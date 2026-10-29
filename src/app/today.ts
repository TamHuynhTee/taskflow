import { todayIso } from "../utils/date";

// Read today's date once when the module loads. Calling new Date() during render would make
// the component impure (a different result on every render).
export const TODAY = todayIso();
