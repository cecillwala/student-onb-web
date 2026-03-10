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
  selector: 'app-dropdown-select-multiple',
  imports: [...SharedImports],
  templateUrl: './dropdown-select-multiple.html',
  styleUrl: './dropdown-select-multiple.scss',
})
export class DropdownSelectMultiple implements OnInit, OnChanges, ControlValueAccessor
{
  @Input() data: any[] = [];
  @Input() displayField: string = 'country';
  @Input() valueField: string = 'id';
  @Input() placeholder: string = 'Select countries';
  @Input() searchPlaceholder: string = 'Search countries...';
  @Input() translationPrefix?: string;
  @Input() translationCodeField?: string;

  @Output() selectionChange = new EventEmitter<any[]>();

  searchCtrl = new FormControl();
  filteredData!: Observable<any[]>;
  selectedCountries: any[] = [];
  selectedIds: string[] = [];

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
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
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

  private _filter(value: string, data: any[] = this.data): any[] {
    const filterValue = (value || '').toLowerCase();
    return data.filter((item) => {
      const fieldValue = item[this.displayField];
      return typeof fieldValue === 'string'
        ? fieldValue.toLowerCase().includes(filterValue)
        : false;
    });
  }

  selectCountry(country: any) {
    const isAlreadySelected = this.selectedIds.some(
      (id) => id === country[this.valueField]
    );

    if (!isAlreadySelected) {
      this.selectedCountries.push(country); // Store full object for display
      this.selectedIds.push(country[this.valueField]); // Store only ID
      this.updateValue();
      this.onTouched(); // Mark as touched when user selects
      this.searchCtrl.setValue('');
      this.searchInput.nativeElement.value = '';
    }
  }

  removeCountry(country: any) {
    const index = this.selectedCountries.findIndex(
      (selected) => selected[this.valueField] === country[this.valueField]
    );

    if (index >= 0) {
      this.selectedCountries.splice(index, 1);
      this.selectedIds = this.selectedIds.filter(
        (id) => id !== country[this.valueField]
      );
      this.updateValue();
      this.onTouched(); // Mark as touched when user removes
    }
  }

  // Update form control value and emit event
  private updateValue() {
    this.onChange(this.selectedIds);
    // Only mark as touched when user actually interacts, not on initialization
    // this.onTouched();
    this.selectionChange.emit(this.selectedCountries);
  }

  writeValue(value: any[]): void {
    if (value && Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === 'object') {
        // If value is array of objects, extract IDs and find corresponding objects
        this.selectedIds = value.map((item) => item[this.valueField]);
        this.selectedCountries = value;
      } else {
        // If value is array of IDs, find corresponding objects from data
        this.selectedIds = value;
        this.selectedCountries = this.data.filter((item) =>
          value.includes(item[this.valueField])
        );
      }
    } else {
      this.selectedCountries = [];
      this.selectedIds = [];
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.searchCtrl.disable() : this.searchCtrl.enable();
  }

  // Handle autocomplete open/close
  onOpenedChange(opened: boolean) {
    if (opened) {
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
      });
    } else {
      this.searchCtrl.setValue('');
    }
  }

  // Get display name for selected items
  getDisplayName(item: any): string {
    const raw = item ? item[this.displayField] : '';
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
