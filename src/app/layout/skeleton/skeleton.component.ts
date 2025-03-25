import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { DynamicComponentDirective } from 'src/app/directives/dynamic-component.directive';
import { NavigationComponent } from '../navigation/navigation.component';
import { NavigationLoggedComponent } from '../navigation-logged/navigation-logged.component';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss']
})
export class SkeletonComponent implements AfterViewInit {
  @ViewChild(DynamicComponentDirective, { static: true }) dynamic!: DynamicComponentDirective;

  ngAfterViewInit(): void {
    const navigation = localStorage.getItem("loggedUser") === "y" ? 1 : 0;
    this.generateComponent(navigation);
  }

  generateComponent(idx: number): void {
    const viewContainerRef = this.dynamic.ViewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent<any>(this.NAVIGATIONS[idx].component);
  }

  NAVIGATIONS = [
    { component: NavigationComponent },
    { component: NavigationLoggedComponent }
  ];
}
