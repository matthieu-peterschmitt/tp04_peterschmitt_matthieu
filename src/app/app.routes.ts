import type { Routes } from "@angular/router";

export const routes: Routes = [
	{
		path: "",
		redirectTo: "/pollutions",
		pathMatch: "full",
	},
	{
		path: "pollutions",
		loadComponent: () =>
			import("./components/pollution-list/pollution-list.component").then(
				(m) => m.PollutionListComponent,
			),
	},
	{
		path: "pollution/new",
		loadComponent: () =>
			import("./components/pollution-form/pollution-form.component").then(
				(m) => m.PollutionFormComponent,
			),
	},
	{
		path: "pollution/:id",
		loadComponent: () =>
			import("./components/pollution-detail/pollution-detail.component").then(
				(m) => m.PollutionDetailComponent,
			),
	},
	{
		path: "pollution/:id/edit",
		loadComponent: () =>
			import("./components/pollution-edit/pollution-edit.component").then(
				(m) => m.PollutionEditComponent,
			),
	},
	{
		path: "**",
		redirectTo: "/pollutions",
	},
];
