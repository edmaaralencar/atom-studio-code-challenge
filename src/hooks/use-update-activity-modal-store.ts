import { create } from 'zustand'

type ModalData = {
  name: string
  description: string
  type: string
  activityId: string
}

type UpdateActivityModalStore = {
  data: ModalData | null
  isOpen: boolean
  onOpen: (data: ModalData) => void
  onClose: () => void
}

export const useUpdateActivityModal = create<UpdateActivityModalStore>(
  (set) => ({
    data: null,
    isOpen: false,
    onOpen: (data: ModalData) => set({ isOpen: true, data }),
    onClose: () => set({ isOpen: false }),
  })
)
