import { Controller, Post, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyResponse } from './survey.entity';

@Controller('api/survey')
export class SurveysController {
  constructor(
    @InjectRepository(SurveyResponse)
    private surveyRepo: Repository<SurveyResponse>,
  ) {}

  @Post()
  async create(@Body() payload: any) {
    console.log('Données reçues de Google Sheets:', payload);

    // Mappage des données (Q1, Q2...) vers ton entité
    const response = this.surveyRepo.create({
      age: payload.q1,
      tempsReseaux: payload.q2,
      // ... mappes les autres champs ici ...
      raw_data: JSON.stringify(payload),
    });

    return await this.surveyRepo.save(response);
  }
}
