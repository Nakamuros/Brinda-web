import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LEGAL, SITE } from '../../core/config';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.css',
})
export class SiteFooter {
  protected readonly brand = SITE.name;
  protected readonly tagline = SITE.tagline;
  protected readonly legal = LEGAL;
  protected readonly year = new Date().getFullYear();
  /** Páginas legales aún inexistentes: se muestran como pendientes, no como enlaces rotos. */
  protected readonly pendingLinks = ['Términos y condiciones', 'Política de privacidad', 'Libro de reclamaciones'];
}
