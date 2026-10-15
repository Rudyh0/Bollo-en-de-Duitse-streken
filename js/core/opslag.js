// Veilige toegang tot localStorage (kan ontbreken in privévensters of als cookies geblokkeerd zijn).
const geheugen = new Map();

export function lees(sleutel, standaard = null) {
  try {
    const ruw = window.localStorage.getItem(sleutel);
    if (ruw === null) return geheugen.has(sleutel) ? geheugen.get(sleutel) : standaard;
    return JSON.parse(ruw);
  } catch (e) {
    return geheugen.has(sleutel) ? geheugen.get(sleutel) : standaard;
  }
}

export function schrijf(sleutel, waarde) {
  geheugen.set(sleutel, waarde);
  try {
    window.localStorage.setItem(sleutel, JSON.stringify(waarde));
    return true;
  } catch (e) {
    return false;
  }
}

export function wis(sleutel) {
  geheugen.delete(sleutel);
  try {
    window.localStorage.removeItem(sleutel);
  } catch (e) { /* niets */ }
}
