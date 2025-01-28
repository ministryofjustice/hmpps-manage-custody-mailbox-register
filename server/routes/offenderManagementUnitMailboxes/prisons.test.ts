import { prisonCodeOptions } from './prisons'

describe('prisonCodeOptions', () => {
  const prisons = {
    LEI: 'Leeds',
    WHI: 'Woodhill',
    WMI: 'Wymott',
  }

  it('adds Please Select as the first option', () => {
    expect(prisonCodeOptions({ prisons: {} })).toEqual([{ value: null, text: 'Please Select', selected: true }])
  })

  it('creates a select box option for every prison', () => {
    expect(prisonCodeOptions({ prisons })).toEqual([
      { value: null, text: 'Please Select', selected: true },
      { value: 'LEI', text: 'Leeds' },
      { value: 'WHI', text: 'Woodhill' },
      { value: 'WMI', text: 'Wymott' },
    ])
  })

  it('auto selects the option if a selectedValue is given', () => {
    expect(prisonCodeOptions({ prisons }, 'WMI')).toEqual([
      { value: null, text: 'Please Select' },
      { value: 'LEI', text: 'Leeds' },
      { value: 'WHI', text: 'Woodhill' },
      { value: 'WMI', text: 'Wymott', selected: true },
    ])
  })
})
