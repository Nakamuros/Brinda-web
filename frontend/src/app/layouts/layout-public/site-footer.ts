import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LegalNotice } from '../../shared/legal-notice';
import { LEGAL, SITE } from '../../core/config';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink, LegalNotice],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.css',
})
export class SiteFooter {
  protected readonly brand = SITE.name;
  protected readonly tagline = SITE.tagline;
  protected readonly legal = LEGAL;
  protected readonly complaints = LEGAL.complaints;
  protected readonly provider = LEGAL.provider;
  protected readonly year = new Date().getFullYear();
  protected readonly legalLinks = [
    { path: '/terminos', label: 'Términos y condiciones' },
    { path: '/privacidad', label: 'Política de privacidad' },
  ];
}
