import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Optional,
  Output,
  Self,
  ViewChild,
  OnChanges,
  SimpleChanges,
  inject,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Observable, startWith, map, combineLatest, of } from 'rxjs';
import { SharedImports } from '../../modules/shared.imports';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ChangeDetectorRef, effect } from '@angular/core';

@Component({
  selector: 'app-dropdown-select',
  imports: [...SharedImports],
  templateUrl: './dropdown-select.html',
  styleUrl: './dropdown-select.scss',
})
export class DropdownSelect implements OnInit, OnChanges, ControlValueAccessor
{
  @Input() data: any[] = [];
  @Input() displayField: string = 'name';
  @Input() label: string = 'name';
  @Input() valueField: string = 'id';
  @Input() placeholder: string = 'Select an item';
  @Input() searchPlaceholder: string = 'Search...';
  @Input() translationPrefix?: string;
  @Input() translationCodeField?: string;

  @Output() selectionChange = new EventEmitter<any>();

  selectCtrl = new FormControl();
  searchCtrl = new FormControl();
  filteredData!: Observable<any[]>;

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;

  onChange: any = () => {};
  onTouched: any = () => {};
  private cdr = inject(ChangeDetectorRef);
  private injector = inject(Injector);

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    runInInjectionContext(this.injector, () => {
      effect(() => {
        this.cdr.markForCheck();
      });
    });
  }

  ngOnInit() {
    this.initializeFilteredData();

    this.selectCtrl.valueChanges.subscribe((value) => {
      this.onChange(value);
      // Only mark as touched when user actually interacts, not on initialization
      // this.onTouched();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && !changes['data'].firstChange) {
      this.initializeFilteredData();
    }
  }
  openAutocomplete(trigger: MatAutocompleteTrigger) {
    setTimeout(() => trigger.openPanel());
  }

  private initializeFilteredData() {
    this.filteredData = combineLatest([
      this.searchCtrl.valueChanges.pipe(startWith('')),
      of(this.data),
    ]).pipe(
      map(([searchValue, data]) => this._filter(searchValue || '', data))
    );
  }

  writeValue(value: any): void {
    this.selectCtrl.setValue(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.selectCtrl.disable() : this.selectCtrl.enable();
  }

  // private _filter(value: string, data: any[] = this.data): any[] {
  //   const filterValue = value.toLowerCase();
  //   return data.filter((item) =>
  //     item[this.displayField].toLowerCase().includes(filterValue)
  //   );
  // }
  private _filter(value: string, data: any[] = this.data): any[] {
    const filterValue = (value || '').toLowerCase();

    return data.filter((item) => {
      const fieldValue = item[this.displayField];
      return typeof fieldValue === 'string'
        ? fieldValue.toLowerCase().includes(filterValue)
        : false;
    });
  }

  onOpenedChange(opened: boolean) {
    if (opened) {
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
      });
    } else {
      this.searchCtrl.setValue('');
    }
  }

  selectItem(item: any) {
    this.selectCtrl.setValue(item[this.valueField]);
    this.selectionChange.emit(item);
    this.onTouched(); // Mark as touched only when user selects an item
    // this.matAutocomplete.closePanel();
  }

  displayFn = (value: any): string => {
    if (!value) return '';
    const selectedItem = this.data.find(
      (item) => item[this.valueField] === value
    );
    return selectedItem ? this.renderLabel(selectedItem) : '';
  };

  renderLabel(item: any): string {
    const raw = item?.[this.displayField] ?? '';
    if (!this.translationPrefix) return raw;

    let codeSource: any = item?.[this.valueField] ?? raw;
    if (this.translationCodeField && item?.[this.translationCodeField] !== undefined) {
      codeSource = item[this.translationCodeField];
    } else if (item?.[this.displayField] !== undefined) {
      codeSource = item[this.displayField];
    }
    const normalizedCode =
      typeof codeSource === 'string'
        ? codeSource.toUpperCase().replace(/[^A-Z0-9]+/g, '_')
        : String(codeSource);

    const key = `LOOKUP.${this.translationPrefix}.${normalizedCode}`;
    return raw;
  }
}

