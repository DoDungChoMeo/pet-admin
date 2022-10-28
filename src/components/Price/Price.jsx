import React from 'react';
import { formatVietnamCurrency } from '~/utils';

function Price({ children }) {
  return <span>{formatVietnamCurrency(children)}</span>;
}

export default Price;
