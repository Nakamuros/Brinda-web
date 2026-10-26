import { Component } from '@angular/core';
import { IMAGES } from '../../../../core/config';
import { ParallaxDirective } from '../../../../shared/parallax.directive';
import { RevealDirective } from '../../../../shared/reveal.directive';

/** Presentación: la copa (producto de ejemplo) y una frase. El CTA vive en el hero y en la barra fija. */
@Component({
  selector: 'app-intro',
  imports: [RevealDirective, ParallaxDirective],
  template: `
    <section id="presentacion" class="intro" aria-labelledby="intro-title">
      <div class="container inner">
        <div class="text">
          <h2 id="intro-title" class="title" appReveal="lines">
            <span class="line"><span>brinda en casa,</span></span>
            <span class="line"><span><span class="accent">sin</span> salir</span></span>
          </h2>
          <p class="lead" appReveal [revealDelay]="0.25">
            Cervezas, vinos y destilados para la ocasión que sea, a tu puerta en Lima.
          </p>
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
