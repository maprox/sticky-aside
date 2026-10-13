import { isPlatformBrowser } from '@angular/common'
import type { AfterViewInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import {
  afterNextRender,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  inject,
  Injector,
  Input,
  Output,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core'
import { createStickyAside, OFFSET_CLASS } from '@sticky-aside/core'
import type { StickyAsideController, StickyAsideState } from '@sticky-aside/core'

type Tag = 'div' | 'aside' | 'nav' | 'section'

@Component({
  selector: 'sticky-aside',
  standalone: true,
  template: `
    @switch (asideTag) {
      @case ('aside') {
        <aside #wrapper [class]="rootClass" [attr.aria-label]="ariaLabel">
          <div #content><ng-content /></div>
        </aside>
      }
      @case ('nav') {
        <nav #wrapper [class]="rootClass" [attr.aria-label]="ariaLabel">
          <div #content><ng-content /></div>
        </nav>
      }
      @case ('section') {
        <section #wrapper [class]="rootClass" [attr.aria-label]="ariaLabel">
          <div #content><ng-content /></div>
        </section>
      }
      @default {
        <div #wrapper [class]="rootClass" [attr.aria-label]="ariaLabel">
          <div #content><ng-content /></div>
        </div>
      }
    }
  `,
  styles: [`:host { display: contents; }`],
})
export class StickyAside implements AfterViewInit, OnChanges, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID)
  private readonly injector = inject(Injector)
  private readonly host = inject(ElementRef<HTMLElement>)
  private readonly cdr = inject(ChangeDetectorRef)
  private aside?: StickyAsideController

  @ViewChild('wrapper', { read: ElementRef }) private wrapperRef?: ElementRef<HTMLElement>
  @ViewChild('content', { read: ElementRef }) private contentRef?: ElementRef<HTMLElement>

  @HostBinding('class.sticky-aside-root') readonly stickyAsideRootHost = true

  @Input('as') asideTag: Tag = 'div'
  @Input() topClass = OFFSET_CLASS.top
  @Input() bottomClass = OFFSET_CLASS.bottom
  @Input() contentClass = ''
  @Input() disabled = false
  @Input() locked = false
  @Input() allowLockedOverflowTop = false
  @Input() allowLockedOverflowBottom = false
  @Output() readonly stateChange = new EventEmitter<StickyAsideState>()

  ariaLabel: string | null = null
  rootClass = 'sticky-aside-root'

  ngAfterViewInit(): void {
    this.syncHostAttrs()
    this.cdr.detectChanges()
    this.create()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['asideTag'] && this.aside) {
      this.aside.destroy()
      this.aside = undefined
      afterNextRender(
        () => {
          this.syncHostAttrs()
          this.create()
        },
        { injector: this.injector },
      )

      return
    }
    if (!this.aside) {
      return
    }
    if (changes['topClass'] || changes['bottomClass'] || changes['contentClass']) {
      this.aside.setClasses({
        topClass: this.topClass,
        bottomClass: this.bottomClass,
        contentClass: this.contentClass ?? '',
      })
    }
    if (changes['locked']) {
      this.aside.setLocked(this.locked)
    }
    if (changes['disabled']) {
      this.aside.setDisabled(this.disabled)
    }
    if (changes['allowLockedOverflowTop'] || changes['allowLockedOverflowBottom']) {
      this.aside.setAllowLockedOverflow(this.allowLockedOverflowTop, this.allowLockedOverflowBottom)
    }
  }

  ngOnDestroy(): void {
    this.aside?.destroy()
    this.aside = undefined
  }

  private create(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return
    }
    const wrapper = this.wrapperRef?.nativeElement
    const content = this.contentRef?.nativeElement
    if (!wrapper || !content) {
      return
    }
    this.aside = createStickyAside({
      wrapper,
      content,
      topClass: this.topClass,
      bottomClass: this.bottomClass,
      contentClass: this.contentClass,
      disabled: this.disabled,
      locked: this.locked,
      allowLockedOverflowTop: this.allowLockedOverflowTop,
      allowLockedOverflowBottom: this.allowLockedOverflowBottom,
      onStateChange: (state) => this.stateChange.emit(state),
    })
  }

  private syncHostAttrs(): void {
    const el = this.host.nativeElement
    this.ariaLabel = el.getAttribute('aria-label')
    const extra = Array.from(el.classList).filter((c) => c && c !== 'sticky-aside-root')
    this.rootClass = ['sticky-aside-root', ...extra].filter(Boolean).join(' ')
  }
}
