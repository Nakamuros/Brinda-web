import {
  Component,
  ElementRef,
  HostListener,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { SITE } from '../../core/config';
import { MediaPrefs } from '../../core/media-prefs';
import { ScrollService } from '../../core/scroll.service';
import { CartService } from '../../services/cart.service';

interface NavItem {
  label: string;
  link: string;
  fragment?: string;
  exact?: boolean;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Inicio', link: '/', exact: true },
  { label: 'Catálogo', link: '/catalogo' },
  { label: 'Combos y promociones', link: '/', fragment: 'promos' },
  { label: 'Cómo pedir', link: '/', fragment: 'como-pedir' },
  { label: 'Zonas y horario', link: '/', fragment: 'zonas' },
  { label: 'Contacto', link: '/', fragment: 'contacto' },
];

@Component({
  selector: 'app-site-nav',
  imports: [RouterLink],
  templateUrl: './site-nav.html',
  styleUrl: './site-nav.css',
})
export class SiteNav {
  private readonly scroll = inject(ScrollService);
  private readonly router = inject(Router);
  private readonly cart = inject(CartService);
  private readonly prefs = inject(MediaPrefs);

  protected readonly items = NAV_ITEMS;
  protected readonly brand = SITE.name;
  protected readonly scrolled = this.scroll.scrolled;
  protected readonly open = signal(false);
  protected readonly count = this.cart.itemCount;
  protected readonly cartLabel = computed(() => {
    const n = this.count();
    return `Carrito, ${n} ${n === 1 ? 'producto' : 'productos'}`;
  });

  private readonly toggleBtn = viewChild<ElementRef<HTMLButtonElement>>('toggleBtn');
  private readonly menu = viewChild<ElementRef<HTMLElement>>('menu');
  private readonly badge = viewChild<ElementRef<HTMLElement>>('badge');

  constructor() {
    this.scroll.start();
    effect(() => this.scroll.lock(this.open()));
    // El contador "late" al cambiar la cantidad (solo transform; sin movimiento si el usuario lo evita).
    effect(() => {
      this.count();
      const el = this.badge()?.nativeElement;
      if (el && !this.prefs.reducedMotion()) {
        el.animate([{ transform: 'scale(1.45)' }, { transform: 'none' }], {
          duration: 500,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        });
      }
    });
  }

  protected toggle(): void {
    const next = !this.open();
    this.open.set(next);
    if (next) {
      setTimeout(() => this.menu()?.nativeElement.querySelector<HTMLElement>('a')?.focus(), 60);
    } else {
      this.toggleBtn()?.nativeElement.focus();
    }
  }

  protected close(): void {
    this.open.set(false);
  }

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  protected isActive(item: NavItem): boolean {
    return !item.fragment && this.url().split(/[?#]/)[0] === item.link;
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.open()) {
      this.close();
      this.toggleBtn()?.nativeElement.focus();
    }
  }
}
