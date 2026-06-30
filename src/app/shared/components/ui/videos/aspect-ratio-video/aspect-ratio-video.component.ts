import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-aspect-ratio-video',
  imports: [
    CommonModule,
  ],
  templateUrl: './aspect-ratio-video.component.html',
  styles: ``
})
export class AspectRatioVideoComponent {

  videoUrl = input.required<string>();
  aspectRatio = input('video');
  title = input('Embedded Video');

  get aspectRatioClass(): string {
    return `aspect-${this.aspectRatio()}`;
  }
}
