import { Component, PLATFORM_ID } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { createStickyAside } from '@sticky-aside/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { StickyAside } from './sticky-aside'

vi.mock('@sticky-aside/core', () => ({
  OFFSET_CLASS: {
    top: 'sticky-aside-top',
    bottom: 'sticky-aside-bottom',
  },
  createStickyAside: vi.fn(() => ({
    update: vi.fn(),
    setLocked: vi.fn(),
    setDisabled: vi.fn(),
    setClasses: vi.fn(),
    setAllowLockedOverflow: vi.fn(),
    destroy: vi.fn(),
    getState: vi.fn(() => 'top'),
    getModel: vi.fn(),
  })),
}))

@Component({
  standalone: true,
  imports: [StickyAside],
  template: `
    <sticky-aside as="aside" class="toc" aria-label="Contents">item</sticky-aside>
  `,
})
class HostAsAside {}

@Component({
  standalone: true,
  imports: [StickyAside],
  template: `<sticky-aside>item</sticky-aside>`,
})
class HostBasic {}

@Component({
  standalone: true,
  imports: [StickyAside],
  template: `<sticky-aside>item</sticky-aside>`,
})
class HostServer {}

@Component({
  standalone: true,
  imports: [StickyAside],
  template: `<sticky-aside [as]="tag">item</sticky-aside>`,
})
class HostChangeTag {
  tag: 'div' | 'aside' = 'div'
}

describe('StickyAside', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HostAsAside, HostBasic],
    })
  })

  afterEach(() => {
    TestBed.resetTestingModule()
    vi.mocked(createStickyAside).mockClear()
  })

  it('renders the requested tag and merges the class', async () => {
    const fixture = TestBed.createComponent(HostAsAside)
    fixture.detectChanges()
    await fixture.whenStable()
    const aside = fixture.nativeElement.querySelector('aside')
    expect(aside).toBeTruthy()
    expect(aside.tagName).toBe('ASIDE')
    expect(aside.className).toContain('sticky-aside-root')
    expect(aside.className).toContain('toc')
    expect(aside.getAttribute('aria-label')).toBe('Contents')
  })

  it('destroys the controller on unmount', async () => {
    const fixture = TestBed.createComponent(HostBasic)
    fixture.detectChanges()
    await fixture.whenStable()
    const controller = vi.mocked(createStickyAside).mock.results.at(-1)?.value
    fixture.destroy()
    expect(controller.destroy).toHaveBeenCalledOnce()
  })

  it('does not create the controller outside the browser', async () => {
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      imports: [HostServer],
    })
    TestBed.overrideComponent(StickyAside, {
      set: {
        providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
      },
    })

    const fixture = TestBed.createComponent(HostServer)
    fixture.detectChanges()
    await fixture.whenStable()

    expect(createStickyAside).not.toHaveBeenCalled()
    const wrapper = fixture.nativeElement.querySelector('sticky-aside > div')
    expect(wrapper).toBeTruthy()
    expect(wrapper.className).toContain('sticky-aside-root')
    expect(fixture.nativeElement.textContent).toContain('item')
  })

  it('recreates the controller when `as` changes after init', async () => {
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      imports: [HostChangeTag],
    })

    const fixture = TestBed.createComponent(HostChangeTag)
    fixture.detectChanges()
    await fixture.whenStable()

    expect(createStickyAside).toHaveBeenCalledTimes(1)
    const first = vi.mocked(createStickyAside).mock.results[0]?.value
    expect(fixture.nativeElement.querySelector('div.sticky-aside-root')).toBeTruthy()

    fixture.componentInstance.tag = 'aside'
    fixture.detectChanges()
    await fixture.whenStable()

    expect(first.destroy).toHaveBeenCalledOnce()
    expect(createStickyAside).toHaveBeenCalledTimes(2)
    expect(fixture.nativeElement.querySelector('aside.sticky-aside-root')).toBeTruthy()
  })
})
