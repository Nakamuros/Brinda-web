import { Component } from '@angular/core';
import { Categories } from './sections/categories';
import { Hero } from './sections/hero';
import { HowToOrder } from './sections/how-to-order';
import { InfoColumns } from './sections/info-columns';
import { Intro } from './sections/intro';
import { Promos } from './sections/promos';

@Component({
  selector: 'app-landing',
  imports: [Hero, Intro, Categories, Promos, HowToOrder, InfoColumns],
  template: `
    <app-hero />
    <app-intro />
    <app-categories />
    <app-promos />
    <app-how-to-order />
    <app-info-columns />
  `,
})
export class Landing {}
