export interface PromptDefinition {
  id: string;
  setId: string;
  title: string;
  promptText: string;
  expectedOutput: string;
}

export interface PromptSet {
  id: string;
  title: string;
  description: string;
  prompts: PromptDefinition[];
}

export interface JournalLine {
  id: string;
  account: string;
  description: string;
  debit: number;
  credit: number;
}

export interface StockItem {
  id: string;
  sku: string;
  name: string;
  warehouse: string;
  quantity: number;
  unitCost: number;
  totalValue: number;
  valuationMethod: 'FIFO' | 'LIFO' | 'AVCO';
}

export enum ViewMode {
  ARCHITECT = 'ARCHITECT',
  ERP_PREVIEW = 'ERP_PREVIEW'
}