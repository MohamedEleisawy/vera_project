import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('survey_responses')
export class SurveyResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Je mets quelques champs pour l'exemple, ajoute les 19 questions ici
  @Column({ nullable: true })
  age: string; // q1

  @Column({ nullable: true })
  tempsReseaux: string; // q2

  @Column({ type: 'text', nullable: true })
  raw_data: string; // Pour stocker tout le JSON brut au cas où

  @CreateDateColumn()
  created_at: Date;
}
