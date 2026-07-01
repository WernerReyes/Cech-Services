import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  QueryList,
  TemplateRef,
  computed,
  input,
  output,
  signal,
} from '@angular/core';

import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { TableDropdownComponent } from '@shared/components/common/table-dropdown/table-dropdown.component';
import { BadgeComponent } from '@shared/components/ui/badge/badge.component';
import { GenericTableCellDirective } from './generic-table-cell.directive';

export type TableColumnType =
  | 'text'
  | 'image-text'
  | 'badge'
  | 'date'
  | 'currency';

export type BadgeColor =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'primary'
  | 'light'
  | 'dark';

export interface GenericTableColumn<T = any> {
  key: keyof T | string;
  label: string;
  type?: TableColumnType;
  imageKey?: keyof T | string;
  valueGetter?: (item: T) => string | number | null | undefined;
  class?: string;
  headerClass?: string;
  bodyClass?: string;
}

export interface GenericTableAction<T = any> {
  label: string;
  action: string;
  icon?: string;
  severity?: 'default' | 'danger';
  visible?: (item: T) => boolean;
}

export interface GenericTableActionEvent<T = any> {
  action: string;
  item: T;
}

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    TableDropdownComponent,
    BadgeComponent,
    GenericTableCellDirective,
  ],
  templateUrl: './generic-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericTableComponent<T extends Record<string, any> = any>
  implements AfterContentInit
{
  title = input<string>('Listado');
  searchPlaceholder = input<string>('Buscar...');

  data = input<T[]>([]);
  columns = input<GenericTableColumn<T>[]>([]);
  actions = input<GenericTableAction<T>[]>([]);

  itemsPerPage = input<number>(5);
  searchableFields = input<string[]>([]);
  showSearch = input<boolean>(true);
  showPagination = input<boolean>(true);

  badgeColorFn = input<(value: any, item?: T) => BadgeColor>(() => 'info');

  actionClick = output<GenericTableActionEvent<T>>();

  @ContentChildren(GenericTableCellDirective)
  cellTemplates!: QueryList<GenericTableCellDirective>;

  private templates = signal<Record<string, TemplateRef<any>>>({});

  searchTerm = signal<string>('');
  currentPage = signal<number>(1);

  ngAfterContentInit(): void {
    this.refreshTemplates();

    this.cellTemplates.changes.subscribe(() => {
      this.refreshTemplates();
    });
  }

  private refreshTemplates(): void {
    const templateMap: Record<string, TemplateRef<any>> = {};

    this.cellTemplates.forEach((template) => {
      templateMap[template.appTableCell()] = template.templateRef;
    });

    this.templates.set(templateMap);
  }

  filteredData = computed<T[]>(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const data = this.data();
    const columns = this.columns();

    if (!term) {
      return data;
    }

    const fields = this.searchableFields().length
      ? this.searchableFields()
      : columns.map((column) => String(column.key));

    return data.filter((item) => {
      return fields.some((field) => {
        const value = this.getNestedValue(item, field);
        return String(value ?? '').toLowerCase().includes(term);
      });
    });
  });

  totalPages = computed<number>(() => {
    return Math.max(
      1,
      Math.ceil(this.filteredData().length / this.itemsPerPage())
    );
  });

  currentItems = computed<T[]>(() => {
    if (!this.showPagination()) {
      return this.filteredData();
    }

    const start = (this.currentPage() - 1) * this.itemsPerPage();
    return this.filteredData().slice(start, start + this.itemsPerPage());
  });

  pages = computed<number[]>(() => {
    return Array.from({ length: this.totalPages() }, (_, index) => index + 1);
  });

  onSearch(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  emitAction(action: string, item: T): void {
    this.actionClick.emit({ action, item });
  }

  isActionVisible(action: GenericTableAction<T>, item: T): boolean {
    return action.visible ? action.visible(item) : true;
  }

  getCellTemplate(column: GenericTableColumn<T>): TemplateRef<any> | null {
    return this.templates()[String(column.key)] ?? null;
  }

  hasCellTemplate(column: GenericTableColumn<T>): boolean {
    return !!this.getCellTemplate(column);
  }

  getColumnValue(item: T, column: GenericTableColumn<T>): any {
    if (column.valueGetter) {
      return column.valueGetter(item);
    }

    return this.getNestedValue(item, String(column.key));
  }

  getImageValue(item: T, column: GenericTableColumn<T>): string {
    if (!column.imageKey) {
      return '';
    }

    return String(this.getNestedValue(item, String(column.imageKey)) ?? '');
  }

  getBadgeColor(value: any, item: T): BadgeColor {
    return this.badgeColorFn()(value, item);
  }

  getNestedValue(item: T, path: string): any {
    return path.split('.').reduce((acc, key) => {
      return acc ? acc[key] : null;
    }, item as any);
  }

  trackByIndex(index: number): number {
    return index;
  }
}