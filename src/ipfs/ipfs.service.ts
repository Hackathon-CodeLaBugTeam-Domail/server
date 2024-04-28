import { Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import axios from 'axios';


@Injectable()
export class IpfsService {
  constructor() {
  }

  async uploadFile(file) {
    const form = new FormData();
    form.append('file', file, 'file');
    const response = await axios.post('https://api.tatum.io/v3/ipfs', form, {
      headers: form.getHeaders(),
    });
    return response.data;
  }
  async getFile(cid) {
    try {
      const id = cid;
      const response = await axios.get(`https://api.tatum.io/v3/ipfs/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
