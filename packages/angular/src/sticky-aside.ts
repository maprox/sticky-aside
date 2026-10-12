import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'sticky-aside',
  template: '<ng-content />',
})
export class StickyAside {}
