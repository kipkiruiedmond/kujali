export class AddNoteToBudgetCommand {
  constructor(
    public readonly budgetId: string,
    public readonly title: string,
    public readonly content: string,
    public readonly createdBy: string
  ) {
    if (!budgetId || budgetId.trim() === '') {
      throw new Error('VALIDATION_ERROR: Budget ID is required to associate a note.');
    }
    if (!content || content.trim() === '') {
      throw new Error('VALIDATION_ERROR: Note content cannot be empty. Provide meaningful context.');
    }
    if (!createdBy || createdBy.trim() === '') {
      throw new Error('VALIDATION_ERROR: Note creator must be identified for accountability.');
    }
  }
}

export interface AddNoteToBudgetPayload {
  budgetId: string;
  title: string;
  content: string;
  createdBy: string;
}
