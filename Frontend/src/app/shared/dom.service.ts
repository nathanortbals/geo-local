import {
  ApplicationRef,
  ComponentFactoryResolver,
  Injectable,
  Injector,
  NgZone,
  Type,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DomService {
  constructor(
    private injector: Injector,
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private ngZone: NgZone,
  ) {}

  public createComponent<T>(
    component: Type<T>,
    inputs: Partial<T>,
  ): HTMLElement {
    // Create the component factory
    const factory =
      this.componentFactoryResolver.resolveComponentFactory(component);

    // Create a component reference
    const componentRef = factory.create(this.injector);

    // Assign inputs to the component instance
    Object.assign(componentRef.instance as object, inputs);

    // Manually trigger ngOnChanges lifecycle hook
    if (this.hasNgOnChanges(componentRef.instance)) {
      componentRef.instance.ngOnChanges();
    }

    // Attach the component to the application view
    this.appRef.attachView(componentRef.hostView);

    // Ensure change detection is triggered inside Angular's zone
    this.ngZone.run(() => {
      componentRef.changeDetectorRef.detectChanges();
    });

    // Get the DOM element
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const domElement = (componentRef.hostView as any)
      .rootNodes[0] as HTMLElement;

    return domElement;
  }

  // Custom type guard to check if ngOnChanges exists on the component instance
  private hasNgOnChanges(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    instance: any,
  ): instance is { ngOnChanges: () => void } {
    return typeof instance.ngOnChanges === 'function';
  }
}
