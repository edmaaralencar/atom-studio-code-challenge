import { IActivity } from '@/@types'
import { db } from '@/lib/firebase'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from 'firebase/firestore'

export async function isUserRegistered(email: string) {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'users'), where('email', '==', email), limit(1))
    )

    return !querySnapshot.empty
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function getActivitiesByUserId(userId: string) {
  try {
    const result: IActivity[] = []

    const q = query(collection(db, 'users', userId, 'activities'))

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
