import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HERO, SITE } from '../../../../core/config';
import { HeroVideo } from './hero-video';

@Component({
  selector: 'app-hero',
  imports: [RouterLink, HeroVideo],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  protected readonly hero = HERO;
  protected readonly brand = SITE.name;
}
