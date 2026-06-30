import { ChangeDetectionStrategy, Component } from "@angular/core";
// import { GridShapeComponent } from '../../components/common/grid-shape/grid-shape.component';
import { RouterModule } from "@angular/router";
import { ThemeToggleTwo } from "@shared/components/theme-toggle-two/theme-toggle-two";

@Component({
  selector: "auth-layout",
  imports: [
    // GridShapeComponent,
    RouterModule,
    ThemeToggleTwo
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./auth.layout.html",
})
export class AuthLayout {}
