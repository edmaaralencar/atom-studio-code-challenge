import { IActivity, IGroup } from '@/@types'
import { db } from '@/lib/firebase'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore'

export async function getGroupsByUserEmail(userEmail: string) {
  try {
    const result: IGroup[] = []

    const q = query(
      collection(db, 'groups'),
      where('participants', 'array-contains', userEmail)
    )

    await getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data()

        result.push({
          description: data.description,
          name: data.name,
          owner: data.owner,
          participants: data.participants,
          id: doc.id,
        })
      })
    })

    return result
  } catch (error) {
    return []
  }
}

export async function getTypesByGroupId(groupId: string) {
  try {
    const result: { name: string; id: string }[] = []

    const q = query(collection(db, 'groups', groupId, 'types'))

    await getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data()

        result.push({
          name: data.name,
          id: doc.id,
        })
      })
    })

    return result
  } catch (error) {
    return []
  }
}

export async function getActivitiesByGroupId(groupId: string) {
  try {
    const result: IActivity[] = []

    const q = query(collection(db, 'groups', groupId, 'activities'))

    await getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data()

        result.push({
          name: data.name,
          activityType: data.activityType,
          createdAt: data.createdAt.toDate(),
          description: data.description,
          userEmail: data.userEmail,
          activityDate: data.activityDate.toDate(),
          id: doc.id,
        })
      })
    })

    return result
  } catch (error) {
    return []
  }
}

export async function getGroupById(id: string) {
  try {
    const docRef = doc(db, 'groups', id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data() as IGroup
    } else {
      return null
    }
  } catch (error) {
    return null
  }
}
