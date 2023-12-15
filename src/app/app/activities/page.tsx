'use client'

import { IActivity } from '@/@types'
import { Spinner } from '@/components/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/context/auth-context'
import { useUsersActivities } from '@/services/hooks/use-users-activities'
import { Fragment, useMemo, useState } from 'react'
import { GroupedActivities } from '../groups/[groupId]/page'
import { Pen, Trash2 } from 'lucide-react'
import { Filters } from './_components/filters'
import { months } from '@/utils/dates'

export default function Activities() {
  const { user } = useAuth()
  const [date, setDate] = useState<Date | undefined>()

  const userActivitiesQuery = useUsersActivities(String(user?.id))

  const groupedActivities = useMemo(() => {
    if (!userActivitiesQuery.data) {
      return []
    }

    let groupedActivities = userActivitiesQuery.data.reduce(
      (acc: GroupedActivities[], item: IActivity) => {
        const month = item.activityDate.getMonth() + 1
        const day = item.activityDate.getDate()
        const year = item.activityDate.getFullYear()

        const dayExists = acc.findIndex(
          (arrItem) =>
            arrItem.day === day &&
            arrItem.month === month &&
            arrItem.year === year
        )

        if (dayExists > -1) {
          acc[dayExists].activities.push(item)
        } else {
          acc.push({
            month,
            year,
            day,
            activities: [item],
          })
        }

        return acc
      },
      []
    )

    if (date) {
      groupedActivities = groupedActivities.filter(
        (item) =>
          item.day === date?.getDate() &&
          item.month === date.getMonth() + 1 &&
          item.year === date.getFullYear()
      )
    }

    const sortedGroupedActivities = groupedActivities.sort((a, b) => {
      const dateA = new Date(`${a.year}-${a.month}-${a.day}`)
      const dateB = new Date(`${b.year}-${b.month}-${b.day}`)
      return dateB.getTime() - dateA.getTime()
    })

    return sortedGroupedActivities
  }, [date, userActivitiesQuery.data])

  if (!userActivitiesQuery.data) {
    return (
      <div className="w-full h-full grid place-items-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      <h1 className="text-2xl font-semibold tracking-tight">Suas atividades</h1>

      <div className="space-y-4">
        <Filters onSelectDate={setDate} selectedDate={date} />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Usuário</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedActivities.map((item) => (
              <Fragment key={`${item.day}+${item.month}+${item.year}`}>
                <TableRow className="text-muted-foreground">
                  <TableCell className="font-medium">
                    {item.day} de {months[item.month] as string} de {item.year}
                  </TableCell>
                </TableRow>

                {item.activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">
                      {activity.userEmail}
                    </TableCell>
                    <TableCell>{activity.name}</TableCell>
                    <TableCell>{activity.description.slice(0, 20)}</TableCell>
                    <TableCell>{activity.activityType}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2 flex-row">
                        <button>
                          <Pen size={18} className="text-muted-foreground" />
                        </button>
                        <button
                        // onClick={() => deleteActivity.mutateAsync(activity.id)}
                        >
                          <Trash2 size={18} className="text-muted-foreground" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </Fragment>
            ))}
          </TableBody>
        </Table>

        {groupedActivities.length === 0 && (
          <div className="w-full h-20 grid place-items-center">
            <span>Você ainda não tem atividades na data selecionada.</span>
          </div>
        )}
      </div>
    </div>
  )
}
