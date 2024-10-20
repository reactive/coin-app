// Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
export const formatPrice = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
export const formatLargePrice = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumSignificantDigits: 4,
  minimumSignificantDigits: 4,
});

const numberFormatter = (value: number) =>
  Intl.NumberFormat('en').format(value);

const currencyFormatter = (value: number) => formatPrice.format(value);

const percentageFormatter = (value: number) =>
  Intl.NumberFormat('en', {
    style: 'percent',
    minimumFractionDigits: 2,
    signDisplay: 'exceptZero',
  }).format(value);

const defaultFormatter = (value: number) => `${value}`;

export const formatters = {
  default: defaultFormatter,
  number: numberFormatter,
  currency: currencyFormatter,
  percentage: percentageFormatter,
};
