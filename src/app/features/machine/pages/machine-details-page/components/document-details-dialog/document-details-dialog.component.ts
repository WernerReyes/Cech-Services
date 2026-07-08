import { Component, effect, linkedSignal, model } from "@angular/core";
import { SafeUrlPipe } from "@shared/pipe/safe-url.pipe";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";

@Component({
  selector: "app-document-details-dialog",
  standalone: true,
  imports: [DialogModule, ButtonModule, SafeUrlPipe],
  templateUrl: "./document-details-dialog.component.html",
  styleUrl: "./document-details-dialog.component.css",
})
export class DocumentDetailsDialogComponent {
  url = model<string | null>(null);

  visible = linkedSignal(() => this.url() !== null);
  

  private closeDialog = effect(() => {
    if (!this.visible()) {
      this.url.set(null);
    }
  });

  
}
