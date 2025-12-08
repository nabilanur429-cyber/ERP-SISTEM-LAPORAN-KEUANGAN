import { PromptSet } from './types';

export const PROMPT_SETS: PromptSet[] = [
  {
    id: 'set-1',
    title: 'Set 1: Accounting Foundation',
    description: 'General Ledger, Double-Entry Enforcement, and Audit Trails.',
    prompts: [
      {
        id: '1.1',
        setId: 'set-1',
        title: 'Django Models & Logic',
        promptText: "Generate a Django model and serializer for an accounting `JournalEntry` and `TransactionLine`. The logic must strictly enforce the double-entry principle (total debit must equal total credit) during the `save()` or `post()` method. Include fields for `multi_currency` handling (base amount and foreign currency amount with exchange rate reference). Also, generate Python unit tests for this enforcement.",
        expectedOutput: "Django Models, Serializers, Validation Logic, Unit Tests"
      },
      {
        id: '1.2',
        setId: 'set-1',
        title: 'OpenAPI Ledger Spec',
        promptText: "As an expert ERP architect, produce an OpenAPI 3.0 specification snippet for the `/accounting/ledger/post` endpoint. Ensure the payload validates that the `date` is within an active posting period and includes required fields like `account_code`, `debit`, `credit`, and `reference`.",
        expectedOutput: "OpenAPI 3.0 YAML/JSON Snippet"
      },
      {
        id: '1.3',
        setId: 'set-1',
        title: 'Audit Trail Compliance',
        promptText: "Draft a compliance document outlining the requirements for an immutable audit trail system in the ERP's General Ledger. Specify necessary fields (User ID, Timestamp, Action Type, Before/After Value) and the database strategy to ensure tamper evidence, fulfilling requirements similar to standard audit trails.",
        expectedOutput: "Compliance Documentation"
      }
    ]
  },
  {
    id: 'set-2',
    title: 'Set 2: Trade Core (Inventory)',
    description: 'Stock Valuation (FIFO/LIFO), Warehousing, and COGS.',
    prompts: [
      {
        id: '2.1',
        setId: 'set-2',
        title: 'Inventory Models',
        promptText: "Generate Django models for `Product`, `Warehouse`, and `StockMove`. The `Product` model must include fields to define the `stock_valuation_method` (choices: FIFO, LIFO, Weighted Average). Ensure the `StockMove` links accurately to the `JournalEntry` (Prompt 1.1) to automatically create COGS/Inventory journal entries upon product shipment or receipt.",
        expectedOutput: "Django Inventory Models"
      },
      {
        id: '2.2',
        setId: 'set-2',
        title: 'COGS Calculation Logic',
        promptText: "Write the Python function (in Django/DRF context) to calculate the Cost of Goods Sold (COGS) for a specific product shipment using the FIFO (First-In, First-Out) valuation method. The function must handle multi-warehouse tracking and automatically generate the necessary accounting entry (Debit COGS, Credit Inventory).",
        expectedOutput: "Python Business Logic for COGS"
      },
      {
        id: '2.3',
        setId: 'set-2',
        title: 'Procurement Workflow',
        promptText: "Produce a detailed workflow specification for the Purchasing ('Procure to Pay') cycle for a trading company. Outline the steps: Request for Quotation (RFQ), Purchase Order (PO) creation, Goods Receipt Note (GRN), and finally, Vendor Bill/Invoice linking to the Accounts Payable (AP) ledger.",
        expectedOutput: "Workflow Specification"
      }
    ]
  },
  {
    id: 'set-3',
    title: 'Set 3: Luxurious UI/UX',
    description: 'Frontend specifications for high-end feel and complex components.',
    prompts: [
      {
        id: '3.1',
        setId: 'set-3',
        title: 'Inventory Table Spec',
        promptText: "Create a detailed component specification for an advanced data table component for the 'Inventory Stock Report'. The design must adhere to a 'luxurious UI' brief: generous spacing, high-contrast typography, and include features such as column freezing, dynamic grouping by warehouse, and inline action buttons for 'Adjust Stock'.",
        expectedOutput: "Component Spec & Styling Guide"
      },
      {
        id: '3.2',
        setId: 'set-3',
        title: 'Sales Order UX',
        promptText: "Describe the layout (Desktop + Mobile) for the 'Sales Order Creation' screen. The screen must prioritize data entry efficiency, featuring a multi-line input table for items, contextual help for pricing rules, and a clearly highlighted total section. Use a premium, muted color palette for visual language.",
        expectedOutput: "Wireframe Description"
      }
    ]
  },
  {
    id: 'set-4',
    title: 'Set 4: DevOps & Migration',
    description: 'Data cleansing, CI/CD, and Change Management.',
    prompts: [
      {
        id: '4.1',
        setId: 'set-4',
        title: 'Data Cleansing Script',
        promptText: "Produce a Python script outline (using Pandas, suitable for Google Colab/local execution) for data cleansing and validation of legacy inventory data (SKUs, Quantity, Cost). The script must check for duplicated records, ensure positive stock quantities, and map old product categories to the new ERP taxonomy.",
        expectedOutput: "Python/Pandas Script"
      },
      {
        id: '4.2',
        setId: 'set-4',
        title: 'CI/CD Pipeline',
        promptText: "You are a DevOps Engineer. Generate a basic YAML definition for a CI/CD pipeline (using GitHub Actions or Google Cloud Build) that automates the deployment of the Python/Django ERP application using Docker. The pipeline must include steps for running unit tests and running database migrations (`python manage.py migrate`).",
        expectedOutput: "CI/CD YAML Configuration"
      }
    ]
  }
];