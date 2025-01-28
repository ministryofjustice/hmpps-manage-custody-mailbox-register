import type { PrisonCodesResult } from '../../@types/mailboxRegisterApiClientTypes'

export type SelectBoxOptions = { value?: string; text: string; selected?: boolean }[]

export const prisonCodeOptions = ({ prisons }: PrisonCodesResult, selectedValue: string = null): SelectBoxOptions => {
  const prisonOptions: SelectBoxOptions = [{ value: null, text: 'Please Select' }]

  for (const [code, name] of Object.entries(prisons)) {
    prisonOptions.push({ value: code, text: name })
  }

  return prisonOptions.map(option => {
    return option.value === selectedValue ? { ...option, selected: true } : option
  })
}
