import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TestHelperService {
  private counter = new Map<string, number>();
  private instanceIds = new Map<string, string>();

  /**
   * Génère un ID de test unique pour un composant
   * @param component - Nom du composant
   * @param variant - Variante du composant (optionnel)
   * @param state - État du composant (optionnel)
   * @returns Un ID unique au format component-variant-state-instanceId
   */
  
  generateTestId(component: string, variant?: string, state?: string): string {
    // Créer une clé unique pour ce type de composant
    const key = `${component}${variant ? `-${variant}` : ''}${state ? `-${state}` : ''}`;
    
    // Incrémenter ou initialiser le compteur pour cette clé
    const currentCount = this.counter.get(key) || 0;
    const newCount = currentCount + 1;
    this.counter.set(key, newCount);

    // Générer un ID d'instance unique et stable
    const instanceKey = `${key}-${newCount}`;
    if (!this.instanceIds.has(instanceKey)) {
      // Générer un ID hexadécimal unique basé sur le hash de la clé
      const hash = this.hashCode(instanceKey).toString(16);
      this.instanceIds.set(instanceKey, hash);
    }

    // Récupérer l'ID d'instance
    const instanceId = this.instanceIds.get(instanceKey);

    // Construire l'ID final
    return `${key}-${instanceId}-${newCount}`;
  }

  /**
   * Réinitialise les compteurs et les IDs d'instance (utile pour les tests)
   */
  reset(): void {
    this.counter.clear();
    this.instanceIds.clear();
  }

  /**
   * Vérifie si un ID est unique
   * @param id - ID à vérifier
   * @returns true si l'ID est unique
   */
  isUnique(id: string): boolean {
    if (!id) return false;
    const parts = id.split('-');
    if (parts.length < 3) return false;
    
    // Reconstruire la clé de base (component-variant-state)
    const baseKey = parts.slice(0, -2).join('-');
    if (!baseKey) return false;
    
    const count = this.counter.get(baseKey) || 0;
    return count === 1;
  }

  /**
   * Récupère le nombre d'instances d'un composant
   * @param component - Nom du composant
   * @returns Nombre d'instances
   */
  getInstanceCount(component: string): number {
    if (!component) return 0;
    return this.counter.get(component) || 0;
  }

  /**
   * Génère un hash numérique à partir d'une chaîne
   * @param str - Chaîne à hasher
   * @returns Hash numérique
   */
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Conversion en 32 bits
    }
    return Math.abs(hash);
  }
}