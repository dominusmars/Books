export function addDays(date: Date,amountofDays:number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + amountofDays);
    return result;
  }
  