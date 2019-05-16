export interface EventAttendance {
    id: string
    userId: string
    eventId: string
    role: EventAttendanceRole
    status: EventAttendanceStatus
}

export enum EventAttendanceRole {
    Owner = "OWNER",
    Guest = "GUEST"
}

export enum EventAttendanceStatus {
    Confirmed = "CONFIRMED",
    Canceled = "CANCELED"
}