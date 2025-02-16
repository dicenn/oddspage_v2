export const formatPrice = (price) => {
  if (!price && price !== 0) return '-';
  return price > 0 ? `+${price}` : price.toString();
};