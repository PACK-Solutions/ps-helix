import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PshAvatarComponent } from '@lib/components/avatar/avatar.component';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-avatar-demo',
  imports: [TranslateModule, PshAvatarComponent, DemoPageLayoutComponent, CodeSnippetComponent],
  templateUrl: './avatar-demo.component.html',
  styleUrls: ['./avatar-demo.component.css']
})
export class AvatarDemoComponent {
  title = 'Avatar';
  introText =
    'Les avatars représentent des utilisateurs ou des entités via des images, des initiales ou des icônes.';

  avatarImageCode = `<psh-avatar
  src="https://example.com/avatar.jpg"
  alt="John Doe"
/>`;

  avatarInitialsCode = `<psh-avatar
  initials="JD"
  alt="John Doe"
/>`;

  avatarIconCode = `<psh-avatar
  icon="user"
  alt="Utilisateur"
/>`;

  fullExampleCode = `import { PshAvatarComponent } from 'ps-helix';

@Component({
  imports: [PshAvatarComponent],
  template: \`
    <psh-avatar
      src="https://example.com/avatar.jpg"
      alt="John Doe"
      size="large"
      shape="circle"
      status="online"
      ariaLabel="Photo de profil de John Doe, en ligne"
    />
  \`
})
export class MyComponent {}`;

  handleSizeChange(size: string): void {
    console.log('Size changed:', size);
  }

  handleShapeChange(shape: string): void {
    console.log('Shape changed:', shape);
  }
}