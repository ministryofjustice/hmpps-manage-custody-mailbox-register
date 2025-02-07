type LocalDeliveryUnitMailbox = {
  id: string
  unitCode: string
  areaCode: string
  emailAddress: string
  country?: string
  name?: string
  createdAt: string
  updatedAt: string
}

export interface components {
  schemas: {
    LocalDeliveryUnitMailbox: LocalDeliveryUnitMailbox

    CreateLocalDeliveryUnitMailboxRequest: {
      unitCode: string
      areaCode: string
      emailAddress: string
      country?: string
      name?: string
    }

    OffenderManagementUnitMailbox: {
      id: string
      name: string
      emailAddress: string
      prisonCode: string
      role: string
      createdAt: string
      updatedAt: string
    }

    CreateOffenderManagementUnitMailboxRequest: {
      name: string
      emailAddress: string
      prisonCode: string
      role: string
    }

    CreateProbationTeamRequest: {
      emailAddress: string
      teamCode: string
      localDeliveryUnitMailboxId: string
    }

    ProbationTeam: {
      emailAddress: string
      teamCode: string
      localDeliveryUnitMailbox: LocalDeliveryUnitMailbox
    }
  }
}
