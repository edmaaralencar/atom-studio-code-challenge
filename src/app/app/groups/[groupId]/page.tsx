'use client'

import { IActivity } from '@/@types'
import { Spinner } from '@/components/spinner'
import { TypesChart } from '@/components/types-chart'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useModalStore } from '@/hooks/use-modal-store'
import { useActivities } from '@/services/hooks/use-activities'
import { useGroup } from '@/services/hooks/use-group'
import { useTypes } from '@/services/hooks/use-types'
import { Activity, Pen, Plus, Trash2, Type, TypeIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import { Fragment, useMemo, useState } from 'react'
import { Filters } from './_components/filters'
import { useDeleteActivity } from '@/services/hooks/use-delete-activity'
import { useUpdateActivityModal } from '@/hooks/use-update-activity-modal-store'

export type GroupedActivities = {
  day: number
  year: number
  month: number
  activities: IActivity[]
}
type ChartData = {
  name: string
  value: number
}

export const months: any = {
  1: 'Jan',
  2: 'Fev',
  3: 'Mar',
  4: 'Abr',
  5: 'Mai',
  6: 'Jun',
  7: 'Jul',
  8: 'Ago',
  9: 'Set',
  10: 'Out',
  11: 'Nov',
  12: 'Dez',
}

export default function GroupId() {
  const onOpen = useModalStore((state) => state.onOpen)
  const onOpenUpdateModal = useUpdateActivityModal((state) => state.onOpen)
  const params = useParams()

  const [filterType, setFilterType] = useState<{
    type: 'activityType' | 'user' | ''
    data: string
  }>({
    type: '',
    data: '',
  })

  const groupQuery = useGroup(String(params.groupId))
  const activitiesQuery = useActivities(String(params.groupId))
  const typesQuery = useTypes(String(params.groupId))

  const deleteActivity = useDeleteActivity()

  const filteredData = useMemo(() => {
    if (!activitiesQuery.data) {
      return []
    }

    if (filterType.type === 'user') {
      return activitiesQuery.data.filter(
        (item) => item.userEmail === filterType.data
      )
    } else if (filterType.type === 'activityType') {
      return activitiesQuery.data.filter(
        (item) => item.activityType === filterType.data
      )
    } else if (filterType.type === '') {
      return activitiesQuery.data
    } else {
      return []
    }
  }, [activitiesQuery.data, filterType.data, filterType.type])

  if (!groupQuery.data || !activitiesQuery.data) {
    return (
      <div className="w-full h-full grid place-items-center">
        <Spinner />
      </div>
    )
  }

  const groupedActivities = filteredData.reduce(
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

  const sortedGroupedActivities = groupedActivities.sort((a, b) => {
    const dateA = new Date(`${a.year}-${a.month}-${a.day}`)
    const dateB = new Date(`${b.year}-${b.month}-${b.day}`)
    return dateB.getTime() - dateA.getTime()
  })

  const activitesToday = groupedActivities.filter(
    (item) =>
      item.month === new Date().getMonth() + 1 &&
      item.day === new Date().getDate() &&
      item.year === new Date().getFullYear()
  )

  const chartData = activitiesQuery.data.reduce((acc: ChartData[], item) => {
    const typeExists = acc.findIndex(
      (arrItem) => arrItem.name === item.activityType
    )

    if (typeExists > -1) {
      acc[typeExists].value += 1
    } else {
      acc.push({
        name: item.activityType,
        value: 1,
      })
    }

    return acc
  }, [])

  return (
    <div className="flex flex-col gap-8 pb-10">
      <h1 className="text-2xl font-semibold tracking-tight">
        Grupo {groupQuery.data?.name}
      </h1>

      <div className="grid grid-cols-[1fr_300px] gap-4">
        <div className="flex flex-col gap-3">
          <div className="bg-muted rounded-md w-full p-4">
            <h2 className="text-lg font-semibold">{groupQuery.data.name}</h2>

            <p className="text-sm mt-1 text-muted-foreground">
              {groupQuery.data.description}
            </p>

            <span className="block font-medium mt-2">Participantes</span>

            <ul className="text-muted-foreground mt-2">
              {groupQuery.data.participants.map((item) => (
                <li className="ml-1" key={item}>
                  - {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-[1fr_2fr] gap-4">
            <div className="border border-border flex flex-col gap-2 justify-between p-4 rounded-md">
              <header className="flex justify-between items-center">
                <p>Hoje</p>

                <Activity size={18} />
              </header>

              <strong>{activitesToday.length} atividades</strong>
            </div>

            <div className="border flex flex-col justify-between gap-2 border-border p-4 rounded-md">
              <header className="flex justify-between items-center">
                <p>Tipo(s)</p>

                <Button
                  onClick={() => onOpen('createType')}
                  variant="outline"
                  size="sm"
                >
                  <Plus size={18} />
                </Button>
              </header>

              <strong>
                {typesQuery.data?.map((item) => item.name).join(', ')}
              </strong>
            </div>
          </div>
        </div>

        <div className="rounded-md flex items-center justify-center border border-border">
          <TypesChart data={chartData} />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <Filters
            onSelectFilter={setFilterType}
            participants={groupQuery.data.participants}
            activityTypes={typesQuery.data?.map((item) => item.name) ?? []}
          />

          <Button size="sm" onClick={() => onOpen('createActivity')}>
            Criar atividade
          </Button>
        </div>

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
            {sortedGroupedActivities.map((item) => (
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
                        <button
                          onClick={() =>
                            onOpenUpdateModal({
                              activityId: activity.id,
                              description: activity.description,
                              name: activity.name,
                              type: activity.activityType,
                            })
                          }
                        >
                          <Pen size={18} className="text-muted-foreground" />
                        </button>
                        <button
                          onClick={() =>
                            deleteActivity.mutateAsync(activity.id)
                          }
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
      </div>
    </div>
  )
}
