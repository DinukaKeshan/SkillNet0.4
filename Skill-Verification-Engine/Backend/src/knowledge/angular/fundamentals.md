Angular is a TypeScript-based framework by Google for building single-page applications.

Angular uses a component-based architecture. Components have a template, class, and styles.

Components are declared with @Component decorator: @Component({ selector: 'app-root', templateUrl: './app.component.html' }).

Modules organize code: @NgModule({ declarations, imports, providers, bootstrap }).

Standalone components (Angular 14+) don't require NgModule: @Component({ standalone: true, imports: [...] }).

Data binding: interpolation {{ }}, property binding [prop], event binding (event), two-way [(ngModel)].

Directives modify DOM: *ngIf, *ngFor, *ngSwitch (structural), [ngClass], [ngStyle] (attribute).

Services are injectable classes decorated with @Injectable({ providedIn: 'root' }).

Dependency Injection (DI) is a core pattern: constructors receive service instances automatically.

The Angular CLI generates components, services, modules: ng generate component my-component.

Angular Router maps URLs to components: { path: 'users/:id', component: UserComponent }.

Route guards protect routes: CanActivate, CanDeactivate, Resolve.

Lazy loading modules: loadChildren: () => import('./feature/feature.module').then(m => m.FeatureModule).

RxJS provides reactive programming with Observables: observable.subscribe(value => { }).

Common RxJS operators: map, filter, switchMap, mergeMap, catchError, debounceTime, distinctUntilChanged.

HttpClient makes HTTP requests: this.http.get<User[]>('/api/users').subscribe(users => { }).

Template-driven forms use ngModel; Reactive forms use FormGroup, FormControl, FormArray.

Reactive forms: this.form = new FormGroup({ name: new FormControl('', Validators.required) });

Pipes transform template data: {{ date | date:'short' }}, {{ price | currency:'USD' }}.

Custom pipes: @Pipe({ name: 'truncate' }) export class TruncatePipe implements PipeTransform { transform(value) { } }.

Lifecycle hooks: ngOnInit, ngOnChanges, ngOnDestroy, ngAfterViewInit, ngDoCheck.

NgRx provides Redux-inspired state management: Store, Actions, Reducers, Effects, Selectors.

Change detection: default checks all components; OnPush checks only on input changes.
