type StringOrDate = Date | string;

/**
 * Remove seconds and milliseconds and transform date into a sendable JSON string.
 *
 * @param date string or Date instance of a date.
 * @returns date as string in JSON format.
 */
export const serializeDate = (date: StringOrDate): string => {
  const result = new Date(date);
  result.setSeconds(0);
  result.setMilliseconds(0);
  return result.toJSON();
};

/**
 * Combine date and time.
 *
 * @param date year, month and day
 * @param time hour and minutes
 * @returns Date instance.
 */
export const combine = (date: StringOrDate, time: StringOrDate): Date => {
  const result = new Date(date);
  const hoursAndMinutes = new Date(time);
  result.setHours(hoursAndMinutes.getHours());
  result.setMinutes(hoursAndMinutes.getMinutes());
  return result;
};

/**
 * ShortHand from combine and serializeDate methods.
 *
 * @param date
 * @param time
 * @returns
 */
export const combineAndSerialize = (
  date: StringOrDate,
  time: StringOrDate
): string => {
  const result = combine(date, time);
  return serializeDate(result);
};

/**
 * Returns the date passed + 1 month. It have in count december.
 *
 * @param date
 * @returns date instance
 */
export const nextMonth = (date: StringOrDate): Date => {
  const result = new Date(date);
  result.setUTCMonth(now().getUTCMonth() + 1);
  return result;
};

/**
 * Return the date passed + 1 hour. It have in count 23:mm cases.
 *
 * @param date
 * @returns
 */
export const nextHour = (date: StringOrDate): Date => {
  const result = new Date(date);
  result.setHours(result.getHours() + 1);
  return result;
};

/**
 * Return the date passed + 15 minutes. It have in count edges dates.
 *
 * @param date
 * @returns
 */
export const next15Minutes = (date: StringOrDate): Date => {
  const newDate = new Date(date);
  const minutes = newDate.getMinutes();
  let result = 0;

  if (minutes < 15) {
    result = 15;
  } else if (minutes < 30) {
    result = 30;
  } else if (minutes < 45) {
    result = 45;
  } else {
    newDate.setHours(newDate.getHours() + 1);
    result = 0;
  }

  newDate.setMinutes(result);
  return newDate;
};

/**
 * Return 4 values corresponding to 2 dates nad 2 strings.
 *
 * The startDate is an instance of now Date.
 *
 * The startTime is an ISO Date of now + 15 minutes.
 *
 * The endDate is an instance of now + 1 hour + 15 minutes.
 *
 * The endTime is an ISO Date of now + 1 hour + 15 minutes.
 *
 * @returns
 */
export const getStartEndDateTimes = () => {
  const startDate = now();
  const startTime = next15Minutes(now()).toISOString();

  const endDate = nextHour(startTime);
  const endTime = nextHour(startTime).toISOString();

  return { startDate, startTime, endDate, endTime };
};

export const now = (): Date => new Date();
