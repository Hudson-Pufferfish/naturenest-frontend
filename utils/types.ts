export type actionFunction = (prevState: any, formData: FormData) => Promise<{ message: string }>;

export type DateRangeSelect = {
  startDate: Date;
  endDate: Date;
  key: string;
};

export type Booking = {
  checkIn: Date;
  checkOut: Date;
};
