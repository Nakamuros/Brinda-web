import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IMAGES } from '../../../../core/config';
import { BrindisMark } from '../../../../shared/brindis-mark';
import { ParallaxDirective } from '../../../../shared/parallax.directive';
import { RevealDirective } from '../../../../shared/reveal.directive';

@Component({
  selector: 'app-intro',
  imports: [RouterLink, RevealDirective, ParallaxDirective, BrindisMark],
  template: `
    <section id="presentacion" class="intro" aria-labelledby="intro-title">
      <app-brindis-mark class="mark" />
      <div class="container inner">
        <div class="text">
          <h2 id="intro-title" class="title" appReveal="lines">
            <span class="line"><span>brinda en casa,</span></span>
            <span class="line"><span><span class="accent">sin</span> salir</span></span>
          </h2>
          <div class="body" appReveal="stagger" [revealDelay]="0.25">
            <p class="meta">Delivery en Lima · Sin local, solo para tu puerta</p>
            <p class="lead">
              Cervezas, vinos y destilados para la ocasión que sea. Eliges, nos escribes por WhatsApp, pagas con Yape o
              Plin y llegamos a tu dirección.
            </p>
            <a class="btn btn-ghost" routerLink="/catalogo">Pedir ahora</a>
          </div>
        </div>

        <figure class="product" appReveal>
          <img
            appParallax
            [src]="productImage"
            alt="Ilustración de ejemplo: copa con un trago ámbar"
            width="800"
            height="960"
            loading="lazy"
            decoding="async"
          />
        </figure>
      </div>
    </section>
  `,
  styleUrl: './intro.css',
})
export class Intro {
  protected readonly productImage = IMAGES.introProduct;
}
