import React from 'react';

const ROTULOS = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  descartado: 'Descartado',
};

export default function SeloStatus({ status }) {
  return <span className={`selo selo-${status}`}>{ROTULOS[status] || status}</span>;
}
