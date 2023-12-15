import { IGroup, IInvitation } from '@/@types'
import { db } from '@/lib/firebase'
import { addDoc, arrayUnion, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'

type SendInviteArgs = {
  receiverEmail: string
  senderEmail: string
  groupId: string
  message: string
  title: string
}

export async function sendInvite({ receiverEmail, senderEmail, groupId, message, title }: SendInviteArgs) {
  try {
    const invitation = await addDoc(collection(db, 'invitations'), {
      receiverEmail,
      senderEmail,
      groupId,
      message,
      title,
      read: false
    })

    return invitation.id
  } catch (error) {
    console.log(error)
  }
}

type AcceptInvitationArgs = {
  invitationId: string
  groupId: string
  userEmail: string
}

export async function acceptInvitation({ invitationId, groupId, userEmail }: AcceptInvitationArgs) {
  try {
    const invitationRef = doc(db, "invitations", invitationId);
    const groupRef = doc(db, "groups", groupId);

    await updateDoc(invitationRef, {
      read: true
    })

    await updateDoc(groupRef, {
      participants: arrayUnion(userEmail)
    })
  } catch (error) {
    console.log(error)
  }
}

export async function getInvitationsByUserEmail(email: string) {
  try {
    const result: IInvitation[] = []

    const q = query(
      collection(db, 'invitations'),
      where('receiverEmail', '==', email),
      where('read', '==', false),
    )

    await getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data()

        result.push({
          groupId: data.groupId,
          message: data.message,
          read: data.read,
          receiverEmail: data.receiverEmail,
          senderEmail: data.senderEmail,
          title: data.title,
          id: doc.id,
        })
      })
    })

    return result
  } catch (error) {
    return []
  }
}
