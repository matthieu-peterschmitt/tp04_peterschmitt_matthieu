import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
	selector: "app-root",
	imports: [CommonModule, RouterOutlet, RouterLink],
	templateUrl: "./app.html",
	styleUrl: "./app.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
	protected readonly title = "TP3 - Gestion des Pollutions";
}
