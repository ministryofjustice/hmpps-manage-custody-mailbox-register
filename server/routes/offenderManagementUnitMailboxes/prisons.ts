import type { PrisonCodesResult } from '../../@types/mailboxRegisterApiClientTypes'

export type SelectBoxOptions = { value: string; text: string; selected: boolean }[]

export const prisonCodeOptions = ({ prisons }: PrisonCodesResult, selectedValue: string = null): SelectBoxOptions => {
  const prisonOptions = [{ value: '', text: 'Please Select', selected: selectedValue == null || selectedValue === '' }]

  for (const [code, name] of Object.entries(prisons)) {
    prisonOptions.push({ value: code, text: name, selected: selectedValue === code })
  }

  return prisonOptions
}
