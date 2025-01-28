import { prisonCodeOptions } from './prisons'

describe('prisonCodeOptions', () => {
  const prisons = {
    LEI: 'Leeds',
    WHI: 'Woodhill',
    WMI: 'Wymott',
  }

  it('adds Please Select as the first option', () => {
    expect(prisonCodeOptions({ prisons: {} })).toEqual([{ value: '', text: 'Please Select', selected: true }])
  })

  it('creates a select box option for every prison', () => {
    expect(prisonCodeOptions({ prisons })).toEqual([
      { value: '', text: 'Please Select', selected: true },
      { value: 'LEI', text: 'Leeds', selected: false },
      { value: 'WHI', text: 'Woodhill', selected: false },
      { value: 'WMI', text: 'Wymott', selected: false },
    ])
  })

  it('auto selects the option if a selectedValue is given', () => {
    expect(prisonCodeOptions({ prisons }, 'WMI')).toEqual([
      { value: '', text: 'Please Select', selected: false },
      { value: 'LEI', text: 'Leeds', selected: false },
      { value: 'WHI', text: 'Woodhill', selected: false },
      { value: 'WMI', text: 'Wymott', selected: true },
    ])
  })
})
