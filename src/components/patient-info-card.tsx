import { Card, CardBody } from '@heroui/card'
import { Avatar } from '@heroui/avatar'
import { Divider } from '@heroui/react'
import { UserIcon } from '@/components/icons'
import React from 'react'
import { PatientDetails } from '@/types'

interface PatientInfoCardProps {
  patientDetails: PatientDetails
  patientId?: string
  patientEmail: string
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const PatientInfoCard: React.FC<PatientInfoCardProps> = ({ patientDetails, patientId, patientEmail, onEmailChange }) => {
  return (
    <Card className="w-full p-2">
      <CardBody className="flex flex-row gap-4">
        <div className="col-span-1 w-[10rem] md:w-[12rem] h-[10rem] md:h-[12rem] gap-8 flex flex-col items-center justify-center">
          <Avatar size="lg" radius="lg" className="aspect-square w-full h-full bg-content2 text-content2-foreground">
            <UserIcon />
          </Avatar>
        </div>
        <div className="flex flex-col w-full">
          <h1 className="text-3xl md:text-4xl font-bold">{patientDetails.name}</h1>
          <p className="text-base md:text-lg">Patient ID: {patientId || 'Unknown ID'}</p>
          <Divider className="m-1" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Patient Details */}
            <div className="flex">
              <span className="font-semibold mr-2 text-sm md:text-base">Phone:</span>
              <span className="text-sm md:text-base">{patientDetails.phone}</span>
            </div>
            <div className="flex">
              <span className="font-semibold mr-2 text-sm md:text-base">Date of Birth:</span>
              <span className="text-sm md:text-base">{patientDetails.dob}</span>
            </div>
            <div className="flex">
              <span className="font-semibold mr-2 text-sm md:text-base">Location:</span>
              <span className="text-sm md:text-base">{patientDetails.address}</span>
            </div>

            {/* Email Input Field */}
            <div className="flex flex-col col-span-1 sm:col-span-2 mt-4">
              <label htmlFor="email" className="font-semibold mb-2 text-sm md:text-base">
                Email Address:
              </label>
              <input
                id="email"
                type="email"
                value={patientEmail}
                onChange={onEmailChange}
                placeholder="Enter patient's email"
                className="p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default PatientInfoCard
