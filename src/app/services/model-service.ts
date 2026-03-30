import { Injectable } from '@angular/core';
import { HttpClient } from '../helpers/HttpClient';

@Injectable({
  providedIn: 'root',
})

export class ModelService {
  
  constructor(private httpClient: HttpClient){

  }


  async getModels() {

    let modelResult = await this.httpClient.get('');
    if (modelResult.success){

    }
    else {

    }
  }

  async getModelSetup() {
    
  }
}
