import { generateEInvoicingEdition } from './generate-e-invoicing-epub-lib.mjs';

generateEInvoicingEdition('en').catch((error) => { console.error(error); process.exitCode = 1; });
