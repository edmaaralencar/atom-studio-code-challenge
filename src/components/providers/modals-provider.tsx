"use client"

import { CreateActivityModal } from "../modals/create-activity-modal"
import { CreateGroupModal } from "../modals/create-group-modal"
import { CreateTypeModal } from "../modals/create-type-modal"
import { UpdateActivityModal } from "../modals/update-activity-modal"

export function ModalsProvider() {
  return (
    <>
      <CreateGroupModal />
      <CreateActivityModal />
      <CreateTypeModal />
      <UpdateActivityModal />
    </>
  )
}