'use client'

import { AppHeader } from './_components/app-header'
import Link from 'next/link'
import { useGroups } from '@/services/hooks/use-groups'
import { useAuth } from '@/context/auth-context'
import { Spinner } from '@/components/spinner'
import { GroupCard } from '@/components/group-card'
import { useUsersActivities } from '@/services/hooks/use-users-activities'
import { isSameDay, isSameMonth } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CalendarCheck, Pen, Trash2 } from 'lucide-react'
import { Card } from '@/components/card'
import { DatesChart } from '@/components/dates-chart'
import { IActivity } from '@/@types'

export default function App() {
  const { user } = useAuth()

  const groupsQuery = useGroups(String(user?.email))
  const userActivitiesQuery = useUsersActivities(String(user?.id))

  if (!groupsQuery.data || !userActivitiesQuery.data) {
    return (
      <div className="w-full h-full grid place-items-center">
        <Spinner />
      </div>
    )
  }

  const todayActivities = userActivitiesQuery.data.filter((item) =>
    isSameDay(item.activityDate, new Date())
  )
  const thisMonthActivities = userActivitiesQuery.data.filter((item) =>
    isSameMonth(item.activityDate, new Date())
  )

  const uniqueArrayOfTypes = userActivitiesQuery.data
    .filter(
      (obj, index, array) =>
        index === array.findIndex((o) => o.activityType === obj.activityType)
    )
    .map((item) => item.activityType)

  const groupedActivities = thisMonthActivities
    .reduce((acc: any[], item: IActivity) => {
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
        const value = acc[dayExists][item.activityType]

        acc[dayExists][item.activityType] = value ? value + 1 : 1
      } else {
        acc.push({
          month,
          year,
          day,
          [item.activityType]: 1,
        })
      }

      return acc
    }, [])
    .map(({ year, month, day, ...rest }) => ({
      name: `${day}/${month}/${year}`,
      ...rest,
    }))

  return (
    <div className="flex flex-col gap-8 pb-10">
      <AppHeader />

      <div className="grid grid-cols-2 gap-4">
        <div className="grid grid-rows-2 gap-2">
          <Card
            title="Hoje"
            icon={CalendarCheck}
            message={`${todayActivities.length} atividade(s)`}
          />
          <Card
            title="No mês"
            icon={CalendarCheck}
            message={`${thisMonthActivities.length} atividade(s)`}
          />
        </div>
        <div className="border flex flex-col gap-4 border-border p-4 rounded-md min-h-[400px]">
          <span className="text-center text-lg font-semibold">
            Atividades desse mês
          </span>
          <DatesChart data={groupedActivities} lines={uniqueArrayOfTypes} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Grupos mais recentes</h2>

          <Link
            href="/app/groups"
            className="text-muted-foreground underline text-sm"
          >
            Ver todos
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {groupsQuery.data.slice(0, 3).map((group) => (
            <GroupCard
              key={group.id}
              id={group.id}
              name={group.name}
              description={group.description}
              participants={group.participants}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Atividades de hoje</h2>

          <Link
            href="/app/activities"
            className="text-muted-foreground underline text-sm"
          >
            Ver todos
          </Link>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todayActivities.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.activityType}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center gap-2 flex-row">
                    <button>
                      <Pen size={18} className="text-muted-foreground" />
                    </button>
                    <button>
                      <Trash2 size={18} className="text-muted-foreground" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {todayActivities.length === 0 && (
          <div className="w-full h-20 grid place-items-center">
            <span>Você ainda não tem atividades hoje.</span>
          </div>
        )}
      </div>
    </div>
  )
}
