import { FunctionHandler, HandlerTools } from '@ngfi/functions';
import { v4 as uuidv4 } from 'uuid';

import { AddNoteToBudgetCommand } from './add-note.command';

export interface AddNoteToBudgetResult {
  success: boolean;
  noteId: string;
  timestamp: Date;
}

export class AddNoteToBudgetHandler extends FunctionHandler<AddNoteToBudgetCommand, AddNoteToBudgetResult>
{
  public async execute(command: AddNoteToBudgetCommand, tools: HandlerTools): Promise<AddNoteToBudgetResult> {
    const { budgetId, title, content, createdBy } = command;
    const logger = tools.Logger;
    const repo = tools.getRepository<any>(`budgets/${budgetId}/notes`);

    logger.info(`[AddNoteToBudgetHandler] Initiating note addition for budget: ${budgetId}`, { createdBy });

    try {
      const budgetRepo = tools.getRepository<any>('budgets');
      const budget = await budgetRepo.getDocument(budgetId);
      if (!budget) {
        logger.error(`[AddNoteToBudgetHandler] Budget not found: ${budgetId}`);
        throw new Error('BUDGET_NOT_FOUND: Cannot add a note to a non-existent budget.');
      }

      const noteId = uuidv4(); 
      const newNote = {
        id: noteId,
        budgetId: budgetId,
        title: title,
        content: content,
        createdBy: createdBy,
        createdOn: new Date(),
        lastModified: new Date(),
      };

      await repo.create(newNote, noteId);

      logger.info(`[AddNoteToBudgetHandler] Successfully added note with ID: ${noteId} to budget: ${budgetId}`);

      return {
        success: true,
        noteId: noteId,
        timestamp: new Date(),
      };

    } catch (error) {
      logger.error(`[AddNoteToBudgetHandler] Critical error for budget ${budgetId}:`, error);
      throw new Error(`ADD_NOTE_FAILED: ${error.message}`);
    }
  }
}