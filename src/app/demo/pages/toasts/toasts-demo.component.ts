import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PshButtonComponent } from '@lib/components';
import { PshToastService } from '@lib/components/toast/toast.service';
import type { ToastPosition, ToastType } from '@lib/components/toast/toast.types';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-toasts-demo',
  imports: [TranslateModule, PshButtonComponent, DemoPageLayoutComponent, CodeSnippetComponent],
  templateUrl: './toasts-demo.component.html',
  styleUrls: ['./toasts-demo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastsDemoComponent {
  private toastService = inject(PshToastService);

  infoToastCode = `this.toastService.show({
  message: 'Nouvelle information',
  color: 'info',
  duration: 3000
});`;

  successToastCode = `this.toastService.show({
  message: 'Opération réussie',
  color: 'success',
  duration: 3000
});`;

  warningToastCode = `this.toastService.show({
  message: 'Attention requise',
  color: 'warning',
  duration: 3000
});`;

  dangerToastCode = `this.toastService.show({
  message: 'Erreur critique',
  color: 'danger',
  duration: 3000
});`;

  persistentToastCode = `this.toastService.show({
  message: 'Toast persistant',
  color: 'warning',
  duration: 0  // 0 = ne disparaît pas
});`;

  positionToastCode = `this.toastService.setPosition('top-right');

this.toastService.show({
  message: 'Notification positionnée',
  color: 'info'
});`;

  standardToastCode = `this.toastService.show({
  message: 'Opération réussie',
  color: 'success',
  duration: 5000,
  showCloseButton: true
});`;

  autoOnlyToastCode = `this.toastService.show({
  message: 'Message important',
  color: 'info',
  duration: 5000,
  showCloseButton: false
});`;

  manualOnlyToastCode = `this.toastService.show({
  message: 'Action critique requise',
  color: 'warning',
  duration: 0,
  showCloseButton: true
});`;

  showToast(variant: ToastType): void {
    // Partial since 7.0.0: the colour union is the same seven values everywhere, and this
    // demo only has copy for the four it used to be limited to.
    const messages: Partial<Record<ToastType, string>> = {
      info: 'Nouvelle information disponible',
      success: 'Opération effectuée avec succès',
      warning: 'Veuillez vérifier avant de continuer',
      danger: 'Une erreur est survenue'
    };

    this.toastService.show({
      message: messages[variant] ?? '',
      color: variant,
      duration: 3000,
    });
  }

  showCustomToast(icon: string, type: ToastType, message: string): void {
    this.toastService.show({
      message,
      color: type,
      icon,
      duration: 4000,
    });
  }

  showDurationToast(duration: number): void {
    const seconds = duration / 1000;
    this.toastService.show({
      message: `Ce toast s'affiche pendant ${seconds} secondes`,
      color: 'info',
      duration,
    });
  }

  showPersistentToast(): void {
    this.toastService.show({
      message: 'Ce toast ne disparaîtra pas automatiquement. Fermez-le manuellement.',
      color: 'warning',
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
      color: 'info',
      duration: 3000,
    });
  }

  showMultipleToasts(): void {
    const messages = [
      { message: 'Premier toast', color: 'info' as ToastType },
      { message: 'Deuxième toast', color: 'success' as ToastType },
      { message: 'Troisième toast', color: 'warning' as ToastType },
      { message: 'Quatrième toast', color: 'danger' as ToastType }
    ];

    messages.forEach((toast, index) => {
      setTimeout(() => {
        this.toastService.show({
          message: toast.message,
          color: toast.color,
          duration: 5000
        });
      }, index * 300);
    });
  }

  showHoverToast(): void {
    this.toastService.show({
      message: 'Survolez ce toast avec votre souris pour mettre en pause le timer de fermeture automatique',
      color: 'info',
      duration: 8000,
    });
  }

  showToastWithIcon(): void {
    this.toastService.show({
      message: 'Toast avec icône automatique selon le type',
      color: 'success',
      duration: 3000,
    });
  }

  showClosableToast(): void {
    this.toastService.show({
      message: 'Utilisez le bouton de fermeture ou la touche Escape pour fermer ce toast',
      color: 'warning',
      duration: 10000,
    });
  }

  showAutoOnlyToast(): void {
    this.toastService.show({
      message: 'Ce toast se fermera automatiquement après 5 secondes. Pas de bouton de fermeture manuelle.',
      color: 'info',
      duration: 5000,
      showCloseButton: false,
    });
  }

  showManualOnlyToast(): void {
    this.toastService.show({
      message: 'Ce toast persistant nécessite une fermeture manuelle. Cliquez sur la croix pour le fermer.',
      color: 'warning',
      duration: 0,
      showCloseButton: true,
    });
  }

  showStandardToast(): void {
    this.toastService.show({
      message: 'Toast standard avec fermeture automatique après 5s OU fermeture manuelle avec le bouton.',
      color: 'success',
      duration: 5000,
      showCloseButton: true,
    });
  }
}
