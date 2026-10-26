import { Component } from '@angular/core';
import { HAS_INFO_SECTION } from '../../../core/info';
import { OrderBar } from '../../../shared/order-bar';
import { Categories } from './sections/categories';
import { Hero } from './sections/hero';
import { HowToOrder } from './sections/how-to-order';
import { InfoColumns } from './sections/info-columns';
import { Intro } from './sections/intro';
import { Promos } from './sections/promos';

@Component({
  selector: 'app-landing',
  imports: [Hero, Intro, Categories, Promos, HowToOrder, InfoColumns, OrderBar],
  template: `
    <app-hero />
    <app-intro />
    <app-categories />
    <app-promos />
    <app-how-to-order />
    @if (hasInfo) {
      <app-info-columns />
    }
    <app-order-bar />
  `,
})
export class Landing {
  protected readonly hasInfo = HAS_INFO_SECTION;
}
