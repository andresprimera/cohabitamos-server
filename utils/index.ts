import { BadRequestException } from '@nestjs/common';

export const utils = {
  prepareSearchDates: (date: string) => {
    const parsedStartingDate = new Date(date);

    if (isNaN(parsedStartingDate.getTime())) {
      throw new BadRequestException('Invalid date format.');
    }

    // Adjusting date to UTC-5
    const adjustedDate = new Date(
      parsedStartingDate.getTime() + 5 * 60 * 60000,
    );

    return adjustedDate;
  },
};
