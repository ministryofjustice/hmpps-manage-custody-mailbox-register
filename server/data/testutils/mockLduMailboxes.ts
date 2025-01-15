import {
  CreateLocalDeliveryUnitMailboxRequest,
  LocalDeliveryUnitMailbox,
} from '../../@types/mailboxRegisterApiClientTypes'

const createLduMailbox = ({
  unitCode = 'OTHERLDU',
  areaCode = 'OTHERAREA',
  emailAddress = 'ldu@example.com',
  country = 'England',
  name = 'English LDU',
} = {}): CreateLocalDeliveryUnitMailboxRequest => ({
  unitCode,
  areaCode,
  emailAddress,
  country,
  name,
})

const returnLduMailbox = ({
  id = 'uuid',
  unitCode = 'OTHERLDU',
  areaCode = 'OTHERAREA',
  emailAddress = 'ldu@example.com',
  country = 'England',
  name = 'English LDU',
  createdAt = '2024-06-06T12:14:48.465+01:00',
  updatedAt = '2024-06-06T12:14:48.465+01:00',
} = {}): LocalDeliveryUnitMailbox => ({
  id,
  unitCode,
  areaCode,
  emailAddress,
  country,
  name,
  createdAt,
  updatedAt,
})

export { createLduMailbox, returnLduMailbox }
