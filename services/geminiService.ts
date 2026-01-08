
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { Account, Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const getBalanceFunction: FunctionDeclaration = {
  name: 'getBalance',
  parameters: {
    type: Type.OBJECT,
    description: 'Get the current balance of the users accounts.',
    properties: {
      accountName: { type: Type.STRING, description: 'Name of the account' }
    }
  }
};

const getTransactionsFunction: FunctionDeclaration = {
  name: 'getTransactions',
  parameters: {
    type: Type.OBJECT,
    description: 'Retrieve transaction history with filters.',
    properties: {
      category: { type: Type.STRING },
      description: { type: Type.STRING },
      minAmount: { type: Type.NUMBER }
    }
  }
};

const requestTransferFunction: FunctionDeclaration = {
  name: 'requestTransfer',
  parameters: {
    type: Type.OBJECT,
    description: 'Initiate a money transfer.',
    properties: {
      recipientName: { type: Type.STRING },
      amount: { type: Type.NUMBER },
      fromAccount: { type: Type.STRING }
    },
    required: ['amount', 'recipientName']
  }
};

const splitBillFunction: FunctionDeclaration = {
  name: 'splitBill',
  parameters: {
    type: Type.OBJECT,
    description: 'Split a bill among friends.',
    properties: {
      totalAmount: { type: Type.NUMBER },
      numPeople: { type: Type.NUMBER },
      description: { type: Type.STRING }
    },
    required: ['totalAmount', 'numPeople']
  }
};

const exchangeCurrencyFunction: FunctionDeclaration = {
  name: 'exchangeCurrency',
  parameters: {
    type: Type.OBJECT,
    description: 'Exchange money from one currency to another.',
    properties: {
      fromCurrency: { type: Type.STRING },
      toCurrency: { type: Type.STRING },
      amount: { type: Type.NUMBER }
    },
    required: ['fromCurrency', 'toCurrency', 'amount']
  }
};

export const generateBankingResponse = async (
  message: string,
  history: { role: 'user' | 'model', parts: { text: string }[] }[] = [],
  context: { accounts: Account[], transactions: Transaction[] }
) => {
  const contextPrompt = `
You are Nova, the AI for NovaBank. You help with accounts, transactions, transfers, splitting bills, and currency exchange.
Current Context:
Accounts: ${JSON.stringify(context.accounts.map(a => ({ name: a.name, bal: a.balance, cur: a.currency })))}
Recent Transactions: ${JSON.stringify(context.transactions.slice(0, 5))}

Always confirm details before executing transfers, splits, or exchanges using the provided tools.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [...history, { role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: contextPrompt,
        tools: [{
          functionDeclarations: [
            getBalanceFunction,
            getTransactionsFunction,
            requestTransferFunction,
            splitBillFunction,
            exchangeCurrencyFunction
          ]
        }]
      }
    });

    return {
      text: response.text,
      functionCalls: response.functionCalls
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "I'm having trouble connecting to Nova core. Please try again later.", functionCalls: [] };
  }
};
