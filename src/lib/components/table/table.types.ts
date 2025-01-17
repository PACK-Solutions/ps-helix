import { TemplateRef } from '@angular/core';

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  template?: TemplateRef<any>;
}

export interface TableRow {
  id: string | number;
  [key: string]: any;
}

export interface TableSort {
  key: string;
  direction: 'asc' | 'desc';
}

export interface TableFilter {
  key: string;
  value: string;
}