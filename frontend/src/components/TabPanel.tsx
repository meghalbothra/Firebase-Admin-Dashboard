import React from 'react';

interface TabPanelProps {
  children: React.ReactNode;
  index: number;
  value: number;
}

export function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      className={value === index ? 'block' : 'hidden'}
    >
      {value === index && children}
    </div>
  );
}