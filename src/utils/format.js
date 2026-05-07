// Utility functions for formatting and parsing (Argentina locale)

export function parse(str) {
  if (!str) return 0;
  str = String(str).trim().replace(/^\$/, '').replace(/\s/g, '');
  if (str.indexOf('.') !== -1 && str.indexOf(',') !== -1) {
    str = str.replace(/\./g, '').replace(',', '.');
  } else if (str.indexOf(',') !== -1) {
    str = str.replace(',', '.');
  }
  const n = parseFloat(str);
  return isNaN(n) ? 0 : n;
}

export function fmt(n) {
  if (!n || isNaN(n)) n = 0;
  return '$' + n.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export function randId(len) {
  let r = '';
  for (let i = 0; i < len; i++) r += Math.floor(Math.random() * 10);
  return r;
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function randCAE() {
  return String(Math.floor(Math.random() * 90000000000000 + 10000000000000));
}
