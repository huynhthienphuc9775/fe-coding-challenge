import { Item } from '@/utils/itemUtils'
import { atom } from 'recoil'

const view_data = atom<Array<Item>>({
  key: 'view_data',
  default: [] as any
})

export { view_data }
