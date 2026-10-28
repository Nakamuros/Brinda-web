import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../../core/config';
import { ComplaintCounts, ComplaintDetail, ComplaintFilters, ComplaintPage } from './reclamo.models';

const BASE = `${API_URL}/admin/complaints`;

@Injectable({ providedIn: 'root' })
export class ComplaintsAdmin {
  private readonly http = inject(HttpClient);

  list(f: ComplaintFilters, size = 20): Promise<ComplaintPage> {
    let params = new HttpParams().set('page', f.page).set('size', size);
    if (f.status) params = params.set('status', f.status);
    if (f.type) params = params.set('type', f.type);
    if (f.deadline) params = params.set('deadline', f.deadline);
    if (f.q?.trim()) params = params.set('q', f.q.trim());
    return firstValueFrom(this.http.get<ComplaintPage>(BASE, { params }));
  }

  counts(): Promise<ComplaintCounts> {
    return firstValueFrom(this.http.get<ComplaintCounts>(`${BASE}/counts`));
  }

  detail(id: string): Promise<ComplaintDetail> {
    return firstValueFrom(this.http.get<ComplaintDetail>(`${BASE}/${encodeURIComponent(id)}`));
  }

  respond(id: string, responseText: string, responseDate: string): Promise<ComplaintDetail> {
    return firstValueFrom(
      this.http.post<ComplaintDetail>(`${BASE}/${encodeURIComponent(id)}/respond`, { responseText, responseDate }),
    );
  }

  pdfUrl(id: string): string {
    return `${BASE}/${encodeURIComponent(id)}/pdf`;
  }
}
