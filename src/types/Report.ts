import { User } from './User'

// TODO: double check viability/usefullness of some fields in the Report interface; Streamline the interface basically

/**
 * Represents a medication adherence report for a specific time period
 * @interface Report
 */
export interface Report {
	/**
	 * Unique identifier for the report
	 */
	id: string

	/**
	 * The user this report belongs to
	 */
	user: User

	/**
	 * Date when the report was generated
	 */
	generatedAt: Date

	/**
	 * Start date of the reporting period
	 */
	periodStart: Date

	/**
	 * End date of the reporting period
	 */
	periodEnd: Date

	/**
	 * Overall adherence score as a percentage (0-100)
	 */
	overallAdherenceScore: number

	/**
	 * Collection of medication adherence details
	 */
	medicationDetails: MedicationAdherenceDetail[]

	/**
	 * Summary statistics about the patient's medication usage
	 */
	adherenceSummary: AdherenceSummary
}

/**
 * Detailed adherence information for a specific medication
 * @interface MedicationAdherenceDetail
 */
export interface MedicationAdherenceDetail {
	/**
	 * Identifier of the medication
	 */
	medicationId: string

	/**
	 * Name of the medication
	 */
	medicationName: string

	/**
	 * Adherence score for this specific medication as a percentage (0-100)
	 */
	adherenceScore: number

	/**
	 * Total doses prescribed during the period
	 */
	prescribedDoses: number

	/**
	 * Total doses taken during the period
	 */
	takenDoses: number

	/**
	 * Doses taken on time according to the schedule
	 */
	dosesOnTime: number

	/**
	 * Doses taken late
	 */
	dosesLate: number

	/**
	 * Doses missed completely
	 */
	dosesMissed: number

	/**
	 * Daily breakdown of medication adherence
	 */
	dailyBreakdown: DailyAdherence[]
}

/**
 * Daily record of medication adherence
 * @interface DailyAdherence
 */
export interface DailyAdherence {
	/**
	 * The date of this adherence record
	 */
	date: Date

	/**
	 * Status of each dose scheduled for the day
	 */
	doses: DoseStatus[]
}

/**
 * Status of an individual medication dose
 * @interface DoseStatus
 */
export interface DoseStatus {
	/**
	 * Scheduled time for the dose
	 */
	scheduledTime: Date

	/**
	 * Actual time the dose was taken, if available
	 */
	actualTime?: Date

	/**
	 * Status of this dose
	 */
	status: 'on-time' | 'late' | 'missed' | 'scheduled'

	/**
	 * Optional notes about this dose (e.g., reason for missing)
	 */
	notes?: string
}

/**
 * Summary statistics for medication adherence
 * @interface AdherenceSummary
 */
export interface AdherenceSummary {
	/**
	 * Total number of medications in the regimen
	 */
	totalMedications: number

	/**
	 * Average adherence across all medications
	 */
	averageAdherence: number

	/**
	 * Most adherent medication
	 */
	bestAdherence: {
		medicationName: string
		adherenceScore: number
	}

	/**
	 * Least adherent medication
	 */
	worstAdherence: {
		medicationName: string
		adherenceScore: number
	}

	/**
	 * Trend of adherence over time (e.g., improving, declining, stable)
	 */
	adherenceTrend: 'improving' | 'declining' | 'stable'

	/**
	 * Notable patterns in medication usage
	 */
	patterns: string[]

	/**
	 * Recommendations for improving adherence
	 */
	recommendations: string[]
}
