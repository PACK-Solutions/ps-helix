import { Component, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PshTagComponent } from '@lib/components/tag/tag.component';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { PshButtonComponent } from '@lib/components/button/button.component';
import { TagVariant } from '@lib/components/tag/tag.types';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

interface ClosableTag {
  id: string;
  variant: TagVariant;
  icon?: string;
  labelKey: string;
}

@Component({
  selector: 'ds-tags-demo',
  imports: [TranslateModule, PshTagComponent, DemoPageLayoutComponent, PshButtonComponent, CodeSnippetComponent],
  templateUrl: './tags-demo.component.html',
  styleUrls: ['./tags-demo.component.css']
})
export class TagsDemoComponent {
  readonly initialClosableTags: ClosableTag[] = [
    { id: 'tag-1', variant: 'primary', labelKey: 'TAG.VARIANTS.DEFAULT' },
    { id: 'tag-2', variant: 'success', icon: 'check-circle', labelKey: 'TAG.VARIANTS.SUCCESS' },
    { id: 'tag-3', variant: 'warning', icon: 'bell', labelKey: 'TAG.STATES.PENDING' },
    { id: 'tag-4', variant: 'danger', labelKey: 'TAG.VARIANTS.DANGER' }
  ];

  closableTags = signal<ClosableTag[]>([...this.initialClosableTags]);

  handleTagClose(tagId: string): void {
    this.closableTags.update(tags => tags.filter(tag => tag.id !== tagId));
  }

  resetClosableTags(): void {
    this.closableTags.set([...this.initialClosableTags]);
  }

  primaryTagCode = `<psh-tag
  variant="primary"
>
  Tag principal
</psh-tag>`;

  secondaryTagCode = `<psh-tag
  variant="secondary"
>
  Tag secondaire
</psh-tag>`;

  successTagCode = `<psh-tag
  variant="success"
>
  Succès
</psh-tag>`;

  warningTagCode = `<psh-tag
  variant="warning"
>
  Attention
</psh-tag>`;

  dangerTagCode = `<psh-tag
  variant="danger"
>
  Erreur
</psh-tag>`;

  closableTagCode = `<psh-tag
  variant="success"
  [closable]="true"
  (closed)="handleTagClose('myTag')"
>
  Tag fermable
</psh-tag>`;

  handleTagClick(tag: string): void {
    console.log(`Tag clicked: ${tag}`);
  }
}