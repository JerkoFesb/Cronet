import { type SchemaTypeDefinition } from 'sanity'
import pageStatus from './pageStatus'
import navigationItem from './navigationItem'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [pageStatus, navigationItem],
}
