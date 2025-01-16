import { Router } from 'express'
import { Services } from '../services'
import * as localDeliveryUnitMailboxes from './localDeliveryUnitMailboxes/controller'

export default (services: Services): Router =>
  Router()
    .get('/', async (req, res, next) => res.render('pages/index'))
    .get('/local-delivery-unit-mailboxes', localDeliveryUnitMailboxes.index(services))
    .get('/local-delivery-unit-mailboxes/new', localDeliveryUnitMailboxes.newMailbox)
    .post('/local-delivery-unit-mailboxes', localDeliveryUnitMailboxes.create(services))
    .get('/local-delivery-unit-mailboxes/:id/edit', localDeliveryUnitMailboxes.edit(services))
    .post('/local-delivery-unit-mailboxes/:id', localDeliveryUnitMailboxes.update(services))
