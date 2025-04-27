import { useState, useEffect } from 'react'
import {send, setApiKey} from '@sendgrid/mail'

export const useMail = (patientEmail: string, subjectLine: string, htmlBody: string) => {
    const [error, setError] = useState<string | null>(null)
    const [response, setResponse] = useState<number | null>(null)
    useEffect(() => {
        setApiKey(process.env.SENDGRID_API_KEY || '')
        const msg = {
            to: patientEmail,
            from: 'notifications@medicationadherencedemo.xyz',
            subject: subjectLine,
            html: htmlBody
        }
        send(msg)
            .then(([response]) => {
                console.log('Email sent', response)
                setResponse(response.statusCode) // Assuming you want to store the status code
            })
            .catch((err) => {
                console.error('Error sending email', err)
                setError(`Failed to send email: ${err.message}`)
            })
    })

    return { response, error }
}
