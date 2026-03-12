import { ChangeDetectionStrategy, Component, TemplateRef, viewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { PshTableComponent } from '@lib/components/table/table.component';
import { TableColumn, TableRow } from '@lib/components/table/table.types';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';

@Component({
  selector: 'ds-tables-demo',
  imports: [PshTableComponent, DemoPageLayoutComponent],
  templateUrl: './tables-demo.component.html',
  styleUrls: ['./tables-demo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  layoutColumns: TableColumn[] = [
    { key: 'id', label: 'ID', width: '8%' },
    { key: 'project', label: 'Projet', width: '18%' },
    { key: 'description', label: 'Description', width: '40%' },
    { key: 'manager', label: 'Responsable', width: '17%' },
    { key: 'status', label: 'Statut', width: '17%' }
  ];

  layoutData: TableRow[] = [
    {
      id: 1,
      project: 'Migration Infrastructure Cloud',
      description: 'Migration complète de l\'infrastructure on-premise vers AWS incluant la refonte des pipelines CI/CD, la mise en place de Kubernetes et la configuration des services managés.',
      manager: 'Marie-Claire Dupont-Martin',
      status: 'En cours de développement'
    },
    {
      id: 2,
      project: 'Refonte Application Mobile',
      description: 'Développement d\'une nouvelle version de l\'application mobile avec support iOS et Android, intégration des notifications push et synchronisation temps réel des données utilisateur.',
      manager: 'Jean-Philippe Beaumont',
      status: 'Phase de validation'
    },
    {
      id: 3,
      project: 'Système Analytics',
      description: 'Mise en place d\'un système complet d\'analyse des données comportementales avec tableaux de bord personnalisés, exports automatisés et alertes configurables selon les seuils définis.',
      manager: 'Sophie Lefebvre-Moreau',
      status: 'En attente de ressources'
    },
    {
      id: 4,
      project: 'API Gateway v2',
      description: 'Évolution de la passerelle API avec gestion avancée du rate limiting, authentification OAuth 2.0 et OpenID Connect, monitoring en temps réel et documentation Swagger automatique.',
      manager: 'Thomas Petit',
      status: 'Déployé en production'
    }
  ];

  expandColumns: TableColumn[] = [
    { key: 'name', label: 'Département' },
    { key: 'manager', label: 'Responsable' },
    { key: 'headcount', label: 'Effectif' }
  ];

  expandData: TableRow[] = [
    {
      id: 1, name: 'Ingénierie', manager: 'Alice Martin', headcount: 12,
      children: [
        { id: 11, name: 'Frontend', manager: 'Bob Dupont', headcount: 5 },
        { id: 12, name: 'Backend', manager: 'Claire Moreau', headcount: 4 },
        { id: 13, name: 'DevOps', manager: 'David Petit', headcount: 3 }
      ]
    },
    {
      id: 2, name: 'Design', manager: 'Emma Lefebvre', headcount: 6,
      children: [
        { id: 21, name: 'UX Research', manager: 'François Blanc', headcount: 2 },
        { id: 22, name: 'UI Design', manager: 'Gabrielle Roux', headcount: 4 }
      ]
    },
    {
      id: 3, name: 'Marketing', manager: 'Hugo Bernard', headcount: 8,
      children: [
        { id: 31, name: 'Digital', manager: 'Isabelle Thomas', headcount: 5 },
        { id: 32, name: 'Communication', manager: 'Julien Richard', headcount: 3 }
      ]
    }
  ];

  expandDetailColumns: TableColumn[] = [
    { key: 'name', label: 'Projet' },
    { key: 'status', label: 'Statut' },
    { key: 'progress', label: 'Progression' }
  ];

  expandDetailData: TableRow[] = [
    { id: 1, name: 'Refonte UI', status: 'En cours', progress: '65%', detail: 'Migration vers Angular 21 avec le nouveau design system. Inclut la refonte complète de l\'interface utilisateur et l\'optimisation des performances.' },
    { id: 2, name: 'API v3', status: 'Planifié', progress: '10%', detail: 'Nouvelle version de l\'API REST avec support GraphQL. Amélioration de la documentation et ajout de webhooks.' },
    { id: 3, name: 'App Mobile', status: 'Terminé', progress: '100%', detail: 'Application mobile cross-platform déployée sur iOS et Android. Synchronisation temps réel des données.' }
  ];
}
