import { Component } from '@angular/core';
import { PshTableComponent } from '@lib/components/table/table.component';
import { TableColumn, TableRow } from '@lib/components/table/table.types';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';

@Component({
  selector: 'ds-tables-demo',
  imports: [PshTableComponent, DemoPageLayoutComponent],
  templateUrl: './tables-demo.component.html',
  styleUrls: ['./tables-demo.component.css']
})
export class TablesDemoComponent {
  basicColumns: TableColumn[] = [
    { key: 'id', label: 'ID', width: '80px', sortable: false },
    { key: 'name', label: 'Nom', sortable: false },
    { key: 'email', label: 'Email', sortable: false }
  ];

  basicData: TableRow[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
  ];

  compactColumns: TableColumn[] = [
    { key: 'id', label: 'ID', width: '60px' },
    { key: 'status', label: 'Statut', width: '100px' }
  ];

  compactData: TableRow[] = [
    { id: 1, status: 'Actif' },
    { id: 2, status: 'Inactif' },
    { id: 3, status: 'En attente' }
  ];

  sortableColumns: TableColumn[] = [
    { key: 'id', label: 'ID', width: '80px', sortable: true },
    { key: 'name', label: 'Nom', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Rôle', sortable: true },
    { key: 'status', label: 'Statut', sortable: true }
  ];

  extendedData: TableRow[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Actif' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Éditeur', status: 'Actif' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Utilisateur', status: 'Inactif' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Éditeur', status: 'Actif' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Utilisateur', status: 'En attente' },
    { id: 6, name: 'Diana Prince', email: 'diana@example.com', role: 'Admin', status: 'Actif' },
    { id: 7, name: 'Ethan Hunt', email: 'ethan@example.com', role: 'Utilisateur', status: 'Actif' },
    { id: 8, name: 'Fiona Gallagher', email: 'fiona@example.com', role: 'Éditeur', status: 'Inactif' }
  ];
}
