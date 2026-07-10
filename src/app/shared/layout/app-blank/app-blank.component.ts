import { NgTemplateOutlet } from '@angular/common';
import { Component, TemplateRef, contentChild, inject, input } from '@angular/core';
import { SidebarService } from '@shared/services/sidebar.service';

@Component({
  selector: 'app-blank',
  imports: [NgTemplateOutlet],
  templateUrl: './app-blank.component.html',
})
export class AppBlankComponent {
  protected readonly sidebarService = inject(SidebarService);

  headerTemplate = contentChild<TemplateRef<any>>('header');

  title = input.required<string>();
}
