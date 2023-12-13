/**
 * Calculates the lifetime in days from a given date
 * @param date The date to calculate the lifetime from
 * @returns Lifetime in days rounded up
 */
export const calculateLifetimeInDays = (date: Date) => {
    const currentDate = new Date()
    const diffInTime = date.getTime() - currentDate.getTime()
    const diffInDays = diffInTime / (1000 * 3600 * 24)
    return Math.ceil(diffInDays)
}

/**
 * Calculates the date at the end of the lifetime
 * @param lifetime The lifetime in days
 * @returns The date at the end of the lifetime
 */
export const calculateDateFromLifetime = (lifetime: number) => {
    const currentDate = new Date()
    const newDate = new Date(currentDate.getTime() + lifetime * 24 * 60 * 60 * 1000)
    return newDate
}