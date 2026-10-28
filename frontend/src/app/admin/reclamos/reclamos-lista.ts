import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { apiError } from '../admin-auth.service';
import {
  ComplaintCounts,
  ComplaintFilters,
  ComplaintPage,
  ComplaintStatus,
  ComplaintType,
  deadlineText,
  emailLabel,
  formatDate,
  goodLabel,
  statusLabel,
  typeLabel,
} from './reclamo.models';
import { ComplaintsAdmin } from './reclamos.service';

type DeadlineFilter = 'SOON' | 'OVERDUE' | '';

@Component({
  selector: 'app-reclamos-lista',
  imports: [RouterLink],
  styleUrls: ['../admin-ui.css', './reclamos-lista.css'],
  templateUrl: './reclamos-lista.html',
})
export class ReclamosLista implements OnInit {
  private readonly api = inject(ComplaintsAdmin);
  private seq = 0;
  private timer: ReturnType<typeof setTimeout> | undefined;

  protected readonly status = signal<ComplaintStatus | ''>('');
  protected readonly type = signal<ComplaintType | ''>('');
  protected readonly deadline = signal<DeadlineFilter>('');
  protected readonly q = signal('');
  protected readonly pageIndex = signal(0);

  protected readonly result = signal<ComplaintPage | null>(null);
  protected readonly counts = signal<ComplaintCounts | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  protected readonly rows = computed(() =>
    (this.result()?.content ?? []).map((c) => ({
      c,
      date: formatDate(c.filedAt),
      kind: `${typeLabel(c.complaintType)} · ${goodLabel(c.goodType)}`,
      status: statusLabel(c.status),
      deadline: deadlineText(c.deadline),
      consumerEmail: emailLabel(c.consumerEmail),
    })),
  );
  protected readonly filtered = computed(() => !!(this.status() || this.type() || this.deadline() || this.q().trim()));

  ngOnInit(): void {
    void this.load();
    void this.loadCounts();
  }

  protected setStatus(v: string): void {
    this.status.set(v as ComplaintStatus | '');
    this.refresh();
  }

  protected setType(v: string): void {
    this.type.set(v as ComplaintType | '');
    this.refresh();
  }

  protected toggleDeadline(v: 'SOON' | 'OVERDUE'): void {
    this.deadline.set(this.deadline() === v ? '' : v);
    this.refresh();
  }

  protected togglePending(): void {
    this.status.set(this.status() === 'RECEIVED' ? '' : 'RECEIVED');
    this.deadline.set('');
    this.refresh();
  }

  protected search(v: string): void {
    this.q.set(v);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.refresh(), 300);
  }

  protected clear(): void {
    this.status.set('');
    this.type.set('');
    this.deadline.set('');
    this.q.set('');
    this.refresh();
  }

  protected go(delta: number): void {
    this.pageIndex.update((p) => Math.max(0, p + delta));
    void this.load();
  }

  protected retry(): void {
    void this.load();
    void this.loadCounts();
  }

  private refresh(): void {
    this.pageIndex.set(0);
    void this.load();
  }

  private async loadCounts(): Promise<void> {
    try {
      this.counts.set(await this.api.counts());
    } catch {
      this.counts.set(null);
    }
  }

  private async load(): Promise<void> {
    const mine = ++this.seq;
    this.loading.set(true);
    this.error.set('');
    const filters: ComplaintFilters = {
      status: this.status(),
      type: this.type(),
      deadline: this.deadline(),
      q: this.q(),
      page: this.pageIndex(),
    };
    try {
      const page = await this.api.list(filters);
      if (mine === this.seq) {
        this.result.set(page);
      }
    } catch (e) {
      if (mine === this.seq) {
        this.error.set(apiError(e, 'No se pudieron cargar los reclamos.'));
      }
    } finally {
      if (mine === this.seq) {
        this.loading.set(false);
      }
    }
  }
}
