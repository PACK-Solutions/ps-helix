import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PshButtonComponent } from '@lib/components';
import { ToastService } from '@lib/components/toast/toast.service';
import type { ToastPosition, ToastType } from '@lib/components/toast/toast.types';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-toasts-demo',
  imports: [TranslateModule, PshButtonComponent, DemoPageLayoutComponent, CodeSnippetComponent],
  templateUrl: './toasts-demo.component.html',
  styleUrls: ['./toasts-demo.component.css'],
})
export class ToastsDemoComponent {
  private toastService = inject(ToastService);

  infoToastCode = `this.toastService.show({
  message: 'Nouvelle information',
  type: 'info',
  duration: 3000
});`;

  successToastCode = `this.toastService.show({
  message: 'Opération réussie',
  type: 'success',
  duration: 3000
});`;

  warningToastCode = `this.toastService.show({
  message: 'Attention requise',
  type: 'warning',
  duration: 3000
});`;

  dangerToastCode = `this.toastService.show({
  message: 'Erreur critique',
  type: 'danger',
  duration: 3000
});`;

  persistentToastCode = `this.toastService.show({
  message: 'Toast persistant',
  type: 'warning',
  duration: 0  // 0 = ne disparaît pas
});`;

  positionToastCode = `this.toastService.setPosition('top-right');

this.toastService.show({
  message: 'Notification positionnée',
  type: 'info'
});`;

  standardToastCode = `this.toastService.show({
  message: 'Opération réussie',
  type: 'success',
  duration: 5000,
  showCloseButton: true
});`;

  autoOnlyToastCode = `this.toastService.show({
  message: 'Message important',
  type: 'info',
  duration: 5000,
  showCloseButton: false
});`;

  manualOnlyToastCode = `this.toastService.show({
  message: 'Action critique requise',
  type: 'warning',
  duration: 0,
  showCloseButton: true
});`;

  showToast(variant: ToastType): void {
    const messages: Record<ToastType, string> = {
      info: 'Nouvelle information disponible',
      success: 'Opération effectuée avec succès',
      warning: 'Veuillez vérifier avant de continuer',
      danger: 'Une erreur est survenue'
    };

    this.toastService.show({
      message: messages[variant],
      type: variant,
      duration: 3000,
    });
  }

  showCustomToast(icon: string, type: ToastType, message: string): void {
    this.toastService.show({
      message,
      type,
      icon,
      duration: 4000,
    });
  }

  showDurationToast(duration: number): void {
    const seconds = duration / 1000;
    this.toastService.show({
      message: `Ce toast s'affiche pendant ${seconds} secondes`,
      type: 'info',
      duration,
    });
  }

  showPersistentToast(): void {
    this.toastService.show({
      message: 'Ce toast ne disparaîtra pas automatiquement. Fermez-le manuellement.',
      type: 'warning',
      duration: 0,
    });
  }

  changePosition(position: ToastPosition): void {
    this.toastService.setPosition(position);

    const positionLabels: Record<ToastPosition, string> = {
      'top-left': 'En haut à gauche',
      'top-right': 'En haut à droite',
      'bottom-left': 'En bas à gauche',
      'bottom-right': 'En bas à droite'
    };

    this.toastService.show({
      message: `Position changée: ${positionLabels[position]}`,
      type: 'info',
      duration: 3000,
    });
  }

  showMultipleToasts(): void {
    const messages = [
      { message: 'Premier toast', type: 'info' as ToastType },
      { message: 'Deuxième toast', type: 'success' as ToastType },
      { message: 'Troisième toast', type: 'warning' as ToastType },
      { message: 'Quatrième toast', type: 'danger' as ToastType }
    ];

    messages.forEach((toast, index) => {
      setTimeout(() => {
        this.toastService.show({
          message: toast.message,
          type: toast.type,
          duration: 5000
        });
      }, index * 300);
    });
  }

  showHoverToast(): void {
    this.toastService.show({
      message: 'Survolez ce toast avec votre souris pour mettre en pause le timer de fermeture automatique',
      type: 'info',
      duration: 8000,
    });
  }

  showToastWithIcon(): void {
    this.toastService.show({
      message: 'Toast avec icône automatique selon le type',
      type: 'success',
      duration: 3000,
    });
  }

  showClosableToast(): void {
    this.toastService.show({
      message: 'Utilisez le bouton de fermeture ou la touche Escape pour fermer ce toast',
      type: 'warning',
      duration: 10000,
    });
  }

  showAutoOnlyToast(): void {
    this.toastService.show({
      message: 'Ce toast se fermera automatiquement après 5 secondes. Pas de bouton de fermeture manuelle.',
      type: 'info',
      duration: 5000,
      showCloseButton: false,
    });
  }

  showManualOnlyToast(): void {
    this.toastService.show({
      message: 'Ce toast persistant nécessite une fermeture manuelle. Cliquez sur la croix pour le fermer.',
      type: 'warning',
      duration: 0,
      showCloseButton: true,
    });
  }

  showStandardToast(): void {
    this.toastService.show({
      message: 'Toast standard avec fermeture automatique après 5s OU fermeture manuelle avec le bouton.',
      type: 'success',
      duration: 5000,
      showCloseButton: true,
    });
  }
}
