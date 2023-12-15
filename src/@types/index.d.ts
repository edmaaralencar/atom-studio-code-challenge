export interface IGroup {
  id: string
  name: string
  description: string
  owner: string
  participants: string[]
}

export interface IInvitation {
  id: string
  receiverEmail: string
  senderEmail: string
  groupId: string
  message: string
  title: string
  read: boolean
}

export interface IActivity {
  name: string
  description: string
  activityType: string
  createdAt: Date
  userEmail: String
  activityDate: Date
  id: string
}
