import { LoggerService } from '@app/common';
import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';

interface AddressDTO {
  address: string;
  state: string;
  city: string;
  pincode: string;
  district: string;
}

@Injectable()
export class GCPService {
  private readonly service_name = 'GCP_SERVICE';
  constructor(private loggerService: LoggerService) {}

  async getLongitudeAndLatitude(address: AddressDTO) {
    try {
      if (
        !address.address.length ||
        !address.state.length ||
        !address.city.length ||
        !address.pincode.length ||
        !address.district.length
      ) {
        this.loggerService.debug('Invalid address provided!');
        throw new NotAcceptableException('Invalid address provided!');
      }

      const formattedAddress = `${address.address}, ${address.city}, ${address.district}, ${address.state} ${address.pincode}`;

      const geoRes = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: formattedAddress,
            key: process.env.GEOCODING_API_KEY,
          },
        },
      );

      const location = geoRes.data.results?.[0]?.geometry?.location;

      if (!location) {
        this.loggerService.debug(
          `GCP rejected the address object - ${JSON.stringify(formattedAddress)}`,
        );
        throw new NotFoundException(
          `GCP rejected the address object - ${JSON.stringify(formattedAddress)}`,
        );
      }
      const { lat, lng } = location;

      return { latitude: lat, longitude: lng };
    } catch (error) {
      this.loggerService.error(error, this.service_name);
      throw error;
    }
  }
}
